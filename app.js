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
    },
    {
        name: "Green Detox 🌱",
        price: 2000,
        ingredients: ["Épinard", "Pomme", "Concombre", "Citron"],
        badges: ["🌿 Détox", "💧 Hydratation"]
    },
    {
        name: "Tropical Bliss 🍍",
        price: 2500,
        ingredients: ["Mangue", "Ananas", "Lait de coco", "Curcuma"],
        badges: ["🌴 Évasion", "🌞 Vitaminé"]
    },
    {
        name: "Anti-Fatigue ⚡",
        price: 2700,
        ingredients: ["Baies de goji", "Açai", "Banane", "Eau de coco"],
        badges: ["⚡ Vitalité", "🛡️ Immunité"]
    },
    {
        name: "Douceur Matinale ☀️",
        price: 2200,
        ingredients: ["Orange", "Carotte", "Gingembre", "Curcuma"],
        badges: ["🌅 Réveil", "🧡 Bien-être"]
    },
    {
        name: "Super Immunité 🛡️",
        price: 2800,
        ingredients: ["Citron", "Miel", "Gingembre", "Curcuma"],
        badges: ["🛡️ Défenses", "🌟 Antioxydant"]
    },
    {
        name: "Summer Fresh 🌊",
        price: 2500,
        ingredients: ["Pastèque", "Menthe", "Citron vert", "Eau de coco"],
        badges: ["🍉 Fraîcheur", "💧 Hydratant"]
    },
    {
        name: "Energie Max 🚀",
        price: 2600,
        ingredients: ["Banane", "Avoine", "Beurre de cacahuète", "Lait d'amande"],
        badges: ["🚀 Endurance", "💪 Satiété"]
    },
    {
        name: "Zen & Chill �",
        price: 2400,
        ingredients: ["Lavande", "Myrtille", "Lait de coco", "Miel"],
        badges: ["🧘 Relaxation", "🌙 Sérénité"]
    },
    {
        name: "Immunité Dorée 🌟",
        price: 3200,
        ingredients: ["Curcuma", "Miel", "Citron", "Gingembre"],
        badges: ["🛡️ Immunité", "🌟 Vitalité"]
    },
    {
        name: "Berry Love 🍓",
        price: 2800,
        ingredients: ["Framboise", "Myrtille", "Grenade", "Yaourt grec"],
        badges: ["❤️ Antioxidant", "🍒 Vitaminé"]
    },
    {
        name: "Mango Tango 🥭",
        price: 2600,
        ingredients: ["Mangue", "Passion", "Orange", "Gingembre"],
        badges: ["🌞 Énergie", "💃 Dynamisme"]
    }
];

let totalPrice = 0;
const selectedIngredients = new Map();

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
        centeredSlides: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
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
        const content = card.querySelector('.ingredient-content');
        const input = card.querySelector('.quantity-input');
        
        content.addEventListener('click', () => {
            card.classList.toggle('selected');
            updateSelection(card, parseInt(input.value));
        });

        input.addEventListener('change', () => updateSelection(card, parseInt(input.value)));
    });
}

function updateSelection(card, quantity) {
    const price = parseInt(card.dataset.price);
    
    if(card.classList.contains('selected')) {
        selectedIngredients.set(card, {price, quantity});
    } else {
        selectedIngredients.delete(card);
    }
    
    totalPrice = Array.from(selectedIngredients.values())
                   .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    updatePriceDisplay();
    checkValidation();
}

function generateInvoice(paymentType) {
    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.write(`
        <html>
            <head>
                <title>Facture Smoothie Xpress</title>
                <style>
                    body { 
                        font-family: Arial; 
                        padding: 40px; 
                        text-align: center; 
                    }
                    button { 
                        padding: 15px 30px; 
                        background: #8A2BE2; 
                        color: white; 
                        border: none; 
                        border-radius: 8px; 
                        cursor: pointer; 
                        margin-top: 20px; 
                    }
                </style>
            </head>
            <body>
                <h2>🍹 Smoothie Xpress - Facture</h2>
                <p>Nom: ${document.getElementById('clientName').value}</p>
                <p>Téléphone: ${document.getElementById('clientPhone').value}</p>
                <p>Total: ${totalPrice} CFA</p>
                <p>Paiement: ${paymentType}</p>
                <button onclick="window.print()">Télécharger/Imprimer</button>
            </body>
        </html>
    `);
}

function setupOrderForm() {
    document.getElementById('orderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        
        if(!paymentMethod) {
            alert("❌ Sélectionnez un mode de paiement !");
            return;
        }
        
        if(selectedIngredients.size < 4) {
            alert("❌ Sélectionnez au moins 4 ingrédients !");
            return;
        }

        const paymentType = paymentMethod.value === 'mobile' ? 'Mobile Money' : 'Carte Bancaire';
        generateInvoice(paymentType);
        resetForm();
    });
}

function resetForm() {
    document.getElementById('orderForm').reset();
    selectedIngredients.forEach((value, card) => card.classList.remove('selected'));
    selectedIngredients.clear();
    totalPrice = 0;
    updatePriceDisplay();
    checkValidation();
    document.querySelectorAll('.quantity-input').forEach(input => input.value = 1);
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