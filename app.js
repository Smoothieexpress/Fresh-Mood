document.addEventListener('DOMContentLoaded', () => {
    const ingredientsDB = [
        { name: 'Pomme', emoji: '🍎', price: 0 },
        { name: 'Banane', emoji: '🍌', price: 0 },
        { name: 'Fraise', emoji: '🍓', price: 0 },
        { name: 'Mangue', emoji: '🥭', price: 0 },
        { name: 'Ananas', emoji: '🍍', price: 0 },
        { name: 'Kiwi', emoji: '🥝', price: 0 },
        // Ajoutez d'autres ingrédients ici
    ];

    const menuSection = document.querySelector('.menu-section');
    const showAllBtn = document.querySelector('.show-all');
    
    // Génération dynamique des fruits
    ingredientsDB.forEach(ingredient => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <span>${ingredient.emoji}</span>
            ${ingredient.name}
        `;
        menuSection.appendChild(div);
    });

    // Logique de sélection
    let selectedItems = [];
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('selected');
            const ingredient = item.textContent.trim();
            
            if(selectedItems.includes(ingredient)) {
                selectedItems = selectedItems.filter(i => i !== ingredient);
            } else {
                selectedItems.push(ingredient);
            }
            
            updatePrice();
        });
    });

    // Calcul du prix
    function updatePrice() {
        let total = 0;
        const basePrice = 1500;
        const maxBaseItems = 4;
        
        if(selectedItems.length >= maxBaseItems) {
            total = basePrice + ((selectedItems.length - maxBaseItems) * 200);
        }
        
        document.getElementById('priceDisplay').textContent = `
            Total: ${total} CFA ${total > 0 ? `(Base ${basePrice} CFA pour 4 fruits)` : ''}
        `;
    }

    // Gestion du formulaire
    document.getElementById('orderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        
        if(selectedItems.length === 0) {
            alert('Veuillez sélectionner au moins 4 fruits !');
            return;
        }

        if(paymentMethod) {
            alert(`Commande validée ! Mode de paiement : ${paymentMethod.value.toUpperCase()}`);
        }
    });

    // Voir tous les ingrédients
    showAllBtn.addEventListener('click', () => {
        // Implémentez ici la logique pour afficher tous les ingrédients
        alert('Fonctionnalité en développement ! 🚧');
    });
});