const FLW_PUBLIC_KEY = 'VOTRE_CLE_PUBLIQUE_FLUTTERWAVE';
const BACKEND_URL = 'http://localhost:3000';

// Base de données étendue
const specialSmoothies = [
    {
        name: "Boost Testostérone 💪",
        price: 2500,
        ingredients: ["Gingembre", "Maca", "Banane", "Lait d'amande"],
        badges: ["🔥 Énergie", "💪 Performance"]
    },
    {
        name: "Passion Night ❤️",
        price: 3000,
        ingredients: ["Fraise", "Chocolat", "Miel", "Ginseng"],
        badges: ["❤️ Aphrodisiaque", "✨ Romance"]
    }
];

const fruitsDatabase = [
    { name: "Papaye", price: 400, emoji: "🍈" },
    { name: "Framboise", price: 600, emoji: "🍇" },
    { name: "Citron", price: 100, emoji: "🍋" },
    { name: "Orange", price: 200, emoji: "🍊" },
    { name: "Myrtille", price: 700, emoji: "🫐" },
    { name: "Grenade", price: 800, emoji: "🍑" },
    { name: "Figue", price: 500, emoji: "🍒" }
];

// État global
let totalPrice = 0;
const selectedIngredients = new Set();

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initSwipers();
    setupEventListeners();
    loadInitialIngredients();
});

function initSwipers() {
    // Carrousel bannière
    new Swiper('.banner-swiper', {
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true }
    });

    // Carrousel spécialités
    new Swiper('.special-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });
}

function setupEventListeners() {
    // Gestionnaire unique pour les ingrédients
    document.getElementById('ingredient-grid').addEventListener('click', (e) => {
        const card = e.target.closest('.ingredient-card');
        if (card) toggleIngredient(card);
    });

    // Formulaire de commande
    document.getElementById('orderForm').addEventListener('submit', handleSubmit);
}

function loadInitialIngredients() {
    const container = document.getElementById('smoothies-container');
    container.innerHTML = specialSmoothies.map(smoothie => `
        <div class="swiper-slide">
            <div class="smoothie-card">
                <h3>${smoothie.name}</h3>
                <p>${smoothie.ingredients.join(', ')}</p>
                <div class="price">${smoothie.price} CFA</div>
                <button class="order-btn" 
                        onclick="handleQuickOrder(${smoothie.price}, '${smoothie.name}')">
                    Commander maintenant 🚀
                </button>
            </div>
        </div>
    `).join('');
}

// Recherche de fruits
function searchFruit() {
    const searchTerm = document.getElementById('fruitSearch').value.toLowerCase().trim();
    const grid = document.getElementById('ingredient-grid');
    
    // Réinitialisation de la grille
    grid.innerHTML = `
        <div class="ingredient-card" data-price="200">🍌 Banane (+200 CFA)</div>
        <div class="ingredient-card" data-price="300">🫚 Gingembre (+300 CFA)</div>
        <div class="ingredient-card" data-price="500">🍓 Fraise (+500 CFA)</div>
        <div class="ingredient-card" data-price="300">🥭 Mangue (+300 CFA)</div>
        <div class="ingredient-card" data-price="400">🥥 Noix de coco (+400 CFA)</div>
        <div class="ingredient-card" data-price="200">🍍 Ananas (+200 CFA)</div>
        <div class="ingredient-card" data-price="500">🍏 Pomme verte (+500 CFA)</div>
        <div class="ingredient-card" data-price="600">🥝 Kiwi (+600 CFA)</div>
        <div class="ingredient-card" data-price="600">🍓 Baies de Goji (+600 CFA)</div>
        <div class="ingredient-card" data-price="300">🌱 Spiruline (+300 CFA)</div>
        <div class="ingredient-card" data-price="500">🍑 Pêche (+500 CFA)</div>
        <div class="ingredient-card" data-price="500">🥥 Açaï (+500 CFA)</div>
        <div class="ingredient-card" data-price="500">🍇 Raisin (+500 CFA)</div>
        <div class="ingredient-card" data-price="300">🥕 Carotte (+300 CFA)</div>
        <div class="ingredient-card" data-price="500">🍉 Pastèque (+500 CFA)</div>
        <div class="ingredient-card" data-price="500">🌰 Chia (+500 CFA)</div>
    `;

    if (searchTerm) {
        const results = fruitsDatabase
            .filter(fruit => fruit.name.toLowerCase().includes(searchTerm))
            .map(fruit => `
                <div class="ingredient-card" data-price="${fruit.price}">
                    ${fruit.emoji} ${fruit.name} (+${fruit.price} CFA)
                </div>
            `).join('');

        grid.innerHTML += results;
    }
}

