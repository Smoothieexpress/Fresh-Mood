// Base de données des fruits et légumes
const ingredients = [
    // Fruits
    { name: "🍌 Banane", price: 200, category: "fruit" },
    { name: "🍓 Fraise", price: 500, category: "fruit" },
    { name: "🥭 Mangue", price: 300, category: "fruit" },
    { name: "🥥 Noix de coco", price: 400, category: "fruit" },
    { name: "🍍 Ananas", price: 200, category: "fruit" },
    { name: "🍏 Pomme verte", price: 500, category: "fruit" },
    { name: "🥝 Kiwi", price: 600, category: "fruit" },
    { name: "🍑 Pêche", price: 500, category: "fruit" },
    { name: "🍇 Raisin", price: 500, category: "fruit" },
    { name: "🍉 Pastèque", price: 500, category: "fruit" },
    { name: "🍊 Orange", price: 300, category: "fruit" },
    { name: "🍋 Citron", price: 250, category: "fruit" },
    { name: "🍈 Melon", price: 450, category: "fruit" },
    { name: "🍒 Cerise", price: 700, category: "fruit" },
    { name: "🍐 Poire", price: 400, category: "fruit" },
    { name: "🍏 Pomme rouge", price: 500, category: "fruit" },
    { name: "🍉 Grenade", price: 600, category: "fruit" },
    { name: "🥑 Avocat", price: 700, category: "fruit" },
    { name: "🥥 Açaï", price: 500, category: "fruit" },
    { name: "🍈 Fruit de la passion", price: 600, category: "fruit" },
    { name: "🍉 Baies de Goji", price: 600, category: "fruit" },
    { name: "🫐 Myrtille", price: 700, category: "fruit" },
    { name: "🍓 Framboise", price: 650, category: "fruit" },
    { name: "🍑 Nectarine", price: 550, category: "fruit" },
    { name: "🥭 Papaye", price: 400, category: "fruit" },
    { name: "🥥 Litchi", price: 600, category: "fruit" },
    { name: "🍊 Clémentine", price: 350, category: "fruit" },
    { name: "🍋 Lime", price: 300, category: "fruit" },
    { name: "🍌 Plantain", price: 250, category: "fruit" },
    { name: "🍏 Kaki", price: 600, category: "fruit" },

    // Légumes
    { name: "🥕 Carotte", price: 300, category: "legume" },
    { name: "🥒 Concombre", price: 250, category: "legume" },
    { name: "🥬 Épinard", price: 300, category: "legume" },
    { name: "🥦 Brocoli", price: 400, category: "legume" },
    { name: "🥬 Kale", price: 500, category: "legume" },
    { name: "🥗 Roquette", price: 400, category: "legume" },
    { name: "🥒 Courgette", price: 350, category: "legume" },
    { name: "🌶 Poivron rouge", price: 300, category: "legume" },
    { name: "🌶 Poivron jaune", price: 300, category: "legume" },
    { name: "🌶 Poivron vert", price: 300, category: "legume" },
    { name: "🥬 Chou vert", price: 350, category: "legume" },
    { name: "🥬 Chou rouge", price: 350, category: "legume" },
    { name: "🥒 Céleri", price: 250, category: "legume" },
    { name: "🧄 Ail", price: 100, category: "legume" },
    { name: "🧅 Oignon", price: 150, category: "legume" },
    { name: "🌱 Cresson", price: 400, category: "legume" },
    { name: "🥔 Patate douce", price: 350, category: "legume" },
    { name: "🍠 Betterave", price: 400, category: "legume" },

    // Racines et compléments
    { name: "🫚 Gingembre", price: 300, category: "racine" },
    { name: "🟠 Curcuma", price: 300, category: "racine" },
    { name: "🌱 Moringa", price: 500, category: "complement" },
    { name: "🌿 Spiruline", price: 300, category: "complement" },
    { name: "🍃 Chlorelle", price: 350, category: "complement" },
    { name: "🍵 Matcha", price: 600, category: "complement" },
    { name: "🌾 Herbe de blé", price: 500, category: "complement" },

    // Graines et noix
    { name: "🌰 Chia", price: 500, category: "graine" },
    { name: "🌻 Graines de tournesol", price: 400, category: "graine" },
    { name: "🎃 Graines de courge", price: 450, category: "graine" },
    { name: "🥜 Amandes", price: 700, category: "noix" },
    { name: "🥜 Noisettes", price: 750, category: "noix" },
    { name: "🥜 Noix de cajou", price: 800, category: "noix" },
    { name: "🌰 Noix du Brésil", price: 850, category: "noix" },

    // Autres super-aliments
    { name: "🍯 Miel", price: 600, category: "sucrant" },
    { name: "🍁 Sirop d'érable", price: 700, category: "sucrant" },
    { name: "🥥 Lait de coco", price: 500, category: "lait" },
    { name: "🥛 Lait d’amande", price: 600, category: "lait" },
    { name: "🥛 Lait de soja", price: 550, category: "lait" },
    { name: "🥛 Lait de noisette", price: 650, category: "lait" },
    { name: "🥤 Protéines végétales", price: 800, category: "complement" },
    { name: "🍫 Cacao cru", price: 700, category: "complement" },
    { name: "🥥 Beurre de coco", price: 750, category: "complement" },
];

