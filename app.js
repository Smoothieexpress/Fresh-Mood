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

    // Génération des ingrédients
    function generateIngredients() {
        const mainGrid = document.getElementById('mainIngredients');
        const extraGrid = document.getElementById('extraIngredients');

        ingredientsDB.base.forEach(ing => {
            mainGrid.innerHTML += `
                <div class="ingredient-card">
                    <span>${ing.emoji}</span>
                    ${ing.name}
                </div>
            `;
        });

        ingredientsDB.extra.forEach(ing => {
            extraGrid.innerHTML += `
                <div class="ingredient-card">
                    <span>${ing.emoji}</span>
                    ${ing.name}
                </div>
            `;
        });
    }

    // Gestion des sélections
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
        let total = 0;
        if(selectedItems.length >= 4) {
            total = basePrice + ((selectedItems.length - 4) * 200);
        }
        
        document.getElementById('priceDisplay').textContent = `Total: ${total} CFA`;
        document.getElementById('selectedItems').textContent = 
            `Sélection : ${selectedItems.join(', ') || 'Aucun ingrédient sélectionné'}`;
    }

    // Gestion des super aliments
    document.querySelector('.toggle-ingredients').addEventListener('click', () => {
        const extraSection = document.getElementById('extraIngredients');
        extraSection.classList.toggle('hidden');
        document.querySelector('.toggle-ingredients').textContent = 
            extraSection.classList.contains('hidden') 
            ? 'Voir les 25+ super aliments ▼' 
            : 'Masquer les super aliments ▲';
    });

    // Initialisation
    generateIngredients();
});