// Constantes globales
const SPECIAL_SMOOTHIES = [
    { name: "Boost Testosterone", price: 2000, ingredients: ["Gingembre", "Banane", "Lait"], image: "https://images.unsplash.com/photo-1528825871115-3581a5387919" },
    { name: "Passion Night", price: 2400, ingredients: ["Fraise", "Chocolat", "Miel"], image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625" },
    { name: "Detox Morning", price: 1800, ingredients: ["Ananas", "Céleri", "Citron"], image: "https://images.unsplash.com/photo-1514995428455-447d4443fa86" }
];

const MESSAGES = {
    MIN_INGREDIENTS: "Sélectionnez 4 ingrédients minimum",
    CART_EMPTY: "Panier vide ou sélectionnez 4 ingrédients",
    ITEM_ADDED: "Smoothie ajouté au panier !",
    ITEM_REMOVED: "Article supprimé",
    INVALID_FORM: "Veuillez remplir tous les champs correctement",
    SWIPER_NOT_FOUND: "Swiper non chargé. Vérifiez assets/swiper-bundle.min.js",
    CONTAINER_NOT_FOUND: "Conteneur smoothies-container non trouvé",
    CART_ELEMENTS_NOT_FOUND: "Éléments du panier non trouvés",
    CONFIRMATION_NOT_FOUND: "Éléments de confirmation non trouvés",
};

// Variables d'état
let state = {
    totalPrice: 0,
    selectedIngredients: new Set(),
    cart: [],
    orderNumber: 1000,
};

// Initialisation
document.addEventListener('DOMContentLoaded', initializeApp);

// Fonction principale d'initialisation
function initializeApp() {
    initSwiper();
    setupEventListeners();
    setupBannerAnimation();
    updateAddToCartButtonState();
}

// Initialiser le carrousel Swiper
function initSwiper() {
    if (!window.Swiper) {
        console.warn(MESSAGES.SWIPER_NOT_FOUND);
        return;
    }

    const container = document.getElementById('smoothies-container');
    if (!container) {
        console.error(MESSAGES.CONTAINER_NOT_FOUND);
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
            1024: { slidesPerView: 3 },
        },
    });

    SPECIAL_SMOOTHIES.forEach(smoothie => {
        container.appendChild(createSmoothieSlide(smoothie));
    });
}

