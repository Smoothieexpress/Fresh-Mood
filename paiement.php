<?php
// paiement.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom = $_POST['clientName'] ?? '';
    $telephone = $_POST['clientPhone'] ?? '';
    $montant = $_POST['totalPrice'] ?? 0;
    $methode = $_POST['payment'] ?? '';

    if (empty($nom) || empty($telephone) || empty($montant) || empty($methode)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Informations manquantes.']);
        exit;
    }

    if ($methode === 'mobile') {
        // Exemple de traitement pour Moov Money
        // Remplace cette section par l'intégration réelle de l'API Moov
        // Documentation : https://github.com/v1p3r75/moov-money-api-php-sdk
        $transaction_id = uniqid('moov_', true);
        echo json_encode(['status' => 'success', 'message' => 'Paiement Moov initié.', 'transaction_id' => $transaction_id]);
    } elseif ($methode === 'mtn') {
        // Exemple de traitement pour MTN MoMo
        // Remplace cette section par l'intégration réelle de l'API MTN MoMo
        // Documentation : https://github.com/SixteNow/api-mtn-benin
        $transaction_id = uniqid('mtn_', true);
        echo json_encode(['status' => 'success', 'message' => 'Paiement MTN initié.', 'transaction_id' => $transaction_id]);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Méthode de paiement invalide.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée.']);
}
?>