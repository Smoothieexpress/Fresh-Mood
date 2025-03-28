require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const Flutterwave = require('flutterwave-node-v3');
const sgMail = require('@sendgrid/mail');

const app = express();
const port = 3000;

// Configuration
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const flw = new Flutterwave(
    process.env.FLW_PUBLIC_KEY,
    process.env.FLW_SECRET_KEY
);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(express.json());

// Endpoints
app.post('/orders', async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const { name, email, phone, amount, transactionId, ingredients } = req.body;

        // Enregistrement client
        await connection.execute(
            `INSERT INTO clients (email, nom, telephone) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE telephone = VALUES(telephone)`,
            [email, name, phone]
        );

        // Enregistrement commande
        const [order] = await connection.execute(
            `INSERT INTO commandes (client_id, montant, transaction_id, ingredients)
            VALUES ((SELECT id FROM clients WHERE email = ?), ?, ?, ?)`,
            [email, amount, transactionId, JSON.stringify(ingredients)]
        );

        // Calcul points
        const points = Math.floor(amount / 100);
        await connection.execute(
            `UPDATE clients SET points_fidelite = points_fidelite + ? 
            WHERE email = ?`,
            [points, email]
        );

        await connection.commit();
        res.json({
            success: true,
            orderId: order.insertId,
            points: points,
            email: email,
            amount: amount
        });

        // Emit order status update (initial status)
        setTimeout(() => emitOrderStatus(order.insertId, 'En préparation'), 5000);
        setTimeout(() => emitOrderStatus(order.insertId, 'En route'), 10000);
        setTimeout(() => emitOrderStatus(order.insertId, 'Livré'), 15000);

    } catch (error) {
        await connection.rollback();
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        connection.release();
    }
});

// Endpoint SSE pour le suivi de commande
app.get('/orders/:orderId/status', (req, res) => {
    const orderId = req.params.orderId;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const intervalId = setInterval(async () => {
        const [rows] = await db.execute('SELECT status FROM commandes WHERE id = ?', [orderId]);
        if (rows.length > 0) {
            res.write(`data: ${JSON.stringify({ status: rows[0].status })}\n\n`);

            if (rows[0].status === 'Livré') {
                clearInterval(intervalId);
                res.end();
            }
        } else {
            clearInterval(intervalId);
            res.status(404).json({ error: 'Commande non trouvée' });
            res.end();
        }
    }, 5000);

    req.on('close', () => {
        clearInterval(intervalId);
    });
});

app.post('/send-email', async (req, res) => {
    try {
        const msg = {
            to: req.body.email,
            from: 'no-reply@smoothiexpress.com',
            subject: req.body.subject,
            text: req.body.message
        };
        
        await sgMail.send(msg);
        res.json({ success: true });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/customers/:email/points', async (req, res) => {
    try {
        const [result] = await db.execute(
            `UPDATE clients 
            SET points_fidelite = points_fidelite + 1 
            WHERE email = ?`,
            [req.params.email]
        );
        
        res.json({ 
            success: true,
            points: result.affectedRows ? 'Mis à jour' : 'Non modifié'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Serveur prêt sur http://localhost:${port}`);
});

function emitOrderStatus(orderId, status) {
    db.execute('UPDATE commandes SET status = ? WHERE id = ?', [status, orderId]);
}
