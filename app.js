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
document.addEventListener('DOMContentLoaded', () => {
    initSwiper();
    setupEventListeners();
    setupBannerClose();
    setupNavigation();
    setupConfirmationClose();
    handleResponsiveInputs();
});

function initSwiper() {
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper non chargé. Assurez-vous que la bibliothèque est incluse.');
        return;
    }

    new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });

    // Remplir le carrousel avec les smoothies spéciaux
    const container = document.getElementById('smoothies-container');
    specialSmoothies.forEach(smoothie => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="smoothie-card" style="border-color: ${smoothie.color}">
                <h3>${smoothie.emoji} ${smoothie.name}</h3>
                <p>${smoothie.ingredients.join(', ')}</p>
                <div class="promo-price">
                    <span class="original-price">${smoothie.price.toLocaleString()} CFA</span>
                    <span class="discounted-price">${smoothie.discount.toLocaleString()} CFA</span>
                </div>
                <button class="promo-order-btn" data-name="${smoothie.name}" data-discount="${smoothie.discount}" aria-label="Commander ${smoothie.name} à ${smoothie.discount} CFA">
                    Commander
                </button>
            </div>
        `;
        container.appendChild(slide);
    });
}

function setupEventListeners() {
    // Écouteurs pour les ingrédients
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', toggleIngredientSelection);
    });

    // Écouteur pour le formulaire
    document.getElementById('orderForm').addEventListener('submit', processOrder);

    // Écouteurs pour les commandes rapides
    document.querySelectorAll('.promo-order-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickOrder);
    });

    // Écouteurs pour Mobile Money
    document.querySelectorAll('.momo-provider').forEach(provider => {
        provider.addEventListener('click', selectPaymentMethod);
    });
}

function toggleIngredientSelection(event) {
    const card = event.currentTarget;
    const price = parseInt(card.dataset.price);
    const name = card.querySelector('span:not(.price)').textContent;

    if (selectedIngredients.has(card)) {
        selectedIngredients.delete(card);
        card.classList.remove('selected');
        totalPrice -= price;
        removeBadge(card);
    } else {
        selectedIngredients.add(card);
        card.classList.add('selected');
        totalPrice += price;
        addBadge(card);
    }

    updatePriceDisplay();
}

function addBadge(card) {
    let badge = card.querySelector('.selected-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.className = 'selected-badge';
        badge.textContent = '✓';
        card.appendChild(badge);
    }
}

function removeBadge(card) {
    const badge = card.querySelector('.selected-badge');
    if (badge) badge.remove();
}

function updatePriceDisplay() {
    const totalElement = document.getElementById('total-price');
    totalElement.textContent = totalPrice.toLocaleString();
    totalElement.classList.add('price-update');
    setTimeout(() => totalElement.classList.remove('price-update'), 500);

    const selectedCount = document.getElementById('selected-count');
    selectedCount.textContent = selectedIngredients.size;

    const validationMsg = document.getElementById('validationMsg');
    validationMsg.style.display = selectedIngredients.size < 4 && totalPrice === 0 ? 'flex' : 'none';
}

function handleQuickOrder(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const price = parseInt(button.dataset.discount);
    const name = button.dataset.name;

    totalPrice = price;
    updatePriceDisplay();

    // Scroll vers le formulaire
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });

    // Pré-remplir le nom si disponible
    const nameInput = document.getElementById('clientName');
    if (!nameInput.value) nameInput.focus();
}

function processOrder(event) {
    event.preventDefault();

    if (!validateForm()) return;

    // Effet blender
    playBlenderEffect(() => {
        showOrderConfirmation(totalPrice, 'Votre commande');
    });
}

function validateForm() {
    const errors = [];
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();

    if (!name) errors.push('Veuillez entrer votre nom complet');
    if (!phone || !/^[0-9]{8}$/.test(phone)) {
        errors.push('Numéro de téléphone invalide (format: 66953934, 8 chiffres)');
    }
    if (selectedIngredients.size < 4 && totalPrice === 0) {
        errors.push('Sélectionnez au moins 4 ingrédients ou une commande rapide');
    }
    if (!selectedProvider) errors.push('Sélectionnez un mode de paiement');

    if (errors.length > 0) {
        showAlert('error', errors.join('<br>'));
        return false;
    }
    return true;
}

function playBlenderEffect(callback) {
    const blendBtn = document.querySelector('.blend-btn');
    const sound = document.getElementById('blenderSound');

    // Vibration si disponible
    if ('vibrate' in navigator) navigator.vibrate([30, 40, 30]);

    // Son
    sound.currentTime = 0;
    sound.play().catch(() => showAlert('error', 'Impossible de jouer le son du blender'));

    // Animation
    if (typeof gsap !== 'undefined') {
        gsap.to(blendBtn, {
            keyframes: [
                { scale: 0.95, duration: 0.1 },
                { rotate: '5deg', duration: 0.05 },
                { rotate: '-10deg', duration: 0.05 },
                { rotate: '5deg', duration: 0.05 }
            ],
            onComplete: () => {
                blendBtn.style.transform = '';
                if (callback) callback();
            }
        });
    } else {
        console.warn('GSAP non chargé. Animation ignorée.');
        if (callback) callback();
    }
}

function showOrderConfirmation(price, name) {
    const confirmation = document.getElementById('orderConfirmation');
    document.getElementById('confirmation-total').textContent = price.toLocaleString();
    document.getElementById('order-number').textContent = `#FM${new Date().getFullYear()}-${(++orderNumber).toString().padStart(3, '0')}`;

    confirmation.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (typeof gsap !== 'undefined') {
        gsap.fromTo(confirmation,
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );
        gsap.fromTo('.confirmation-content',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'back.out' }
        );
    }
}

function setupConfirmationClose() {
    document.querySelector('.close-confirmation').addEventListener('click', () => {
        const confirmation = document.getElementById('orderConfirmation');
        if (typeof gsap !== 'undefined') {
            gsap.to(confirmation, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    confirmation.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    resetForm();
                }
            });
        } else {
            confirmation.classList.remove('active');
            document.body.style.overflow = 'auto';
            resetForm();
        }
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
    const banner = document.querySelector('.promo-banner');
    if (banner) {
        document.querySelector('.close-banner').addEventListener('click', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(banner, {
                    y: -100,
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => banner.remove()
                });
            } else {
                banner.remove();
            }
        });
    }
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

function selectPaymentMethod(event) {
    document.querySelectorAll('.momo-provider').forEach(provider => {
        provider.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    selectedProvider = event.currentTarget.dataset.provider;
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
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i> ${message}`;
    document.body.appendChild(alert);

    if (typeof gsap !== 'undefined') {
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
    } else {
        alert.style.opacity = 1;
        setTimeout(() => alert.remove(), 3000);
    }
}

// Gestion offline
window.addEventListener('offline', () => showAlert('error', 'Connexion perdue'));

// Service Worker (conditionnel)
if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .catch(err => console.warn('Échec du Service Worker:', err));
    });
}