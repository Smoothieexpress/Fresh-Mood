document.addEventListener('DOMContentLoaded', () => {
    const ingredientsDB = {
        base: [
            { name: 'Pomme', emoji: '🍎', price: 0 },
            { name: 'Banane', emoji: '🍌', price: 0 },
            { name: 'Fraise', emoji: '🍓', price: 0 },
            { name: 'Mangue', emoji: '🥭', price: 0 }
        ],
        extra: [
            { name: 'Spiruline', emoji: '🌿', price: 500 },
            { name: 'Gingembre', emoji: '🦠', price: 300 },
            { name: 'Mûres', emoji: '🫐', price: 400 },
            { name: 'Chia', emoji: '💧', price: 600 }
        ]
    };

    let selectedItems = [];
    const basePrice = 1500;
    
    // Génération des ingrédients
    function generateIngredients(containerId, ingredients) {
        const container = document.getElementById(containerId);
        container.innerHTML = ingredients.map(ing => `
            <div class="ingredient-card" data-price="${ing.price}">
                <span>${ing.emoji}</span>
                ${ing.name}
            </div>
        `).join('');
    }

    // Gestion des sélections
    function handleSelections(card) {
        card.classList.toggle('selected');
        const ingredient = card.textContent.trim();
        
        if(selectedItems.includes(ingredient)) {
            selectedItems = selectedItems.filter(i => i !== ingredient);
        } else {
            selectedItems.push(ingredient);
        }
        
        updateSelectionSummary();
        calculatePrice();
    }

    // Calcul du prix
    function calculatePrice() {
        let total = basePrice;
        const extraCost = selectedItems
            .filter(item => ingredientsDB.extra.some(e => e.name === item))
            .reduce((sum, item) => sum + (ingredientsDB.extra.find(e => e.name === item).price), 0);
        
        total += extraCost;
        
        if(selectedItems.length > 4) {
            total += (selectedItems.length - 4) * 200;
        }
        
        document.getElementById('priceDisplay').textContent = `Total: ${total} CFA`;
    }

    // Initialisation
    generateIngredients('mainIngredients', ingredientsDB.base);
    generateIngredients('extraIngredients', ingredientsDB.extra);

    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', () => handleSelections(card));
    });

    // Gestion des ingrédients supplémentaires
    document.querySelector('.toggle-ingredients').addEventListener('click', () => {
        document.getElementById('extraIngredients').classList.toggle('hidden');
        document.querySelector('.toggle-ingredients').textContent = 
            document.getElementById('extraIngredients').classList.contains('hidden') 
            ? 'Voir les 25+ super aliments 🔽' 
            : 'Masquer les super aliments 🔼';
    });
});