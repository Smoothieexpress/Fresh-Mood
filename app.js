// Base de données des ingrédients
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
    { name: "🍎 Pomme rouge", price: 500, category: "fruit" },
    { name: "🍈 Grenade", price: 600, category: "fruit" },
    { name: "🥑 Avocat", price: 700, category: "fruit" },
    { name: "🥝 Açai", price: 500, category: "fruit" },
    { name: "🍈 Fruit de la passion", price: 600, category: "fruit" },
    { name: "🍈 Baies de Goji", price: 600, category: "fruit" },
    { name: "🫐 Myrtille", price: 700, category: "fruit" },
    { name: "🍓 Framboise", price: 650, category: "fruit" },
    { name: "🍑 Nectarine", price: 550, category: "fruit" },
    { name: "🥭 Papaye", price: 400, category: "fruit" },
    { name: "🥝 Litchi", price: 600, category: "fruit" },
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
    { name: "🥬 Roquette", price: 400, category: "legume" },
    { name: "🥒 Courgette", price: 350, category: "legume" },
    { name: "🌶️ Poivron rouge", price: 300, category: "legume" },
    { name: "🌶️ Poivron jaune", price: 300, category: "legume" },
    { name: "🌶️ Poivron vert", price: 300, category: "legume" },
    { name: "🥬 Chou vert", price: 350, category: "legume" },
    { name: "🥬 Chou rouge", price: 350, category: "legume" },
    { name: "🥒 Céleri", price: 250, category: "legume" },
    { name: "🧄 Ail", price: 100, category: "legume" },
    { name: "🧅 Oignon", price: 150, category: "legume" },
    { name: "🌿 Cresson", price: 400, category: "legume" },
    { name: "🍠 Patate douce", price: 350, category: "legume" },
    { name: "🍠 Betterave", price: 400, category: "legume" },

    // Racines et compléments
    { name: "🫚 Gingembre", price: 300, category: "racine" },
    { name: "🟡 Curcuma", price: 300, category: "racine" },
    { name: "🌿 Moringa", price: 500, category: "complement" },
    { name: "🌱 Spiruline", price: 300, category: "complement" },
    { name: "🌿 Chlorelle", price: 350, category: "complement" },
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
    { name: "🥬 Protéines végétales", price: 800, category: "complement" },
    { name: "🍫 Cacao cru", price: 700, category: "complement" },
    { name: "🥥 Beurre de coco", price: 750, category: "complement" },
];

// Variables globales
let totalPrice = 0;
const selectedIngredients = new Set();
const FLW_PUBLIC_KEY = 'VOTRE_CLE_PUBLIQUE_FLUTTERWAVE';
const BACKEND_URL = 'http://localhost:3000';

// Fonction de recherche
function searchIngredients(query) {
    query = query.toLowerCase();
    return ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(query)
    );
}

// Afficher les résultats de la recherche et permettre l'ajout à la liste
function displaySearchResults(query, container) {
    const results = searchIngredients(query);
    container.innerHTML = results.length > 0
        ? results.map(ingredient => `<li data-name="${ingredient.name}" data-price="${ingredient.price}">${ingredient.name} - ${ingredient.price} CFA</li>`).join('')
        : '<li>Aucun résultat trouvé.</li>';
    container.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            addIngredientToList(item.dataset.name, item.dataset.price);
        });
    });
}

// Ajouter un ingrédient à la liste
function addIngredientToList(name, price) {
    const ingredientList = document.getElementById('ingredientList');
    const ingredientItem = document.createElement('div');
    ingredientItem.className = 'ingredient-item';
    ingredientItem.innerText = `${name} - ${price} CFA`;
    ingredientList.appendChild(ingredientItem);
    selectedIngredients.add(name);
    updateTotalPrice(parseInt(price));
}

// Mettre à jour le prix total
function updateTotalPrice(price) {
    totalPrice += price;
    document.getElementById('total-price').textContent = totalPrice;
    checkValidation();
}

// Vérifier la validation (au moins 4 ingrédients)
function checkValidation() {
    const validationMsg = document.getElementById('validationMsg');
    validationMsg.style.display = selectedIngredients.size < 4 ? 'block' : 'none';
}

