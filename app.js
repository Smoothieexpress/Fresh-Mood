document.addEventListener('DOMContentLoaded', () => {
    // Base de données étendue avec 25+ super aliments
    const ingredientsDB = {
        base: [/*...*/],
        extra: [
            {name: 'Spiruline', emoji: '🌿'}, 
            {name: 'Maca', emoji: '🟤'},
            {name: 'Açaï', emoji: '🟣'},
            // ... Ajoutez 22 autres éléments
        ]
    };

    let selectedItems = [];
    
    // Génération dynamique des ingrédients
    function generateIngredients() {
        const mainGrid = document.getElementById('mainIngredients');
        const extraGrid = document.getElementById('extraIngredients');
        
        ingredientsDB.base.forEach(ing => createCard(ing, mainGrid));
        ingredientsDB.extra.forEach(ing => createCard(ing, extraGrid));
    }

    function createCard(ing, container) {
        const card = document.createElement('div');
        card.className = 'ingredient-card';
        card.innerHTML = `${ing.emoji}<br>${ing.name}`;
        card.onclick = () => toggleSelection(card, ing.name);
        container.appendChild(card);
    }

    function toggleSelection(card, name) {
        card.classList.toggle('selected');
        selectedItems = selectedItems.includes(name) 
            ? selectedItems.filter(n => n !== name) 
            : [...selectedItems, name];
        updatePrice();
    }

    function updatePrice() {
        const total = selectedItems.length >= 4 
            ? 1500 + (selectedItems.length - 4) * 200 
            : 0;
        document.getElementById('priceDisplay').textContent = `Total: ${total} CFA`;
        document.getElementById('selectedItems').textContent = 
            `Sélection: ${selectedItems.join(', ') || 'Aucun'}`;
    }

    // Gestion du formulaire
    document.getElementById('orderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        if(selectedItems.length < 4) {
            alert('❌ Sélectionnez au moins 4 ingrédients !');
            return;
        }
        
        alert('✅ Commande validée ! Un email de confirmation a été envoyé.');
        document.getElementById('orderForm').reset();
        selectedItems = [];
        document.querySelectorAll('.selected').forEach(card => card.classList.remove('selected'));
        updatePrice();
    });

    // Initialisation
    generateIngredients();
});