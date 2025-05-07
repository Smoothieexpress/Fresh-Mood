// Configuration des données premium
const specialSmoothies = [
    {
        name: "Boost Testosterone",
        price: 2500,
        ingredients: ["Gingembre", "Maca", "Banane", "Lait d'amande"],
        badges: ["🚀 Énergie", "💪 Performance"],
        emoji: "💪",
        color: "#FF9F40"
    },
    {
        name: "Passion Night",
        price: 3000,
        ingredients: ["Fraise", "Chocolat", "Miel", "Ginseng"],
        badges: ["🔥 Aphrodisiaque", "💖 Romance"],
        emoji: "💖",
        color: "#FF69B4"
    },
    {
        name: "Detox Morning",
        price: 2200,
        ingredients: ["Ananas", "Céleri", "Gingembre", "Citron"],
        badges: ["🌿 Détox", "☀️ Matinal"],
        emoji: "🌿",
        color: "#38B2AC"
    }
];

// Variables globales
let totalPrice = 0;
const selectedIngredients = new Set();
let orderNumber = 1000;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initSwiper();
    setupIngredients();
    setupOrderForm();
    setupBannerClose();
    setupConfirmationClose();
    setupNavigation();
});

// Carrousel premium avec défilement automatique
function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                centeredSlides: false,
            },
            1024: {
                slidesPerView: 3,
                centeredSlides: true,
            }
        }
    });

    renderSmoothies();
}

