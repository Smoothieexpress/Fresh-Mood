// Spécialités augmentées
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
        name: "Énergie Tropicale 🌴",
        price: 2800,
        ingredients: ["Mangue", "Ananas", "Noix de coco", "Gingembre"],
        badges: ["🌞 Vitalité", "💥 Boost"]
    },
    {
        name: "Détox Vert 🥦",
        price: 3200,
        ingredients: ["Épinard", "Kiwi", "Pomme verte", "Citron"],
        badges: ["🍃 Détox", "🌿 Naturel"]
    }
];

let totalPrice = 0;
let quantityMultiplier = 1;
const selectedIngredients = new Set();

// Initialisation Swiper améliorée
function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
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

// Gestion de la quantité
document.getElementById('smoothieQuantity').addEventListener('change', function(e) {
    quantityMultiplier = parseFloat(e.target.value);
    updatePriceDisplay();
});

// Génération de facture
function generateInvoice() {
    const invoiceContent = `
        Facture Smoothie Xpress
        ------------------------
        Client: ${document.getElementById('clientName').value}
        Téléphone: ${document.getElementById('clientPhone').value}
        Total: ${totalPrice * quantityMultiplier} CFA
        Quantité: ${document.getElementById('smoothieQuantity').options[document.getElementById('smoothieQuantity').selectedIndex].text}
        Paiement: ${document.querySelector('input[name="payment"]:checked').nextElementSibling.textContent}
        
        Merci pour votre commande !
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Facture_SmoothieXpress_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Modification de la soumission du formulaire
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

    document.getElementById('invoice-download').style.display = 'block';
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

// Reste du code JavaScript inchangé...
// [Coller ici le reste de votre JS original]
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
        
        if(!paymentMethod) {
            alert("❌ Sélectionnez un mode de paiement !");
            return;
        }
        
        if(selectedIngredients.size < 4) {
            alert("❌ Sélectionnez au moins 4 ingrédients !");
            return;
        }

        const paymentType = paymentMethod.value === 'mobile' ? 'Mobile Money' : 'Carte Bancaire';
        alert(`✅ Merci !\nTotal : ${totalPrice} CFA\nPaiement : ${paymentType}`);
        resetForm();
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