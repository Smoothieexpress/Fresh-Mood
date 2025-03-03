document.addEventListener('DOMContentLoaded', () => {
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
            { name: 'Grenade', emoji: '🍈' }
        ]
    };

    let selectedItems = [];
    const basePrice = 1500;

    // Remplacer la fonction generateIngredients() par :
function generateIngredients() {
    const mainGrid = document.getElementById('mainIngredients');
    const extraGrid = document.getElementById('extraIngredients');

    // Réinitialiser les grilles
    mainGrid.innerHTML = '';
    extraGrid.innerHTML = '';

    // Génération dynamique avec délégation d'événements
    ingredientsDB.base.forEach(ing => {
        const card = document.createElement('div');
        card.className = 'ingredient-card';
        card.innerHTML = `<span>${ing.emoji}</span>${ing.name}`;
        card.addEventListener('click', toggleSelection);
        mainGrid.appendChild(card);
    });

    ingredientsDB.extra.forEach(ing => {
        const card = document.createElement('div');
        card.className = 'ingredient-card';
        card.innerHTML = `<span>${ing.emoji}</span>${ing.name}`;
        card.addEventListener('click', toggleSelection);
        extraGrid.appendChild(card);
    });
}

// Nouvelle fonction de sélection
function toggleSelection() {
    this.classList.toggle('selected');
    const ingredient = this.textContent.trim();
    
    selectedItems = selectedItems.includes(ingredient)
        ? selectedItems.filter(item => item !== ingredient)
        : [...selectedItems, ingredient];
    
    updatePrice();
}