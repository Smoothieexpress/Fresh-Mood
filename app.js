document.addEventListener('DOMContentLoaded', () => {
    emailjs.init('VOTRE_ID_EMAILJS'); // Remplacez par votre ID

    // Gestion des ingrédients
    let selectedItems = [];
    const basePrice = 1500;

    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
            const ingredient = card.textContent.trim();
            
            selectedItems = selectedItems.includes(ingredient)
                ? selectedItems.filter(item => item !== ingredient)
                : [...selectedItems, ingredient];
            
            updatePrice();
        });
    });

    // Calcul du prix
    function updatePrice() {
        const total = selectedItems.length >= 4 
            ? basePrice + ((selectedItems.length - 4) * 200)
            : 0;
            
        document.getElementById('priceDisplay').textContent = `Total: ${total} CFA`;
        document.getElementById('selectedItems').textContent = 
            `Sélection : ${selectedItems.join(', ') || 'Aucun ingrédient'}`;
    }

    // Gestion du formulaire
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validation
        if(selectedItems.length < 4) {
            showNotification('❌ Sélectionnez au moins 4 ingrédients !', 'error');
            return;
        }

        const formData = {
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            payment: document.querySelector('input[name="payment"]:checked').value,
            total: basePrice + ((selectedItems.length - 4) * 200)
        };

        try {
            // Envoi email
            await emailjs.send('service_id', 'template_id', {
                to_email: 'smoothieexprss@gmail.com',
                message: `Nouvelle commande de ${formData.name} (${formData.phone}) - Total: ${formData.total} CFA`
            });

            // Confirmation
            const paymentMsg = formData.payment === 'mobile' 
                ? '📱 Paiement Mobile Money : +229 66953934' 
                : '💳 Paiement par carte bancaire';
            
            showNotification(`
                Merci ${formData.name} ! 🎉
                ${paymentMsg}
                Confirmation envoyée à : ${formData.email}
            `);

            // Réinitialisation
            document.getElementById('orderForm').reset();
            selectedItems = [];
            document.querySelectorAll('.selected').forEach(card => card.classList.remove('selected'));
            updatePrice();

        } catch (error) {
            showNotification('Erreur lors de la commande 😢 Veuillez réessayer', 'error');
        }
    });

    // Fonction de notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message.replace(/\n/g, '<br>');
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    // Gestion des super aliments
    document.querySelector('.toggle-ingredients').addEventListener('click', () => {
        document.getElementById('extraIngredients').classList.toggle('hidden');
    });
});