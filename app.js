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
let selectedIngredients = new Set();
let orderNumber = 1000;
let selectedProvider = 'mtn';

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initSwiper();
    setupEventListeners();
});

function setupEventListeners() {
    // Écouteurs pour les ingrédients
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', toggleIngredientSelection);
    });

    // Écouteur pour le formulaire
    document.getElementById('orderForm').addEventListener('submit', processOrder);

    // Écouteurs pour les commandes rapides
    document.querySelectorAll('.promo-order-btn, .order-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickOrder);
    });

    // Écouteurs pour Mobile Money
    document.querySelectorAll('.momo-provider').forEach(provider => {
        provider.addEventListener('click', selectPaymentMethod);
    });
}

// Gestion des commandes rapides
function handleQuickOrder(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const price = parseInt(button.dataset.price || button.closest('[data-discount]').dataset.discount);
    const name = button.dataset.name || button.closest('[data-name]').dataset.name;
    
    totalPrice = price;
    updatePriceDisplay();
    
    // Scroll vers le formulaire
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    // Pré-remplir le nom si disponible
    const nameInput = document.getElementById('clientName');
    if (!nameInput.value) nameInput.focus();
}

// Traitement du formulaire
function processOrder(event) {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    // Effet blender
    playBlenderEffect(() => {
        showOrderConfirmation(totalPrice, 'Votre commande');
    });
}

// Validation améliorée
function validateForm() {
    const errors = [];
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();

    if (!name) errors.push('Veuillez entrer votre nom complet');
    if (!phone || !/^(229|00229|\+229)?[0-9]{8}$/.test(phone.replace(/\D/g, ''))) {
        errors.push('Numéro de téléphone invalide (format: 96 12 34 56)');
    }
    if (selectedIngredients.size < 4 && totalPrice === 0) {
        errors.push('Sélectionnez au moins 4 ingrédients');
    }
    if (!selectedProvider) errors.push('Sélectionnez un mode de paiement');

    if (errors.length > 0) {
        showAlert('error', errors.join('<br>'));
        return false;
    }
    return true;
}

// Effet blender avec callback
function playBlenderEffect(callback) {
    const blendBtn = document.querySelector('.blend-btn');
    const sound = document.getElementById('blenderSound');
    
    // Vibration si disponible
    if ('vibrate' in navigator) navigator.vibrate([30, 40, 30]);
    
    // Son
    sound.currentTime = 0;
    sound.play().catch(e => console.error("Son bloqué:", e));
    
    // Animation
    gsap.to(blendBtn, {
        keyframes: [
            { scale: 0.95, duration: 0.1 },
            { rotate: "+=5deg", duration: 0.05 },
            { rotate: "-=10deg", duration: 0.05 },
            { rotate: "+=5deg", duration: 0.05 }
        ],
        onComplete: () => {
            blendBtn.style.transform = '';
            if (callback) callback();
        }
    });
}

function showOrderConfirmation(price, name) {
    const confirmation = document.getElementById('orderConfirmation');
    document.getElementById('confirmation-total').textContent = price.toLocaleString();
    document.getElementById('order-number').textContent = `#FM${new Date().getFullYear()}-${(++orderNumber).toString().padStart(3, '0')}`;
    
    confirmation.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    gsap.fromTo(confirmation,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );
    
    gsap.fromTo('.confirmation-content',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "back.out" }
    );
}

function setupConfirmationClose() {
    document.querySelector('.close-confirmation').addEventListener('click', () => {
        gsap.to(document.getElementById('orderConfirmation'), {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                document.getElementById('orderConfirmation').style.display = 'none';
                document.body.style.overflow = 'auto';
                resetForm();
            }
        });
    });
}

function resetForm() {
    document.getElementById('orderForm').reset();
    selectedIngredients.forEach(card => {
        card.classList.remove('selected');
        removeBadge(card);
    });
    selectedIngredients.clear();
    totalPrice = 0;
    updatePriceDisplay();
}

function setupBannerClose() {
    document.querySelector('.close-banner')?.addEventListener('click', () => {
        gsap.to(document.querySelector('.promo-banner'), {
            y: -100,
            opacity: 0,
            duration: 0.5,
            onComplete: () => document.querySelector('.promo-banner').remove()
        });
    });
}

function setupNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function handleResponsiveInputs() {
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', () => {
            document.querySelector('meta[name="viewport"]')
                .setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        });
        input.style.fontSize = '16px';
    });
}

function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i> ${message}`;
    document.body.appendChild(alert);
    
    gsap.fromTo(alert,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 }
    );
    
    setTimeout(() => {
        gsap.to(alert, {
            y: -50,
            opacity: 0,
            duration: 0.3,
            onComplete: () => alert.remove()
        });
    }, 3000);
}

// Gestion offline
window.addEventListener('offline', () => showAlert('error', 'Connexion perdue'));

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .catch(err => console.log('Échec SW:', err));
    });
}