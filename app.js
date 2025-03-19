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
// Initialisation du carrousel de la bannière
const bannerSwiper = new Swiper('.banner-swiper', {
    loop: true, // Pour un défilement infini
    autoplay: {
        delay: 3000, // Temps entre chaque slide (3 secondes)
        disableOnInteraction: false, // Continue le défilement même après interaction
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});