console.log(ingredients);
    // Ajouter d'autres éléments selon besoin
];

// Gestion de la bannière
const bannerImages = document.querySelectorAll('.banner-background img');
let currentImageIndex = 0;

function changeBannerImage() {
    bannerImages[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % bannerImages.length;
    bannerImages[currentImageIndex].classList.add('active');
}

setInterval(changeBannerImage, 5000);

// Gestion des ingrédients
function displayIngredients(searchTerm = '') {
    const filtered = fruitsAndVegetables.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const grid = document.getElementById('ingredientGrid');
    grid.innerHTML = filtered.map(item => `
        <div class="ingredient-card" data-price="${item.price}">
            ${item.name} (+${item.price} CFA)
        </div>
    `).join('');
    
    setupIngredients();
}

// Gestion de la recherche
document.getElementById('searchIngredient').addEventListener('input', (e) => {
    displayIngredients(e.target.value);
});

// Modification de l'initialisation
document.addEventListener('DOMContentLoaded', () => {
    initSwiper();
    displayIngredients();
    setupOrderForm();
    setupIngredients();
});

// Le reste du code JavaScript original reste inchangé
... (garder le reste du JavaScript existant)
const FLW_PUBLIC_KEY = 'VOTRE_CLE_PUBLIQUE_FLUTTERWAVE';
const BACKEND_URL = 'http://localhost:3000';
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

let totalPrice = 0;
const selectedIngredients = new Set();

document.addEventListener('DOMContentLoaded', () => {
    initSwiper();
    setupIngredients();
    setupOrderForm();
});

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        loop: true,
    });

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

function setupIngredients() {
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', () => {
            const price = parseInt(card.dataset.price);
            
            if(card.classList.toggle('selected')) {
                selectedIngredients.add(card);
                totalPrice += price;
            } else {
                selectedIngredients.delete(card);
                totalPrice -= price;
            }
            
            updatePriceDisplay();
            checkValidation();
        });
    });
}

function updatePriceDisplay() {
    document.getElementById('total-price').textContent = totalPrice;
    document.getElementById('total-price').classList.add('price-update');
    setTimeout(() => {
        document.getElementById('total-price').classList.remove('price-update');
    }, 300);
}

function checkValidation() {
    document.getElementById('validationMsg').style.display = 
        selectedIngredients.size < 4 ? 'block' : 'none';
}

function handleQuickOrder(price, name) {
    if(confirm(`Confirmez la commande du "${name}" pour ${price} CFA ?`)) {
        alert(`✅ Commande validée ! Préparation en cours...`);
    }
}

function setupOrderForm() {
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const clientName = document.getElementById('clientName').value;
        const clientEmail = document.getElementById('clientEmail').value;
        const clientPhone = document.getElementById('clientPhone').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked');

        if (!paymentMethod || selectedIngredients.size < 4) {
            alert("Veuillez compléter tous les champs et sélectionner 4 ingrédients");
            return;
        }

        try {
            document.querySelector('.payment-processing').classList.remove('hidden');

            if (paymentMethod.value === 'mobile') {
                await processMobileMoneyPayment({
                    name: clientName,
                    email: clientEmail,
                    phone: clientPhone,
                    amount: totalPrice
                });
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert("Erreur lors du traitement de la commande");
        } finally {
            document.querySelector('.payment-processing').classList.add('hidden');
        }
    });
}

async function processMobileMoneyPayment(orderData) {
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
                        const dbResponse = await fetch(`${BACKEND_URL}/orders`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...orderData,
                                transactionId: response.transaction_id,
                                ingredients: Array.from(selectedIngredients).map(i => i.textContent.trim())
                            })
                        });

                        if (dbResponse.ok) {
                            const result = await dbResponse.json();
                            showOrderSummary(result);
                            sendConfirmationEmail(orderData.email);
                            updateLoyaltyPoints(orderData.email);
                            resetForm();
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                }
            }
        });
    });
}

