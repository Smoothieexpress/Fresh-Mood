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
async function addIngredientToList(name, price) {
    if (!validatePrice(price)) {
        alert('Prix invalide');
        return;
    }

    const isAvailable = await checkStock(name);
    if (!isAvailable) {
        alert(`${name} n'est pas disponible. Veuillez choisir un autre ingrédient.`);
        return;
    }

    const ingredientList = document.getElementById('ingredientList');
    const ingredientItem = document.createElement('div');
    ingredientItem.className = 'ingredient-item';
    ingredientItem.innerText = `${name} - ${price} CFA`;
    ingredientItem.dataset.name = name;
    ingredientItem.dataset.price = price;

    // Bouton de suppression
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Supprimer';
    deleteButton.addEventListener('click', () => {
        ingredientList.removeChild(ingredientItem);
        selectedIngredients.delete(name);
        updateTotalPrice(-parseInt(price));
    });

    ingredientItem.appendChild(deleteButton);
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

// Valider le prix
function validatePrice(price) {
    return !isNaN(price) && price > 0;
}

// Initialiser la carte de livraison
function initDeliveryMap() {
    const map = L.map('map').setView([6.3733, 2.3912], 10); // Coordonnées centrées sur le Bénin

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const deliveryZones = [
        {
            coords: [
                [7.0000, 1.6000],  // Nord-Ouest (vers Allada, Toffo, Zè)
                [7.0000, 2.8000],  // Nord-Est (vers Adjohoun, Bonou)
                [6.2000, 2.8000],  // Sud-Est (côte Atlantique, frontière Nigéria)
                [6.2000, 1.6000]   // Sud-Ouest (côte Atlantique, Grand-Popo)
            ],
            color: 'green',
            fee: 1000
        },
        {
            name: "Porto-Novo",
            coords: [
                [6.5500, 2.5700],  // Nord-Ouest
                [6.5500, 2.7000],  // Nord-Est
                [6.4000, 2.7000],  // Sud-Est
                [6.4000, 2.5700]   // Sud-Ouest
            ],
            color: 'red',
            fee: 1000
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

    const result = await response.json();
    await updateLoyaltyPoints(orderData.email, Math.floor(orderData.amount / 100));
    return result;
}

// Mise à jour des points de fidélité lors de la commande
async function updateLoyaltyPoints(email, points) {
    await fetch(`${BACKEND_URL}/customers/${email}/points`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points })
    });
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

// Gestion des avis clients
async function submitReview(orderId, review) {
    const response = await fetch(`${BACKEND_URL}/orders/${orderId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la soumission de l\'avis.');
    }
}

// Formulaire de soumission des avis
document.getElementById('reviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const orderId = document.getElementById('reviewOrderId').value;
    const review = {
        rating: document.getElementById('reviewRating').value,
        comment: document.getElementById('reviewComment').value,
    };

    try {
        await submitReview(orderId, review);
        alert('Avis soumis avec succès');
    } catch (error) {
        console.error('Erreur lors de la soumission de l\'avis :', error);
        alert('Une erreur est survenue lors de la soumission de l\'avis.');
    }
});

// Gestion des offres spéciales
function checkSpecialOffers() {
    const currentHour = new Date().getHours();
    const specialOffers = [
        { start: 14, end: 15, discount: 0.1 }, // Happy hour de 14h à 15h avec 10% de réduction
        { start: 20, end: 21, discount: 0.15 } // Offre flash de 20h à 21h avec 15% de réduction
    ];

    specialOffers.forEach(offer => {
        if (currentHour >= offer.start && currentHour < offer.end) {
            const discountAmount = totalPrice * offer.discount;
            document.getElementById('discount').textContent = `Réduction actuelle : ${discountAmount} CFA`;
            totalPrice -= discountAmount;
            document.getElementById('total-price').textContent = totalPrice;
        }
    });
}


// Initialisation des offres spéciales
document.addEventListener('DOMContentLoaded', () => {
    checkSpecial

  document.addEventListener('DOMContentLoaded', (event) => {
    const orderStatus = document.getElementById('status');
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    // Fonction simulée pour mettre à jour le statut de la commande
    function updateOrderStatus() {
        if (currentStep < steps.length) {
            orderStatus.innerText = steps[currentStep].innerText;
            steps[currentStep].classList.add('active');
            currentStep++;
            sendNotification(orderStatus.innerText);
        }
    }

    // Fonction simulée pour envoyer des notifications
    function sendNotification(status) {
        // Implémentez la logique de notification SMS ou web ici
        console.log(`Notification envoyée : ${status}`);
    }

    // Mise à jour simulée du statut toutes les 5 secondes
    setInterval(updateOrderStatus, 5000);
});                        
