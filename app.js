const specialSmoothies = [
    {
        name: "Boost Testosterone",
        price: 2500,
        discount: 2000,
        ingredients: ["Gingembre", "Maca", "Banane", "Lait d'amande"]
    },
    {
        name: "Passion Night",
        price: 3000,
        discount: 2400,
        ingredients: ["Fraise", "Chocolat", "Miel", "Ginseng"]
    },
    {
        name: "Detox Morning",
        price: 2200,
        discount: 1800,
        ingredients: ["Ananas", "Céleri", "Gingembre", "Citron"]
    }
];

let totalPrice = 0;
let selectedIngredients = new Set();
let cart = [];
let orderNumber = 1000;
let selectedProvider = 'mtn';

document.addEventListener('DOMContentLoaded', () => {
    initSwiper();
    setupEventListeners();
    setupBannerAnimation();
});

function initSwiper() {
    if (!window.Swiper) {
        console.warn('Swiper non chargé.');
        return;
    }
    new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 8,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 10 },
            1024: { slidesPerView: 3, spaceBetween: 12 }
        }
    });

    const container = document.getElementById('smoothies-container');
    specialSmoothies.forEach(smoothie => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="smoothie-card">
                <h3>${smoothie.name}</h3>
                <p>${smoothie.ingredients.join(', ')}</p>
                <div class="promo-price">
                    <span class="original-price">${smoothie.price.toLocaleString()} CFA</span>
                    <span class="discounted-price">${smoothie.discount.toLocaleString()} CFA</span>
                </div>
                <button class="promo-order-btn" onclick="handleQuickOrder(event)" data-name="${smoothie.name}" data-discount="${smoothie.discount}">
                    Ajouter au panier
                </button>
            </div>
        `;
        container.appendChild(slide);
    });
}

function setupEventListeners() {
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', toggleIngredientSelection);
    });

    document.getElementById('cartIcon').addEventListener('click', toggleCartModal);
    document.querySelector('.close-cart').addEventListener('click', toggleCartModal);
    document.getElementById('orderForm').addEventListener('submit', processOrder);
    document.querySelectorAll('.momo-provider').forEach(provider => {
        provider.addEventListener('click', selectPaymentMethod);
    });
    document.getElementById('toggleSound').addEventListener('click', toggleSound);
}

function setupBannerAnimation() {
    const banner = document.getElementById('promoBanner');
    const showBanner = () => {
        banner.classList.add('active');
        if (window.gsap) {
            gsap.fromTo(banner, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
        }
        setTimeout(() => {
            if (window.gsap) {
                gsap.to(banner, { y: -100, opacity: 0, duration: 0.5, onComplete: () => banner.classList.remove('active') });
            } else {
                banner.classList.remove('active');
            }
        }, 5000);
    };
    showBanner();
    setInterval(showBanner, 30000);
    document.querySelector('.close-banner').addEventListener('click', () => {
        if (window.gsap) {
            gsap.to(banner, { y: -100, opacity: 0, duration: 0.5, onComplete: () => banner.classList.remove('active') });
        } else {
            banner.classList.remove('active');
        }
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
        card.querySelector('.selected-badge')?.remove();
    } else {
        selectedIngredients.add(card);
        card.classList.add('selected');
        totalPrice += price;
        const badge = document.createElement('div');
        badge.className = 'selected-badge';
        badge.textContent = '✓';
        card.appendChild(badge);
    }

    updatePriceDisplay();
}

function updatePriceDisplay() {
    const totalElement = document.getElementById('total-price');
    const selectedCount = document.getElementById('selected-count');
    const validationMsg = document.getElementById('validationMsg');

    totalElement.textContent = totalPrice.toLocaleString();
    selectedCount.textContent = selectedIngredients.size;
    validationMsg.style.display = selectedIngredients.size < 4 ? 'flex' : 'none';
}

function addCustomSmoothieToCart() {
    if (selectedIngredients.size < 4) {
        alert('Veuillez sélectionner au moins 4 ingrédients.');
        return;
    }
    const ingredients = Array.from(selectedIngredients).map(card => card.querySelector('span:not(.price)').textContent);
    cart.push({ item: `Smoothie personnalisé (${ingredients.join(', ')})`, price: totalPrice });
    resetCustomSelection();
    updateCartDisplay();
    toggleCartModal();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cartCount');

    cartItems.innerHTML = cart.length === 0 ? '<p>Votre panier est vide</p>' : cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.item}</span>
            <span>${item.price.toLocaleString()} CFA</span>
            <button onclick="removeFromCart(${index})">Supprimer</button>
        </div>
    `).join('');
    cartTotal.textContent = cart.reduce((sum, item) => sum + item.price, 0).toLocaleString();
    cartCount.textContent = cart.length;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function toggleCartModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
}

function proceedToCheckout() {
    if (cart.length === 0 && selectedIngredients.size < 4) {
        alert('Votre panier est vide ou sélectionnez au moins 4 ingrédients.');
        return;
    }
    toggleCartModal();
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

function handleQuickOrder(event) {
    const button = event.currentTarget;
    const price = parseInt(button.dataset.discount);
    const name = button.dataset.name;
    cart.push({ item: name, price });
    updateCartDisplay();
    toggleCartModal();
}

function processOrder(event) {
    event.preventDefault();
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();

    if (!name || !/^[0-9]{8}$/.test(phone) || (cart.length === 0 && selectedIngredients.size < 4)) {
        alert('Veuillez remplir tous les champs correctement.');
        return;
    }

    const confirmation = document.getElementById('orderConfirmation');
    document.getElementById('confirmation-total').textContent = cart.reduce((sum, item) => sum + item.price, 0).toLocaleString();
    document.getElementById('order-number').textContent = `#FM2025-${(++orderNumber).toString().padStart(3, '0')}`;
    confirmation.classList.add('active');

    document.querySelector('.close-confirmation').addEventListener('click', () => {
        confirmation.classList.remove('active');
        document.getElementById('orderForm').reset();
        cart = [];
        selectedIngredients.forEach(card => {
            card.classList.remove('selected');
            card.querySelector('.selected-badge')?.remove();
        });
        selectedIngredients.clear();
        totalPrice = 0;
        updateCartDisplay();
        updatePriceDisplay();
    });
}

function selectPaymentMethod(event) {
    document.querySelectorAll('.momo-provider').forEach(provider => {
        provider.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    selectedProvider = event.currentTarget.dataset.provider;
}

function resetCustomSelection() {
    selectedIngredients.forEach(card => {
        card.classList.remove('selected');
        card.querySelector('.selected-badge')?.remove();
    });
    selectedIngredients.clear();
    totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    updatePriceDisplay();
}

function toggleSound() {
    const sound = document.getElementById('blenderSound');
    const icon = document.querySelector('#toggleSound i');
    sound.muted = !sound.muted;
    icon.className = sound.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
}