function toggleIngredient(card) {
    const price = parseInt(card.dataset.price);
    
    card.classList.toggle('selected');
    if (card.classList.contains('selected')) {
        selectedIngredients.add(card);
        totalPrice += price;
    } else {
        selectedIngredients.delete(card);
        totalPrice -= price;
    }
    
    updatePriceDisplay();
    checkValidation();
}

function updatePriceDisplay() {
    const priceElement = document.getElementById('total-price');
    priceElement.textContent = totalPrice;
    priceElement.classList.add('price-update');
    setTimeout(() => priceElement.classList.remove('price-update'), 300);
}

function checkValidation() {
    document.getElementById('validationMsg').style.display = 
        selectedIngredients.size < 4 ? 'block' : 'none';
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('clientName').value,
        email: document.getElementById('clientEmail').value,
        phone: document.getElementById('clientPhone').value,
        payment: document.querySelector('input[name="payment"]:checked')?.value,
        amount: totalPrice
    };

    if (!formData.payment || selectedIngredients.size < 4) {
        alert("Veuillez compléter tous les champs et sélectionner 4 ingrédients");
        return;
    }

    try {
        document.querySelector('.payment-processing').classList.remove('hidden');
        await processPayment(formData);
    } catch (error) {
        console.error('Erreur:', error);
        alert("Erreur lors du traitement de la commande");
    } finally {
        document.querySelector('.payment-processing').classList.add('hidden');
    }
}

async function processPayment(orderData) {
    return new Promise((resolve, reject) => {
        FlutterwaveCheckout({
            public_key: FLW_PUBLIC_KEY,
            tx_ref: `CMD-${Date.now()}`,
            amount: orderData.amount,
            currency: 'XOF',
            payment_options: 'mobilemoney',
            customer: {
                email: orderData.email,
                name: orderData.name,
                phone_number: orderData.phone
            },
            callback: async (response) => {
                if (response.status === 'successful') {
                    try {
                        await saveOrder(orderData, response.transaction_id);
                        showOrderSummary(orderData);
                        resetForm();
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }
            }
        });
    });
}

async function saveOrder(orderData, transactionId) {
    const response = await fetch(`${BACKEND_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...orderData,
            transactionId,
            ingredients: Array.from(selectedIngredients).map(i => i.textContent.trim())
        })
    });

    if (!response.ok) throw new Error('Échec de sauvegarde');
    return response.json();
}

function showOrderSummary(data) {
    const summary = document.getElementById('orderSummary');
    summary.innerHTML = `
        <h3>🎉 Commande confirmée !</h3>
        <p>Montant: ${data.amount} CFA</p>
        <p>Email de confirmation envoyé à ${data.email}</p>
    `;
    summary.classList.remove('hidden');
}

function resetForm() {
    document.getElementById('orderForm').reset();
    selectedIngredients.forEach(card => card.classList.remove('selected'));
    selectedIngredients.clear();
    totalPrice = 0;
    updatePriceDisplay();
    checkValidation();
}

// Commander depuis les spécialités
function handleQuickOrder(price, name) {
    if (confirm(`Confirmez la commande du "${name}" pour ${price} CFA ?`)) {
        alert(`✅ Commande validée ! Préparation en cours...`);
    }
}