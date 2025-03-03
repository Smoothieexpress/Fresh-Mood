// Initialisation des super aliments (25+ éléments)
const ingredientsDB = {
    base: [/* ... */],
    extra: [
        { name: 'Spiruline', emoji: '🌿' },
        { name: 'Gingembre', emoji: '🟠' },
        { name: 'Graines de Chia', emoji: '💧' },
        { name: 'Maca', emoji: '🟤' },
        { name: 'Camu Camu', emoji: '🍒' },
        { name: 'Açaï', emoji: '🟣' },
        // ... Ajoutez 20+ autres super aliments
    ]
};

// Gestion du toggle
document.querySelector('.toggle-ingredients').addEventListener('click', () => {
    const extraSection = document.getElementById('extraIngredients');
    extraSection.classList.toggle('hidden');
    document.querySelector('.toggle-ingredients').innerHTML = 
        extraSection.classList.contains('hidden') 
        ? '<span class="blink">▼</span> Voir les 25+ super aliments <span class="blink">▼</span>' 
        : '<span class="blink">▲</span> Masquer les super aliments <span class="blink">▲</span>';
});