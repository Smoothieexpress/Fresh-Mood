// Fonctionnalité du menu hamburger
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

// Sélection des fruits
const fruitButtons = document.querySelectorAll('.fruit-btn');
const selectedFruitsContainer = document.getElementById('selected-fruits');
let selectedFruits = [];

fruitButtons.forEach(button => {
    button.addEventListener('click', () => {
        const fruit = button.textContent.trim();
        if (!selectedFruits.includes(fruit)) {
            selectedFruits.push(fruit);
        } else {
            selectedFruits = selectedFruits.filter(f => f !== fruit);
        }
        displaySelectedFruits();
    });
});

function displaySelectedFruits() {
    selectedFruitsContainer.innerHTML = selectedFruits.map(fruit => `<span class='bg-purple-500 text-white px-2 py-1 rounded-md'>${fruit}</span>`).join(' ');
}

// Validation du formulaire de commande
const orderForm = document.getElementById('order-form');

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    if (name && phone && selectedFruits.length > 0) {
        alert(`Commande passée avec succès !\nNom: ${name}\nTéléphone: ${phone}\nFruits sélectionnés: ${selectedFruits.join(', ')}`);
        orderForm.reset();
        selectedFruits = [];
        displaySelectedFruits();
    } else {
        alert('Veuillez remplir tous les champs et sélectionner au moins un fruit.');
    }
});
