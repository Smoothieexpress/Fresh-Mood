// Données des smoothies premium
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
let cart = [];
let orderNumber = 1000;
let selectedProvider = 'mtn';
let swiperInstance = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initSwiper();
    setupEventListeners();
    animateBanner();
});

// Bannière animée
function animateBanner() {
    const banner = document.getElementById('promoBanner');
    if (!banner) return;

    gsap.set(banner, { y: "-100%", display: "block" });
    gsap.to(banner, {
        y: 0,
        duration: 0.5,
        onComplete: () => {
            gsap.to(banner, {
                y: "-100%",
                duration: 0.5,
                delay: 5,
                onComplete: () => {
                    banner.style.display = 'none';
                    setTimeout(animateBanner, 25000); // 30s - 5s
                }
            });
        }
    });

    document.querySelector('.close-banner').addEventListener('click', () => {
        gsap.to(banner, {
            y: "-100%",
            duration: 0.5,
            onComplete: () => banner.style.display = 'none'
        });
    });
}

// Carrousel Swiper
function initSwiper() {
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper non chargé.');
        return;
    }

    swiperInstance = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });

    const container = document.getElementById('smoothies-container');
    specialSmoothies.forEach(smoothie => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="smoothie-card" style="border-color: ${smoothie.color}">
                <h3>${smoothie.emoji} ${smoothie.name}</h3>
                <p>${smoothie.ingredients.join(', ')}</p>
                <div class="badges">
                    ${smoothie.badges.map(badge => `<span class="badge" style="background: ${smoothie.color}">${badge}</span>`).join('')}
                </div>
                <div class="promo-price">
                    <span class="original-price">${smoothie.price.toLocaleString()} CFA</span>
                    <span class="discounted-price">${smoothie.discount.toLocaleString()} CFA</span>
                </div>
                <button class="promo-order-btn" data-name="${smoothie.name}" data-discount="${smoothie.discount}" aria-label="Ajouter ${smoothie.name} au panier">
                    Ajouter au panier
                </button>
            </div>
        `;
        container.appendChild(slide);
    });
}

// Écouteurs d'événements
function setupEventListeners() {
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', toggleIngredientSelection);
    });

    document.getElementById('orderForm')?.addEventListener('submit', processOrder);

    document.querySelectorAll('.promo-order-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickOrder);
    });

    document.querySelectorAll('.momo-provider').forEach(provider => {
        provider.addEventListener('click', selectPaymentMethod);
    });

    document.getElementById('toggleSound')?.addEventListener('click', toggleSound);

    document.querySelector('.cart-icon a')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('cartModal').classList.toggle('open');
    });

    document.querySelector('.close-cart')?.addEventListener('click', () => {
        document.getElementById('cartModal').classList.remove('open');
    });

    document.querySelector('.close-confirmation')?.addEventListener('click', () => {
        const confirmation = document.getElementById('orderConfirmation');
        gsap.to(confirmation, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                confirmation.classList.remove('active');
                document.body.style.overflow = 'auto';
                resetForm();
            }
        });
    });
}

function toggleIngredientSelection(event) {
    const card = event.currentTarget;
    const price = parseInt(card.dataset.price);
    const name = card.querySelector('span:not(.price)').textContent;

    if (isNaN(price)) {
        showAlert('error', `Prix invalide pour ${name}`);
        return;
    }

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
    const selectedCount = document.getElementById('selected-count');
    const validationMsg = document.getElementById('validationMsg');

    if (!totalElement || !selectedCount || !validationMsg) return;

    totalElement.textContent = totalPrice.toLocaleString();
    selectedCount.textContent = selectedIngredients.size;
    validationMsg.style.display = selectedIngredients.size < 4 ? 'flex' : 'none';
}

function addCustomSmoothieToCart() {
    if (selectedIngredients.size < 4) {
        showAlert('error', 'Sélectionnez au moins 4 ingrédients');
        return;
    }

    const ingredients = Array.from(selectedIngredients).map(card => card.querySelector('span:not(.price)').textContent);
    const customSmoothie = `Smoothie personnalisé (${ingredients.join(', ')})`;
    addToCart(customSmoothie, totalPrice);
    resetCustomSelection();
    document.getElementById('cartModal').classList.add('open');
}

function addToCart(item, price) {
    cart.push({ item, price });
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');

    if (!cartItems || !cartTotal || !cartCount) return;

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.item}</span>
            <span>${item.price.toLocaleString()} CFA</span>
            <button onclick="removeFromCart(${index})" aria-label="Supprimer ${item.item}">✕</button>
        </div>
    `).join('');

    totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = totalPrice.toLocaleString();
    cartCount.textContent = cart.length;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showAlert('error', 'Votre panier est vide');
        return;
    }
    document.getElementById('cartModal').classList.remove('open');
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