async function sendConfirmationEmail(email) {
    try {
        await fetch(`${BACKEND_URL}/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                subject: 'Confirmation de commande',
                message: `Merci pour votre commande de ${totalPrice} CFA !`
            })
        });
    } catch (error) {
        console.error("Erreur d'envoi d'email:", error);
    }
}

async function updateLoyaltyPoints(email) {
    try {
        const response = await fetch(`${BACKEND_URL}/customers/${email}/points`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Points fidélité:', data.points);
        }
    } catch (error) {
        console.error('Erreur de fidélisation:', error);
    }
}

function showOrderSummary(data) {
    const summary = document.getElementById('orderSummary');
    summary.innerHTML = `
        <h3>🎉 Commande #${data.orderId} confirmée !</h3>
        <p>Montant: ${data.amount} CFA</p>
        <p>Points acquis: ${data.points}</p>
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
// Gestion de la bannière
const bannerImages = document.querySelectorAll('.promo-banner img');
let currentBannerIndex = 0;

function cycleBanner() {
    bannerImages[currentBannerIndex].classList.remove('active');
    currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
    bannerImages[currentBannerIndex].classList.add('active');
    
    // Réinitialisation de l'animation
    bannerImages.forEach(img => {
        img.style.animation = 'none';
        void img.offsetWidth; // Déclenche un reflow
        img.style.animation = 'zoomInOut 25s infinite';
    });
}

setInterval(cycleBanner, 5000);
// Base de données des ingrédients
const fruitsAndVegetables = [/*...*/];

// Système de sélection
let totalPrice = 0;
const selectedIngredients = new Set();

function updateSelection(card) {
    const price = parseInt(card.dataset.price);
    
    if (selectedIngredients.has(card)) {
        card.classList.remove('selected');
        selectedIngredients.delete(card);
        totalPrice -= price;
    } else {
        card.classList.add('selected');
        selectedIngredients.add(card);
        totalPrice += price;
    }
    
    document.getElementById('total-price').textContent = totalPrice;
    checkValidation();
}

// Initialisation des ingrédients
function setupIngredients() {
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', () => updateSelection(card));
    });
}

// Animation de la bannière
let currentBannerIndex = 0;

function cycleBanner() {
    const banners = document.querySelectorAll('.promo-banner img');
    banners[currentBannerIndex].classList.remove('active');
    currentBannerIndex = (currentBannerIndex + 1) % banners.length;
    banners[currentBannerIndex].classList.add('active');
}

setInterval(cycleBanner, 5000);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    setupIngredients();
    // Autres initialisations...
});
// Animation de la bannière
const bannerImages = document.querySelectorAll('.promo-banner img');
let currentBannerIndex = 0;

function cycleBanner() {
    bannerImages[currentBannerIndex].classList.remove('active');
    currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
    bannerImages[currentBannerIndex].classList.add('active');
    
    // Réinitialisation fluide de l'animation
    bannerImages.forEach(img => {
        img.style.animation = 'none';
        void img.offsetWidth;
        img.style.animation = 'zoomInOut 25s infinite';
    });
}

setInterval(cycleBanner, 5000);
// Animation de la bannière
const bannerImages = document.querySelectorAll('.promo-banner img');
let currentBannerIndex = 0;

function cycleBanner() {
    bannerImages[currentBannerIndex].classList.remove('active');
    currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
    bannerImages[currentBannerIndex].classList.add('active');
    
    // Réinitialisation de l'animation
    bannerImages.forEach(img => {
        img.style.animation = 'none';
        void img.offsetWidth; // Déclenche un reflow
        img.style.animation = 'zoomDezoom 25s infinite';
    });
}

setInterval(cycleBanner, 5000);

// Sélection des ingrédients
let totalPrice = 0;
const selectedIngredients = new Set();

function setupIngredients() {
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', () => {
            const price = parseInt(card.dataset.price);
            
            if (selectedIngredients.has(card)) {
                card.classList.remove('selected');
                selectedIngredients.delete(card);
                totalPrice -= price;
            } else {
                card.classList.add('selected');
                selectedIngredients.add(card);
                totalPrice += price;
            }
            
            document.getElementById('total-price').textContent = totalPrice;
            checkValidation();
        });
    });
}

// Validation
function checkValidation() {
    const validationMsg = document.getElementById('validationMsg');
    validationMsg.style.display = selectedIngredients.size < 4 ? 'block' : 'none';
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    setupIngredients();
});
// Animation de la bannière
const bannerImages = document.querySelectorAll('.promo-banner img');
let currentBannerIndex = 0;

function cycleBanner() {
    bannerImages[currentBannerIndex].classList.remove('active');
    currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
    bannerImages[currentBannerIndex].classList.add('active');
    
    // Réinitialisation de l'animation
    bannerImages.forEach(img => {
        img.style.animation = 'none';
        void img.offsetWidth; // Déclenche un reflow
        img.style.animation = 'zoomDezoom 25s infinite';
    });
}

setInterval(cycleBanner, 5000);

// Sélection des ingrédients
let totalPrice = 0;
const selectedIngredients = new Set();

function setupIngredients() {
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', () => {
            const price = parseInt(card.dataset.price);
            
            if (selectedIngredients.has(card)) {
                card.classList.remove('selected');
                selectedIngredients.delete(card);
                totalPrice -= price;
            } else {
                card.classList.add('selected');
                selectedIngredients.add(card);
                totalPrice += price;
            }
            
            document.getElementById('total-price').textContent = totalPrice;
            checkValidation();
        });
    });
}

// Validation
function checkValidation() {
    const validationMsg = document.getElementById('validationMsg');
    validationMsg.style.display = selectedIngredients.size < 4 ? 'block' : 'none';
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    setupIngredients();
});