// Créer un slide pour un smoothie
function createSmoothieSlide(smoothie) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
        <div class="smoothie-card" role="group" aria-label="Smoothie ${smoothie.name}">
            <img src="${smoothie.image}" alt="Smoothie ${smoothie.name} avec ${smoothie.ingredients.join(', ')}" loading="lazy">
            <h3>${smoothie.name}</h3>
            <p>${smoothie.ingredients.join(', ')}</p>
            <p>${smoothie.price.toLocaleString()} CFA</p>
            <button class="promo-order-btn" data-name="${smoothie.name}" data-discount="${smoothie.price}" aria-label="Ajouter ${smoothie.name} au panier">Ajouter</button>
        </div>
    `;
    return slide;
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    const elements = {
        ingredientCards: document.querySelectorAll('.ingredient-card'),
        cartIcon: document.getElementById('cartIcon'),
        closeCart: document.querySelector('.close-cart'),
        orderForm: document.getElementById('orderForm'),
        momoProviders: document.querySelectorAll('.momo-provider'),
        menuToggle: document.querySelector('.menu-toggle'),
        clientName: document.getElementById('clientName'),
        clientPhone: document.getElementById('clientPhone'),
        clientAddress: document.getElementById('clientAddress'),
        addToCartBtn: document.querySelector('.blend-btn.add-to-cart'),
    };

    elements.ingredientCards.forEach(card => 
        card.addEventListener('click', () => toggleIngredientSelection(card))
    );
    elements.cartIcon?.addEventListener('click', toggleCartModal);
    elements.closeCart?.addEventListener('click', toggleCartModal);
    elements.orderForm?.addEventListener('submit', processOrder);
    elements.momoProviders.forEach(provider => 
        provider.addEventListener('click', () => selectPaymentMethod(provider))
    );
    elements.menuToggle?.addEventListener('click', () => {
        const nav = document.querySelector('.main-nav');
        const isExpanded = nav.classList.toggle('active');
        elements.menuToggle.setAttribute('aria-expanded', isExpanded);
    });
    elements.clientName?.addEventListener('input', validateName);
    elements.clientPhone?.addEventListener('input', validatePhone);
    elements.clientAddress?.addEventListener('input', validateAddress);

    // Ajouter les écouteurs pour les boutons "Ajouter" des smoothies
    document.querySelectorAll('.promo-order-btn').forEach(btn => 
        btn.addEventListener('click', handleQuickOrder)
    );
}

// Gérer l'animation de la bannière
function setupBannerAnimation() {
    const banner = document.getElementById('promoBanner');
    if (!banner) {
        console.error('Bannière non trouvée');
        return;
    }

    const showBanner = () => {
        banner.classList.add('active');
        setTimeout(() => banner.classList.remove('active'), 5000);
    };

    showBanner();
    setInterval(showBanner, 30000);

    const closeBanner = document.querySelector('.close-banner');
    closeBanner?.addEventListener('click', () => banner.classList.remove('active'));
}

// Gérer la sélection des ingrédients
function toggleIngredientSelection(card) {
    const price = parseInt(card.dataset.price);
    const name = card.querySelector('span:not(.price)')?.textContent;

    if (!name || isNaN(price)) {
        console.error('Données d’ingrédient invalides', card);
        return;
    }

    if (state.selectedIngredients.has(card)) {
        state.selectedIngredients.delete(card);
        card.classList.remove('selected');
        state.totalPrice -= price;
        card.querySelector('.selected-badge')?.remove();
    } else {
        state.selectedIngredients.add(card);
        card.classList.add('selected');
        state.totalPrice += price;
        card.appendChild(createBadge());
    }

    updatePriceDisplay();
    updateAddToCartButtonState();
}

// Créer un badge de sélection
function createBadge() {
    const badge = document.createElement('div');
    badge.className = 'selected-badge';
    badge.textContent = '✓';
    badge.setAttribute('aria-hidden', 'true');
    return badge;
}

// Mettre à jour l’affichage du prix et du compteur
function updatePriceDisplay() {
    const totalElement = document.getElementById('total-price');
    const selectedCount = document.getElementById('selected-count');
    const validationMsg = document.getElementById('validationMsg');

    if (totalElement) totalElement.textContent = state.totalPrice.toLocaleString();
    if (selectedCount) selectedCount.textContent = `${state.selectedIngredients.size}/4`;
    if (validationMsg) validationMsg.style.display = state.selectedIngredients.size < 4 ? 'inline' : 'none';
}

// Activer/désactiver le bouton "Ajouter au panier"
function updateAddToCartButtonState() {
    const addToCartBtn = document.querySelector('.blend-btn.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.disabled = state.selectedIngredients.size < 4;
        addToCartBtn.setAttribute('aria-disabled', state.selectedIngredients.size < 4);
    }
}

// Ajouter un smoothie personnalisé au panier
function addCustomSmoothieToCart() {
    if (state.selectedIngredients.size < 4) {
        showToast(MESSAGES.MIN_INGREDIENTS);
        return;
    }

    const ingredients = Array.from(state.selectedIngredients)
        .map(card => card.querySelector('span:not(.price)')?.textContent)
        .filter(Boolean);

    state.cart.push({
        item: `Smoothie personnalisé (${ingredients.join(', ')})`,
        price: state.totalPrice,
        quantity: 1,
    });

    resetCustomSelection();
    updateCartDisplay();
    toggleCartModal();
    showToast(MESSAGES.ITEM_ADDED);
}

// Mettre à jour l’affichage du panier
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cartCount');

    if (!cartItems || !cartTotal || !cartCount) {
        console.error(MESSAGES.CART_ELEMENTS_NOT_FOUND);
        return;
    }

    cartItems.innerHTML = state.cart.length === 0 
        ? '<p>Panier vide</p>'
        : state.cart.map((item, index) => `
            <div class="cart-item" role="listitem">
                <span>${item.item}</span>
                <select onchange="updateQuantity(${index}, this.value)" aria-label="Quantité de ${item.item}">
                    ${[1, 2, 3, 4, 5].map(q => `<option value="${q}" ${item.quantity === q ? 'selected' : ''}>${q}</option>`).join('')}
                </select>
                <span>${(item.price * item.quantity).toLocaleString()} CFA</span>
                <button onclick="removeFromCart(${index})" aria-label="Supprimer ${item.item}">Supprimer</button>
            </div>
        `).join('');

    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = total.toLocaleString();
    cartCount.textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartIcon').setAttribute('aria-label', `Ouvrir le panier (${cartCount.textContent} articles)`);
}

// Mettre à jour la quantité
function updateQuantity(index, quantity) {
    state.cart[index].quantity = parseInt(quantity);
    updateCartDisplay();
}

// Supprimer un article du panier
function removeFromCart(index) {
    state.cart.splice(index, 1);
    updateCartDisplay();
    showToast(MESSAGES.ITEM_REMOVED);
}

// Afficher/fermer le modal panier
function toggleCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.toggle('active');
        modal.setAttribute('aria-hidden', !modal.classList.contains('active'));
    }
}

// Passer à la commande
function proceedToCheckout() {
    if (state.cart.length === 0 && state.selectedIngredients.size < 4) {
        showToast(MESSAGES.CART_EMPTY);
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

    if (!name || isNaN(price)) {
        console.error('Données du smoothie invalides', button);
        return;
    }

    state.cart.push({ item: name, price, quantity: 1 });
    updateCartDisplay();
    toggleCartModal();
    showToast(MESSAGES.ITEM_ADDED);
    button.classList.add('added');
    setTimeout(() => button.classList.remove('added'), 1000); // Animation visuelle
}

// Valider le nom
function validateName() {
    const name = document.getElementById('clientName')?.value.trim();
    const error = document.getElementById('nameError');
    if (error) {
        const isValid = name && /^[a-zA-Z\s]{2,}$/.test(name);
        error.textContent = isValid ? '' : 'Nom requis (minimum 2 caractères)';
        error.classList.toggle('active', !isValid);
        return isValid;
    }
    return false;
}

// Valider le téléphone
function validatePhone() {
    const phone = document.getElementById('clientPhone')?.value.trim();
    const error = document.getElementById('phoneError');
    if (error) {
        const isValid = /^[0-9]{8}$/.test(phone);
        error.textContent = isValid ? '' : 'Numéro de téléphone invalide (8 chiffres requis)';
        error.classList.toggle('active', !isValid);
        return isValid;
    }
    return false;
}

// Valider l'adresse
function validateAddress() {
    const address = document.getElementById('clientAddress')?.value.trim();
    const error = document.getElementById('addressError');
    if (error) {
        const isValid = address && address.length >= 5;
        error.textContent = isValid ? '' : 'Adresse requise (minimum 5 caractères)';
        error.classList.toggle('active', !isValid);
        return isValid;
    }
    return false;
}

// Traiter la commande
function processOrder(event) {
    event.preventDefault();
    const name = document.getElementById('clientName')?.value.trim();
    const phone = document.getElementById('clientPhone')?.value.trim();
    const address = document.getElementById('clientAddress')?.value.trim();

    if (!validateName() || !validatePhone() || !validateAddress() || (state.cart.length === 0 && state.selectedIngredients.size < 4)) {
        showToast(MESSAGES.INVALID_FORM);
        return;
    }

    const confirmation = document.getElementById('orderConfirmation');
    const confirmationTotal = document.getElementById('confirmation-total');
    const orderNumberElement = document.getElementById('order-number');

    if (!confirmation || !confirmationTotal || !orderNumberElement) {
        console.error(MESSAGES.CONFIRMATION_NOT_FOUND);
        return;
    }

    confirmationTotal.textContent = state.cart
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toLocaleString();
    orderNumberElement.textContent = `#FM2025-${(++state.orderNumber).toString().padStart(3, '0')}`;
    confirmation.classList.add('active');
    confirmation.setAttribute('aria-hidden', 'false');

    const closeConfirmation = document.querySelector('.close-confirmation');
    if (closeConfirmation) {
        closeConfirmation.addEventListener('click', () => {
            confirmation.classList.remove('active');
            confirmation.setAttribute('aria-hidden', 'true');
            document.getElementById('orderForm')?.reset();
            resetCartAndSelection();
        }, { once: true });
    }
}

// Réinitialiser le panier et la sélection
function resetCartAndSelection() {
    state.cart = [];
    state.selectedIngredients.forEach(card => {
        card.classList.remove('selected');
        card.querySelector('.selected-badge')?.remove();
    });
    state.selectedIngredients.clear();
    state.totalPrice = 0;
    updateCartDisplay();
    updatePriceDisplay();
    updateAddToCartButtonState();
}

// Sélectionner le mode de paiement
function selectPaymentMethod(provider) {
    document.querySelectorAll('.momo-provider').forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-checked', 'false');
    });
    provider.classList.add('active');
    provider.setAttribute('aria-checked', 'true');
}

// Réinitialiser la sélection d’ingrédients
function resetCustomSelection() {
    state.selectedIngredients.forEach(card => {
        card.classList.remove('selected');
        card.querySelector('.selected-badge')?.remove();
    });
    state.selectedIngredients.clear();
    state.totalPrice = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    updatePriceDisplay();
    updateAddToCartButtonState();
}

// Afficher une notification Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('active');
        toast.setAttribute('role', 'alert');
        setTimeout(() => {
            toast.classList.remove('active');
            toast.removeAttribute('role');
        }, 3000);
    }
}