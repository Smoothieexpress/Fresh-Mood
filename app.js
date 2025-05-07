// Configuration des données premium
const specialSmoothies = [
    {
        name: "Boost Testosterone",
        price: 2500,
        discount: 2000,
        ingredients: ["Gingembre", "Maca", "Banane", "Lait d'amande"],
        badges: ["🚀 Énergie", "💪 Performance"],
        emoji: "💪",
        color: "#FF9F40"
    },
    {
        name: "Passion Night",
        price: 3000,
        discount: 2400,
        ingredients: ["Fraise", "Chocolat", "Miel", "Ginseng"],
        badges: ["🔥 Aphrodisiaque", "💖 Romance"],
        emoji: "💖",
        color: "#FF69B4"
    },
    {
        name: "Detox Morning",
        price: 2200,
        discount: 1800,
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
let selectedProvider = 'mtn';

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initSwiper();
    setupIngredients();
    setupOrderForm();
    setupBannerClose();
    setupConfirmationClose();
    setupNavigation();
    handleResponsiveInputs();
    setupBlenderButton();
    setupMobileMoney();
    setupPromoButtons();
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
                <div class="smoothie-price">
                    <span class="original-price">${smoothie.price.toLocaleString()} CFA</span>
                    <span class="discounted-price">${smoothie.discount.toLocaleString()} CFA</span>
                </div>
                <button class="order-btn" onclick="handleQuickOrder(${smoothie.discount}, '${smoothie.name}')">
                    Commander maintenant <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Configuration des boutons promo
function setupPromoButtons() {
    document.querySelectorAll('.promo-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.promo-card');
            const price = parseInt(card.dataset.discount);
            const name = card.dataset.name;
            handleQuickOrder(price, name);
        });
    });
}

// Gestion des ingrédients premium
function setupIngredients() {
    const ingredientCards = document.querySelectorAll('.ingredient-card');
    
    ingredientCards.forEach(card => {
        card.addEventListener('click', () => {
            // Animation de clic
            gsap.to(card, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });

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
    const validationMsg = document.getElementById('validationMsg');
    
    totalElement.textContent = totalPrice.toLocaleString();
    countElement.textContent = selectedIngredients.size;
    
    // Animation et validation
    if (selectedIngredients.size >= 4) {
        countElement.innerHTML = `<i class="fas fa-check"></i> ${selectedIngredients.size}/4`;
        validationMsg.style.display = 'none';
    } else {
        countElement.innerHTML = `${selectedIngredients.size}/4`;
        validationMsg.style.display = 'flex';
    }
    
    // Animation prix
    gsap.fromTo(totalElement, 
        {scale: 1.2, color: '#FF7B00'},
        {scale: 1, color: '#7B2CBF', duration: 0.5}
    );
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
    // Pré-remplir le total
    totalPrice = price;
    updatePriceDisplay();
    
    // Scroll vers le formulaire
    gsap.to(window, {
        scrollTo: {y: "#contact", offsetY: 20},
        duration: 0.8,
        onComplete: () => {
            // Focus sur le premier champ
            document.getElementById('clientName').focus();
        }
    });
}

// Configuration Mobile Money
function setupMobileMoney() {
    const momoProviders = document.querySelectorAll('.momo-provider');
    
    momoProviders.forEach(provider => {
        provider.addEventListener('click', (e) => {
            e.preventDefault();
            momoProviders.forEach(p => p.classList.remove('active'));
            provider.classList.add('active');
            selectedProvider = provider.dataset.provider;
        });
    });
}

// Formulaire de commande premium avec validation
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
}

// Bouton Blender avec effets
function setupBlenderButton() {
    const blendBtn = document.querySelector('.blend-btn');
    if (!blendBtn) return;
    
    blendBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validation
        const name = document.getElementById('clientName').value;
        const phone = document.getElementById('clientPhone').value;
        
        if (!name || !phone) {
            showAlert('error', 'Veuillez remplir tous les champs');
            return;
        }
        
        if (selectedIngredients.size < 4) {
            showAlert('error', 'Sélectionnez au moins 4 ingrédients');
            return;
        }
        
        if (!selectedProvider) {
            showAlert('error', 'Sélectionnez un mode de paiement');
            return;
        }
        
        // Vibration
        if ('vibrate' in navigator) {
            navigator.vibrate([30, 40, 30]);
        }
        
        // Son
        const sound = document.getElementById('blenderSound');
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Son bloqué :", e));
        
        // Animation GSAP
        gsap.to(this, {
            keyframes: [
                {scale: 0.95, duration: 0.1},
                {rotate: "+=5deg", duration: 0.05},
                {rotate: "-=10deg", duration: 0.05},
                {rotate: "+=5deg", duration: 0.05},
            ],
            onComplete: () => {
                this.style.transform = 'none';
                showOrderConfirmation(totalPrice, 'Votre création');
            }
        });
    });
}

// Gestion responsive des inputs
function handleResponsiveInputs() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Empêcher le zoom sur focus (iOS)
        input.addEventListener('focus', () => {
            document.querySelector('meta[name="viewport"]')
                .setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        });
        
        // Forcer la taille de police
        input.style.fontSize = '16px';
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
        y: 0,
        opacity: 0,
        scale: 0.9,
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
            gsap.to(banner, {
                y: -100,
                opacity: 0,
                duration: 0.5,
                onComplete: () => banner.remove()
            });
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
    alert.style.padding = '15px 25px';
    alert.style.borderRadius = '8px';
    alert.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    alert.style.background = type === 'error' ? '#FFEBEE' : '#E8F5E9';
    alert.style.color = type === 'error' ? '#C62828' : '#2E7D32';
    
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

// Gestion du offline
window.addEventListener('offline', () => {
    showAlert('error', 'Connexion perdue - Fonctionnalités limitées');
});

// Service Worker pour PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW enregistré:', registration.scope);
            })
            .catch(error => {
                console.log('Échec SW:', error);
            });
    });
}