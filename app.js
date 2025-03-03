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
            { name: 'Spiruline', emoji: '🌱' },
            { name: 'Gingembre', emoji: '🟤' },
            { name: 'Graines de Chia', emoji: '💧' }
        ]
    };

    let selectedItems = [];
    const basePrice = 1500;

    // Génération des ingrédients
    function generateIngredients() {
        const containers = {
            main: document.getElementById('mainIngredients'),
            extra: document.getElementById('extraIngredients')
        };

        for(const type in containers) {
            containers[type].innerHTML = ingredientsDB[type].map(ing => `
                <div class="ingredient-card">
                    <span>${ing.emoji}</span>
                    ${ing.name}
                </div>
            `).join('');
        }
    }

    // Gestion des clics
    function handleIngredientClick(card) {
        card.classList.toggle('selected');
        const name = card.textContent.trim();
        
        selectedItems = selectedItems.includes(name) 
            ? selectedItems.filter(i => i !== name) 
            : [...selectedItems, name];
        
        updatePrice();
    }

    // Calcul du prix
    function updatePrice() {
        const total = selectedItems.length >= 4 
            ? basePrice + ((selectedItems.length - 4) * 200)
            : 0;
        
        document.getElementById('priceDisplay').textContent = `Total: ${total} CFA`;
    }

    // Initialisation
    generateIngredients();
    
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', () => handleIngredientClick(card));
    });

    // Gestion des super aliments
    document.querySelector('.toggle-ingredients').addEventListener('click', () => {
        const extraSection = document.getElementById('extraIngredients');
        extraSection.classList.toggle('hidden');
        document.querySelector('.toggle-ingredients').textContent = 
            extraSection.classList.contains('hidden')
            ? 'Voir les 25+ super aliments 🔽'
            : 'Masquer les super aliments 🔼';
    });
});