// Rendu des smoothies spéciaux
function renderSmoothies() {
    const container = document.getElementById('smoothies-container');
    
    container.innerHTML = specialSmoothies.map(smoothie => `
        <div class="swiper-slide">
            <div class="smoothie-card" style="--card-color: ${smoothie.color}">
                <div class="smoothie-emoji">${smoothie.emoji}</div>
                <h3>${smoothie.name}</h3>
                <ul class="smoothie-ingredients">
                    ${smoothie.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                <div class="smoothie-badges">
                    ${smoothie.badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
                </div>
                <div class="smoothie-price">${smoothie.price.toLocaleString()} CFA</div>
                <button class="order-btn" onclick="handleQuickOrder(${smoothie.price}, '${smoothie.name}')">
                    Commander maintenant <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Gestion des ingrédients premium
function setupIngredients() {
    const ingredientCards = document.querySelectorAll('.ingredient-card');
    
    ingredientCards.forEach(card => {
        card.addEventListener('click', () => {
            // Animation de clic
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = card.classList.contains('selected') ? 'scale(1)' : 'scale(1.05)';
            }, 150);

            const price = parseInt(card.dataset.price);
            
            // Gestion de la sélection
            if (card.classList.toggle('selected')) {
                selectedIngredients.add(card);
                totalPrice += price;
                
                // Ajout du badge visuel
                const badge = document.createElement('span');
                badge.className = 'selected-badge';
                badge.innerHTML = '<i class="fas fa-check"></i>';
                card.appendChild(badge);
            } else {
                selectedIngredients.delete(card);
                totalPrice -= price;
                
                // Suppression du badge
                const badge = card.querySelector('.selected-badge');
                if (badge) badge.remove();
            }

            updatePriceDisplay();
            checkValidation();
        });
    });
}

// Mise à jour de l'affichage du prix
function updatePriceDisplay() {
    const totalElement = document.getElementById('total-price');
    const countElement = document.getElementById('selected-count');
    
    totalElement.textContent = totalPrice.toLocaleString();
    countElement.textContent = selectedIngredients.size;
    
    // Animation
    totalElement.classList.add('price-update');
    setTimeout(() => {
        totalElement.classList.remove('price-update');
    }, 500);
}

// Validation de la sélection
function checkValidation() {
    const validationMsg = document.getElementById('validationMsg');
    
    if (selectedIngredients.size < 4) {
        validationMsg.style.display = 'flex';
    } else {
        validationMsg.style.display = 'none';
    }
}

// Commande rapide
function handleQuickOrder(price, name) {
    if (confirm(`Confirmez la commande du "${name}" pour ${price.toLocaleString()} CFA ?`)) {
        showOrderConfirmation(price, name);
    }
}

// Formulaire de commande premium avec validation du téléphone Bénin
function setupOrderForm() {
    const form = document.getElementById('orderForm');
    const phoneInput = document.getElementById('clientPhone');
    
    // Format automatique du téléphone
    phoneInput.addEventListener('input', function(e) {
        const value = this.value.replace(/\D/g, '');
        if (value.length > 2) {
            this.value = `${value.slice(0, 2)} ${value.slice(2, 4)} ${value.slice(4, 6)} ${value.slice(6, 8)}`.trim();
        } else {
            this.value = value;
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        const phoneValue = phoneInput.value.replace(/\D/g, '');
        
        // Validation
        if (!paymentMethod) {
            showAlert('error', 'Sélectionnez un mode de paiement !');
            return;
        }
        
        if (selectedIngredients.size < 4) {
            showAlert('error', 'Sélectionnez au moins 4 ingrédients !');
            return;
        }
        
        // Validation du téléphone Bénin (8 chiffres)
        if (phoneValue.length !== 8) {
            showAlert('error', 'Numéro de téléphone invalide. Format: 96 12 34 56');
            return;
        }
        
        // Affichage de la confirmation
        showOrderConfirmation(totalPrice, 'Votre création');
    });
}

// Affichage de la confirmation de commande
function showOrderConfirmation(price, name) {
    const confirmation = document.getElementById('orderConfirmation');
    const totalElement = document.getElementById('confirmation-total');
    const orderNumberElement = document.getElementById('order-number');
    
    // Génération d'un numéro de commande
    orderNumber++;
    const formattedOrderNumber = `#FM2024-${orderNumber.toString().padStart(3, '0')}`;
    
    // Mise à jour des données
    totalElement.textContent = price.toLocaleString();
    orderNumberElement.textContent = formattedOrderNumber;
    
    // Affichage
    confirmation.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animation GSAP
    gsap.from('.confirmation-content', {
        y: 50,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out'
    });
}

// Fermeture de la confirmation
function setupConfirmationClose() {
    const closeBtn = document.querySelector('.close-confirmation');
    const confirmation = document.getElementById('orderConfirmation');
    
    closeBtn.addEventListener('click', () => {
        confirmation.classList.remove('active');
        document.body.style.overflow = 'auto';
        resetForm();
    });
}

// Réinitialisation du formulaire
function resetForm() {
    document.getElementById('orderForm').reset();
    
    // Désélection des ingrédients
    selectedIngredients.forEach(card => {
        card.classList.remove('selected');
        const badge = card.querySelector('.selected-badge');
        if (badge) badge.remove();
    });
    
    selectedIngredients.clear();
    totalPrice = 0;
    updatePriceDisplay();
    checkValidation();
}

// Fermeture de la bannière promo
function setupBannerClose() {
    const closeBtn = document.querySelector('.close-banner');
    const banner = document.querySelector('.promo-banner');
    
    if (closeBtn && banner) {
        closeBtn.addEventListener('click', () => {
            banner.style.transform = 'translateY(-100%)';
            banner.style.opacity = '0';
            setTimeout(() => {
                banner.remove();
            }, 500);
        });
    }
}

// Navigation fluide vers les sections
function setupNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Fermer le sous-menu si ouvert
                if (this.parentElement.querySelector('.submenu')) {
                    this.parentElement.querySelector('.submenu').style.opacity = '0';
                    this.parentElement.querySelector('.submenu').style.visibility = 'hidden';
                }
            }
        });
    });
}

// Affichage des alertes
function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(alert);
    
    // Positionnement fixed pour être visible pendant le scroll
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.left = '50%';
    alert.style.transform = 'translateX(-50%)';
    alert.style.zIndex = '2000';
    
    // Animation d'apparition
    gsap.from(alert, {
        y: -50,
        opacity: 0,
        duration: 0.3
    });
    
    // Disparition après 3s
    setTimeout(() => {
        gsap.to(alert, {
            y: -100,
            opacity: 0,
            duration: 0.3,
            onComplete: () => alert.remove()
        });
    }, 3000);
}
// Gestion du son du blender
const blenderSound = document.getElementById('blenderSound');
const blendBtn = document.querySelector('.blend-btn');

blendBtn.addEventListener('click', (e) => {
  e.preventDefault();
  
  // Vibration
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 30, 50]);
  }
  
  // Son
  blenderSound.currentTime = 0;
  blenderSound.play().catch(e => console.log("Son bloqué :", e));
  
  // Animation
  this.classList.add('processing');
  setTimeout(() => this.classList.remove('processing'), 1000);
});