// Données des smoothies prédéfinis
const specialSmoothies = [
    { name: "Boost Testosterone", price: 2000, ingredients: ["Gingembre", "Banane", "Lait"], image: "https://images.unsplash.com/photo-1528825871115-3581a5387919" },
    { name: "Passion Night", price: 2400, ingredients: ["Fraise", "Chocolat", "Miel"], image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625" },
    { name: "Detox Morning", price: 1800, ingredients: ["Ananas", "Céleri", "Citron"], image: "https://images.unsplash.com/photo-1514995428455-447d4443fa86" }
];

// Variables globales
let totalPrice = 0;
let selectedIngredients = new Set();
let cart = [];
let orderNumber = 1000;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initSwiper();
    setupEventListeners();
    setupBannerAnimation();
});

// Initialiser le carrousel Swiper
function initSwiper() {
    if (!window.Swiper) {
        console.warn('Swiper non chargé. Vérifiez assets/swiper-bundle.min.js');
        return;
    }
    new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 8,
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });

    const container = document.getElementById('smoothies-container');
    if (!container) {
        console.error('Conteneur smoothies-container non trouvé');
        return;
    }
    specialSmoothies.forEach(smoothie => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="smoothie-card">
                <img src="${smoothie.image}" alt="${smoothie.name}" loading="lazy">
                <h3>${smoothie.name}</h3>
                <p>${smoothie.ingredients.join(', ')}</p>
                <p>${smoothie.price.toLocaleString()} CFA</p>
                <button class="promo-order-btn" onclick="handleQuickOrder(event)" data-name="${smoothie.name}" data-discount="${smoothie.price}" aria-label="Ajouter ${smoothie.name}">Ajouter</button>
            </div>
        `;
        container.appendChild(slide);
    });
}

// Configurer les écouteurs d’événements
function setupEventListeners() {
    document.querySelectorAll('.ingredient-card').forEach(card => card.addEventListener('click', toggleIngredientSelection));
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) cartIcon.addEventListener('click', toggleCartModal);
    const closeCart = document.querySelector('.close-cart');
    if (closeCart) closeCart.addEventListener('click', toggleCartModal);
    const orderForm = document.getElementById('orderForm');
    if (orderForm) orderForm.addEventListener('submit', processOrder);
    document.querySelectorAll('.momo-provider').forEach(provider => provider.addEventListener('click', selectPaymentMethod));
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) menuToggle.addEventListener('click', () => document.querySelector('.main-nav').classList.toggle('active'));
    const clientName = document.getElementById('clientName');
    if (clientName) clientName.addEventListener('input', validateName);
    const clientPhone = document.getElementById('clientPhone');
    if (clientPhone) clientPhone.addEventListener('input', validatePhone);
}

// Gérer l’animation de la bannière
function setupBannerAnimation() {
    const banner = document.getElementById('promoBanner');
    if (!banner) return console.error('Bannière non trouvée');
    const showBanner = () => {
        banner.classList.add('active');
        setTimeout(() => banner.classList.remove('active'), 5000);
    };
    showBanner();
    setInterval(showBanner, 30000);
    const closeBanner = document.querySelector('.close-banner');
    if (closeBanner) closeBanner.addEventListener('click', () => banner.classList.remove('active'));
}

// Gérer la sélection des ingrédients
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

// Mettre à jour l’affichage du prix
function updatePriceDisplay() {
    const totalElement = document.getElementById('total-price');
    const selectedCount = document.getElementById('selected-count');
    const validationMsg = document.getElementById('validationMsg');
    if (totalElement) totalElement.textContent = totalPrice.toLocaleString();
    if (selectedCount) selectedCount.textContent = `${selectedIngredients.size}/4`;
    if (validationMsg) validationMsg.style.display = selectedIngredients.size < 4 ? 'inline' : 'none';
}

// Ajouter un smoothie personnalisé au panier
function addCustomSmoothieToCart() {
    if (selectedIngredients.size < 4) {
        showToast('Sélectionnez 4 ingrédients minimum');
        return;
    }
    const ingredients = Array.from(selectedIngredients).map(card => card.querySelector('span:not(.price)').textContent);
    cart.push({ item: `Smoothie personnalisé (${ingredients.join(', ')})`, price: totalPrice, quantity: 1 });
    resetCustomSelection();
    updateCartDisplay();
    toggleCartModal();
    showToast('Smoothie ajouté au panier !');
}

// Mettre à jour l’affichage du panier
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cartCount');
    if (!cartItems || !cartTotal || !cartCount) return console.error('Éléments du panier non trouvés');

    cartItems.innerHTML = cart.length === 0 ? '<p>Panier vide</p>' : cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.item}</span>
            <select onchange="updateQuantity(${index}, this.value)">
                ${[1, 2, 3, 4, 5].map(q => `<option value="${q}" ${item.quantity === q ? 'selected' : ''}>${q}</option>`).join('')}
            </select>
            <span>${(item.price * item.quantity).toLocaleString()} CFA</span>
            <button onclick="removeFromCart(${index})">Supprimer</button>
        </div>
    `).join('');
    cartTotal.textContent = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString();
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Mettre à jour la quantité d’un article
function updateQuantity(index, quantity) {
    cart[index].quantity = parseInt(quantity);
    updateCartDisplay();
}

