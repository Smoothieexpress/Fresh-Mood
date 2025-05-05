// Configuration des données
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

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initSwiper();
    setupIngredients();
    setupOrderForm();
});

// Carrousel des smoothies spéciaux
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

// Gestion des ingrédients
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

// Mise à jour de l'affichage
function updatePriceDisplay() {
    document.getElementById('total-price').textContent = totalPrice;
    document.getElementById('total-price').classList.add('price-update');
    setTimeout(() => {
        document.getElementById('total-price').classList.remove('price-update');
    }, 300);
}

// Validation
function checkValidation() {
    document.getElementById('validationMsg').style.display = 
        selectedIngredients.size < 4 ? 'block' : 'none';
}

// Commande rapide
function handleQuickOrder(price, name) {
    if(confirm(`Confirmez la commande du "${name}" pour ${price} CFA ?`)) {
        alert(`✅ Commande validée ! Préparation en cours...`);
    }
}

// Formulaire de commande
function setupOrderForm() {
    document.getElementById('orderForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        const clientName = document.getElementById('clientName').value.trim();
        const clientPhone = document.getElementById('clientPhone').value.trim();

        if (!paymentMethod) {
            alert("❌ Sélectionnez un mode de paiement !");
            return;
        }

        if (selectedIngredients.size < 4) {
            alert("❌ Sélectionnez au moins 4 ingrédients !");
            return;
        }

        if (!clientName || !clientPhone) {
            alert("❌ Veuillez remplir tous les champs du formulaire !");
            return;
        }

        const formData = new FormData();
        formData.append('clientName', clientName);
        formData.append('clientPhone', clientPhone);
        formData.append('totalPrice', totalPrice);
        formData.append('payment', paymentMethod.value);

        fetch('paiement.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(`✅ ${data.message}\nID de transaction : ${data.transaction_id}`);
                resetForm();
            } else {
                alert(`❌ ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert("❌ Une erreur est survenue lors du traitement du paiement.");
        });
    });
}

function resetForm() {
    document.getElementById('orderForm').reset();
    selectedIngredients.forEach(card => card.classList.remove('selected'));
    selectedIngredients.clear();
    totalPrice = 0;
    updatePriceDisplay();
    checkValidation();
}
// Défilement automatique des spécialités
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById('autoScrollSpecialites');
  
  if (container) { // Vérifie si l'élément existe
    let scrollAmount = 0;
    const scrollInterval = setInterval(() => {
      if (scrollAmount >= container.scrollWidth - container.clientWidth) {
        scrollAmount = 0;
      } else {
        scrollAmount += 1; // Ajuste la vitesse ici
      }
      container.scrollTo(scrollAmount, 0);
    }, 50);
  }
});