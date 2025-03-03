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

        // Nettoyer les grilles
        mainGrid.innerHTML = '';
        extraGrid.innerHTML = '';

        // Générer les ingrédients de base
        ingredientsDB.base.forEach(ing => {
            const card = document.createElement('div');
            card.className = 'ingredient-card';
            card.innerHTML = `<span>${ing.emoji}</span>${ing.name}`;
            mainGrid.appendChild(card);
        });

        // Générer les super aliments
        ingredientsDB.extra.forEach(ing => {
            const card = document.createElement('div');
            card.className = 'ingredient-card';
            card.innerHTML = `<span>${ing.emoji}</span>${ing.name}`;
            extraGrid.appendChild(card);
        });

        // Gestion des clics par délégation d'événements
        document.querySelectorAll('.ingredient-grid').forEach(grid => {
            grid.addEventListener('click', (e) => {
                const card = e.target.closest('.ingredient-card');
                if (card) {
                    card.classList.toggle('selected');
                    const ingredient = card.textContent.trim();
                    
                    selectedItems = selectedItems.includes(ingredient)
                        ? selectedItems.filter(item => item !== ingredient)
                        : [...selectedItems, ingredient];
                    
                    updatePrice();
                }
            });
        });
    }

    // Calcul du prix
    function updatePrice() {
        let total = 0;
        if(selectedItems.length >= 4) {
            total = basePrice + ((selectedItems.length - 4) * 200);
        }
        
        document.getElementById('priceDisplay').textContent = `Total: ${total} CFA`;
        document.getElementById('selectedItems').textContent = 
            `Sélection : ${selectedItems.join(', ') || 'Aucun ingrédient'}`;
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