// Supprimer un article du panier
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    showToast('Article supprimé');
}

// Afficher/fermer le modal panier
function toggleCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.classList.toggle('active');
}

// Passer à la commande
function proceedToCheckout() {
    if (cart.length === 0 && selectedIngredients.size < 4) {
        showToast('Panier vide ou sélectionnez 4 ingrédients');
        return;
    }
    toggleCartModal();
    const orderSection = document.getElementById('order');
    if (orderSection) orderSection.scrollIntoView({ behavior: 'smooth' });
}

// Ajouter un smoothie prédéfini au panier
function handleQuickOrder(event) {
    const button = event.currentTarget;
    const price = parseInt(button.dataset.discount);
    const name = button.dataset.name;
    cart.push({ item: name, price, quantity: 1 });
    updateCartDisplay();
    toggleCartModal();
    showToast('Smoothie ajouté au panier !');
}

// Valider le nom
function validateName() {
    const name = document.getElementById('clientName').value.trim();
    const error = document.getElementById('nameError');
    if (error) {
        error.textContent = name ? '' : 'Nom requis';
        error.classList.toggle('active', !name);
    }
}

// Valider le téléphone
function validatePhone() {
    const phone = document.getElementById('clientPhone').value.trim();
    const error = document.getElementById('phoneError');
    if (error) {
        error.textContent = /^[0-9]{8}$/.test(phone) ? '' : '8 chiffres requis';
        error.classList.toggle('active', !/^[0-9]{8}$/.test(phone));
    }
}

// Traiter la commande
function processOrder(event) {
    event.preventDefault();
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();

    if (!name || !/^[0-9]{8}$/.test(phone) || (cart.length === 0 && selectedIngredients.size < 4)) {
        showToast('Veuillez remplir tous les champs correctement');
        return;
    }

    const confirmation = document.getElementById('orderConfirmation');
    const confirmationTotal = document.getElementById('confirmation-total');
    const orderNumberElement = document.getElementById('order-number');
    if (!confirmation || !confirmationTotal || !orderNumberElement) return console.error('Éléments de confirmation non trouvés');

    confirmationTotal.textContent = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString();
    orderNumberElement.textContent = `#FM2025-${(++orderNumber).toString().padStart(3, '0')}`;
    confirmation.classList.add('active');

    const closeConfirmation = document.querySelector('.close-confirmation');
    if (closeConfirmation) {
        closeConfirmation.addEventListener('click', () => {
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
        }, { once: true });
    }
}

// Sélectionner le mode de paiement
function selectPaymentMethod(event) {
    document.querySelectorAll('.momo-provider').forEach(provider => provider.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// Réinitialiser la sélection d’ingrédients
function resetCustomSelection() {
    selectedIngredients.forEach(card => {
        card.classList.remove('selected');
        card.querySelector('.selected-badge')?.remove();
    });
    selectedIngredients.clear();
    totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    updatePriceDisplay();
}

// Afficher une notification Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 3000);
    }
}