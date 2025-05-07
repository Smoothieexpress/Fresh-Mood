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

// Carrousel premium
function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
    renderSmoothies();
}

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
                <div class="smoothie-price">
                    <span class="original-price">${smoothie.price} CFA</span>
                    <span class="discounted-price">${smoothie.discount} CFA</span>
                </div>
                <button class="order-btn" onclick="handleQuickOrder(${smoothie.discount}, '${smoothie.name}')">
                    Commander maintenant
                </button>
            </div>
        </div>
    `).join('');
}

function setupPromoButtons() {
    document.querySelectorAll('.promo-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.promo-card');
            handleQuickOrder(parseInt(card.dataset.discount), card.dataset.name);
        });
    });
}

function setupIngredients() {
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', () => {
            gsap.to(card, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
            
            const price = parseInt(card.dataset.price);
            if (card.classList.toggle('selected')) {
                selectedIngredients.add(card);
                totalPrice += price;
                card.appendChild(createBadge());
            } else {
                selectedIngredients.delete(card);
                totalPrice -= price;
                removeBadge(card);
            }
            updatePriceDisplay();
        });
    });
}

function createBadge() {
    const badge = document.createElement('span');
    badge.className = 'selected-badge';
    badge.innerHTML = '<i class="fas fa-check"></i>';
    return badge;
}

function removeBadge(card) {
    const badge = card.querySelector('.selected-badge');
    if (badge) badge.remove();
}

function updatePriceDisplay() {
    const totalElement = document.getElementById('total-price');
    const countElement = document.getElementById('selected-count');
    
    totalElement.textContent = totalPrice.toLocaleString();
    countElement.innerHTML = selectedIngredients.size >= 4 
        ? `<i class="fas fa-check"></i> ${selectedIngredients.size}/4`
        : `${selectedIngredients.size}/4`;
    
    gsap.fromTo(totalElement, 
        { scale: 1.2 }, 
        { scale: 1, duration: 0.5 }
    );
}

function handleQuickOrder(price, name) {
    totalPrice = price;
    updatePriceDisplay();
    document.getElementById('clientName').focus();
    gsap.to(window, { scrollTo: "#contact", duration: 0.8 });
}

function setupMobileMoney() {
    document.querySelectorAll('.momo-provider').forEach(provider => {
        provider.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.momo-provider').forEach(p => p.classList.remove('active'));
            provider.classList.add('active');
            selectedProvider = provider.dataset.provider;
        });
    });
}

function setupOrderForm() {
    const phoneInput = document.getElementById('clientPhone');
    phoneInput.addEventListener('input', function() {
        const value = this.value.replace(/\D/g, '');
        this.value = value.length > 2 
            ? `${value.slice(0, 2)} ${value.slice(2, 4)} ${value.slice(4, 6)} ${value.slice(6, 8)}`.trim()
            : value;
    });
}

function setupBlenderButton() {
    const blendBtn = document.querySelector('.blend-btn');
    if (!blendBtn) return;
    
    blendBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        playBlenderEffect(() => {
            showOrderConfirmation(totalPrice, 'Votre création');
        });
    });
}

function validateForm() {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    
    if (!name) {
        showAlert('error', 'Veuillez entrer votre nom');
        return false;
    }
    
    if (!phone || !validatePhoneNumber(phone)) {
        showAlert('error', 'Numéro de téléphone invalide');
        return false;
    }
    
    if (selectedIngredients.size < 4) {
        showAlert('error', 'Sélectionnez 4 ingrédients minimum');
        return false;
    }
    
    if (!selectedProvider) {
        showAlert('error', 'Sélectionnez un mode de paiement');
        return false;
    }
    
    return true;
}

function validatePhoneNumber(phone) {
    return /^(229|00229|\+229)?[0-9]{8}$/.test(phone.replace(/\D/g, ''));
}

function playBlenderEffect(callback) {
    const blendBtn = document.querySelector('.blend-btn');
    const sound = document.getElementById('blenderSound');
    
    if ('vibrate' in navigator) navigator.vibrate([30, 40, 30]);
    sound.currentTime = 0;
    sound.play().catch(console.error);
    
    gsap.to(blendBtn, {
        keyframes: [
            { scale: 0.95, duration: 0.1 },
            { rotate: "+=5deg", duration: 0.05 },
            { rotate: "-=10deg", duration: 0.05 },
            { rotate: "+=5deg", duration: 0.05 }
        ],
        onComplete: () => {
            blendBtn.style.transform = 'none';
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
function processOrder(event) {
    event.preventDefault();
    
    // 1. Validation des champs
    if (!validateForm()) return;

    // 2. Effet blender
    playBlenderEffect(() => {
        // 3. Affichage confirmation après l'animation
        showOrderConfirmation(totalPrice, 'Votre commande');
    });

    return false; // Double protection contre le rechargement
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