function handleQuickOrder(event) {
    const button = event.currentTarget;
    const price = parseInt(button.dataset.discount);
    const name = button.dataset.name;

    if (isNaN(price) || !name) {
        showAlert('error', 'Erreur dans la commande rapide');
        return;
    }

    addToCart(name, price);
    resetCustomSelection();
    document.getElementById('cartModal').classList.add('open');
}

function resetCustomSelection() {
    selectedIngredients.forEach(card => {
        card.classList.remove('selected');
        removeBadge(card);
    });
    selectedIngredients.clear();
    totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    updatePriceDisplay();
}

function processOrder(event) {
    event.preventDefault();

    if (!validateForm()) return;

    playBlenderEffect(() => {
        showOrderConfirmation(totalPrice);
    });
}

function validateForm() {
    const errors = [];
    const name = document.getElementById('clientName')?.value.trim();
    const phone = document.getElementById('clientPhone')?.value.trim();

    if (!name) errors.push('Veuillez entrer votre nom');
    if (!phone || !/^[0-9]{8}$/.test(phone)) errors.push('Numéro de téléphone invalide (8 chiffres)');
    if (cart.length === 0) errors.push('Votre panier est vide');

    if (errors.length > 0) {
        showAlert('error', errors.join('<br>'));
        return false;
    }
    return true;
}

function playBlenderEffect(callback) {
    const sound = document.getElementById('blenderSound');
    sound.currentTime = 0;
    sound.play().catch(() => showAlert('error', 'Erreur audio'));

    if (typeof gsap !== 'undefined') {
        gsap.to('.blend-btn', {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            onComplete: callback
        });
    } else {
        callback();
    }
}

function showOrderConfirmation(price) {
    const confirmation = document.getElementById('orderConfirmation');
    document.getElementById('confirmation-total').textContent = price.toLocaleString();
    document.getElementById('order-number').textContent = `#FM2025-${(++orderNumber).toString().padStart(3, '0')}`;

    confirmation.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (typeof gsap !== 'undefined') {
        gsap.fromTo(confirmation, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo('.confirmation-content', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
    }
}

function selectPaymentMethod(event) {
    document.querySelectorAll('.momo-provider').forEach(provider => {
        provider.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    selectedProvider = event.currentTarget.dataset.provider;
}

function toggleSound() {
    const sound = document.getElementById('blenderSound');
    const icon = document.querySelector('#toggleSound i');
    sound.muted = !sound.muted;
    icon.className = sound.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
}

function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i> ${message}`;
    document.body.appendChild(alert);

    if (typeof gsap !== 'undefined') {
        gsap.fromTo(alert, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });
        setTimeout(() => {
            gsap.to(alert, { y: -20, opacity: 0, duration: 0.3, onComplete: () => alert.remove() });
        }, 3000);
    } else {
        setTimeout(() => alert.remove(), 3000);
    }
}

window.addEventListener('offline', () => showAlert('error', 'Connexion perdue'));