// Initialiser la carte de livraison
function initDeliveryMap() {
    const map = L.map('map').setView([6.3733, 2.3912], 10); // Coordonnées centrées sur le Bénin

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const deliveryZones = [
        // Ajoutez ici les différentes zones de livraison avec leurs coordonnées
        {
            name: "Calavi",
            coords: [
                [6.4483, 2.3556],
                [6.4490, 2.3600],
                [6.4450, 2.3600],
                [6.4450, 2.3550]
            ],
            color: 'green',
            fee: 500
        },
        {
            name: "Cotonou",
            coords: [
                [6.3654, 2.4183],
                [6.3700, 2.4200],
                [6.3700, 2.4100],
                [6.3650, 2.4100]
            ],
            color: 'blue',
            fee: 600
        },
        {
            name: "Ouidah",
            coords: [
                [6.3649, 2.0851],
                [6.3655, 2.0900],
                [6.3600, 2.0900],
                [6.3600, 2.0850]
            ],
            color: 'orange',
            fee: 700
        },
        {
            name: "Porto-Novo",
            coords: [
                [6.4969, 2.6289],
                [6.5000, 2.6300],
                [6.5000, 2.6200],
                [6.4960, 2.6200]
            ],
            color: 'red',
            fee: 800
        },
        // Ajout de zones supplémentaires pour les quartiers
        {
            name: "Zongo",
            coords: [
                [6.3500, 2.4300],
                [6.3550, 2.4350],
                [6.3450, 2.4350],
                [6.3450, 2.4300]
            ],
            color: 'purple',
            fee: 600
        },
        {
            name: "Akpakpa",
            coords: [
                [6.3650, 2.4250],
                [6.3700, 2.4300],
                [6.3600, 2.4300],
                [6.3600, 2.4250]
            ],
            color: 'yellow',
            fee: 600
        }
    ];

    deliveryZones.forEach(zone => {
        L.polygon(zone.coords, {color: zone.color}).addTo(map)
            .bindPopup(`${zone.name} - Frais de livraison : ${zone.fee} CFA`);
    });

    map.on('click', function(e) {
        const deliveryZone = deliveryZones.find(zone => L.polygon(zone.coords).getBounds().contains(e.latlng));
        if (deliveryZone) {
            alert(`Vous êtes dans ${deliveryZone.name}. Les frais de livraison sont de ${deliveryZone.fee} CFA.`);
        } else {
            alert("Désolé, nous ne livrons pas dans cette zone.");
        }
    });
}

// Gestion du formulaire de commande
function setupOrderForm() {
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const clientName = document.getElementById('clientName').value;
        const clientEmail = document.getElementById('clientEmail').value;
        const clientPhone = document.getElementById('clientPhone').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked');

        if (!paymentMethod || selectedIngredients.size < 4) {
            alert('Veuillez compléter tous les champs et sélectionner 4 ingrédients.');
            return;
        }

        try {
            document.querySelector('.payment-processing').classList.remove('hidden');
            await processPayment({
                name: clientName,
                email: clientEmail,
                phone: clientPhone,
                amount: totalPrice,
                method: paymentMethod.value,
            });
        } catch (error) {
            console.error('Erreur lors du traitement de la commande :', error);
            alert('Une erreur est survenue lors du traitement de la commande.');
        } finally {
            document.querySelector('.payment-processing').classList.add('hidden');
        }
    });
}

// Traitement du paiement
async function processPayment(orderData) {
    return new Promise((resolve, reject) => {
        FlutterwaveCheckout({
            public_key: FLW_PUBLIC_KEY,
            tx_ref: `CMD-${Date.now()}`,
            amount: orderData.amount,
            currency: 'XOF',
            payment_options: orderData.method === 'mobile' ? 'mobilemoney' : 'card',
            customer: {
                email: orderData.email,
                name: orderData.name,
                phone_number: orderData.phone,
            },
            callback: async (response) => {
                if (response.status === 'successful') {
                    try {
                        await saveOrderToDatabase(orderData);
                        showOrderSummary(orderData);
                        resetForm();
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error('Paiement échoué'));
                }
            },
        });
    });
}

// Sauvegarder la commande dans la base de données
async function saveOrderToDatabase(orderData) {
    const response = await fetch(`${BACKEND_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...orderData,
            ingredients: Array.from(selectedIngredients),
        }),
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde de la commande.');
    }
}

// Afficher le résumé de la commande
function showOrderSummary(orderData) {
    const summary = document.getElementById('orderSummary');
    summary.innerHTML = `
        <h3>🎉 Commande confirmée !</h3>
        <p>Montant : ${orderData.amount} CFA</p>
        <p>Email : ${orderData.email}</p>
    `;
    summary.classList.remove('hidden');
    trackOrder(orderData.orderId);
}

// Suivi de commande en temps réel
function trackOrder(orderId) {
    const orderStatus = document.getElementById('status');
    const eventSource = new EventSource(`${BACKEND_URL}/orders/${orderId}/status`);

    eventSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        orderStatus.textContent = data.status;
        if (data.status === 'Livré') {
            eventSource.close();
        }
    };

    eventSource.onerror = function() {
        orderStatus.textContent = 'Erreur de suivi de commande';
        eventSource.close();
    };
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('results');
    const searchBar = document.getElementById('searchBar');
    const orderForm = document.getElementById('orderForm');

    setupOrderForm();
    initDeliveryMap();
    
    searchBar.addEventListener('input', (e) => {
        displaySearchResults(e.target.value, resultsContainer);
    });
});
