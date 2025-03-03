document.addEventListener('DOMContentLoaded', () => {
    emailjs.init('VOTRE_ID_EMAILJS'); // Remplacez par votre ID

    // Base de données complète
    const ingredientsDB = {
        base: [
            { name: 'Pomme', emoji: '🍎' },
            { name: 'Banane', emoji: '🍌' },
            { name: 'Fraise', emoji: '🍓' },
            { name: 'Mangue', emoji: '🥭' }
        ],
        extra: [
            { name: 'Concombre', emoji: '🥒' },
            { name: 'Spiruline', emoji: '🌿' },
            { name: 'Gingembre', emoji: '🟠' },
            { name: 'Chia', emoji: '💧' },
            { name: 'Kale', emoji: '🥬' },
            { name: 'Grenade', emoji: '🍈' },
            { name: 'Myrtilles', emoji: '🫐' },
            { name: 'Avocat', emoji: '🥑' },
            { name: 'Gingembre', emoji: '🍠' },
            { name: 'Curcuma', emoji: '🟡' },
            // Ajoutez 15+ autres ingrédients ici
        ]
    };

    let selectedItems = [];
    const basePrice = 1500;

    // Génération des ingrédients
    function generateIngredients() {
        const mainGrid = document.getElementById('mainIngredients');
        const extraGrid = document.getElementById('extraIngredients');

        ingredientsDB.base.forEach(ing => {
            const card = document.createElement('div');
            card.className = 'ingredient-card';
            card.dataset.emoji = ing.emoji;
            card.textContent = ing.name;
            mainGrid.appendChild(card);
        });

        ingredientsDB.extra.forEach(ing => {
            const card = document.createElement('div');
            card.className = 'ingredient-card';
            card.dataset.emoji = ing.emoji;
            card.textContent = ing.name;
            extraGrid.appendChild(card);
        });

        // Gestion des clics
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
    }

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
            showNotification(`
                Merci ${formData.name} ! 🎉
                ${formData.payment === 'mobile' 
                    ? '📱 Paiement Mobile Money : +229 66953934' 
                    : '💳 Paiement par carte bancaire'}
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

    // Notifications
    function showNotification(msg, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = msg.replace(/\n/g, '<br>');
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    // Gestion des super aliments
    document.querySelector('.toggle-ingredients').addEventListener('click', () => {
        document.getElementById('extraIngredients').classList.toggle('hidden');
    });

    // Initialisation
    generateIngredients();
});