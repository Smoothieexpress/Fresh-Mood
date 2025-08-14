// Constantes globales
const MESSAGES = {
    MIN_INGREDIENTS: "Sélectionnez au moins 4 ingrédients",
    CART_EMPTY: "Votre panier est vide ou sélectionnez 4 ingrédients",
    ITEM_ADDED: "Smoothie ajouté au panier !",
    ITEM_REMOVED: "Article supprimé du panier",
    INVALID_FORM: "Veuillez remplir tous les champs correctement",
    INVALID_PAYMENT: "Paiement Mobile Money non validé",
    ORDER_SENT: "Commande payée et envoyée via WhatsApp !",
};

// Initialisation
document.addEventListener('DOMContentLoaded', initializeApp);

// Fonction principale d'initialisation
function initializeApp() {
    loadCartFromLocalStorage();
    setupEventListeners();
    setupBannerAnimation();
    updateAddToCartButtonState();
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    const elements = {
        ingredientCards: document.querySelectorAll('.ingredient-card'),
        cartIcon: document.getElementById('cartIcon'),
        closeCart: document.querySelector('.close-cart'),
        orderForm: document.getElementById('orderForm'),
        menuToggle: document.querySelector('.menu-toggle'),
        clientName: document.getElementById('clientName'),
        clientPhone: document.getElementById('clientPhone'),
        clientAddress: document.getElementById('clientAddress'),
        paymentMethod: document.getElementById('paymentMethod'),
        addToCartBtn: document.querySelector('.blend-btn.add-to-cart'),
    };

    elements.ingredientCards.forEach(card => 
        card.addEventListener('click', () => toggleIngredientSelection(card))
    );
    elements.cartIcon?.addEventListener('click', toggleCartModal);
    elements.closeCart?.addEventListener('click', toggleCartModal);
    elements.orderForm?.addEventListener('submit', processOrder);
    elements.menuToggle?.addEventListener('click', () => {
        const nav = document.querySelector('.main-nav');
        const isExpanded = nav.classList.toggle('active');
        elements.menuToggle.setAttribute('aria-expanded', isExpanded);
    });
    elements.clientName?.addEventListener('input', validateName);
    elements.clientPhone?.addEventListener('input', validatePhone);
    elements.clientAddress?.addEventListener('input', validateAddress);
    elements.paymentMethod?.addEventListener('change', validatePayment);

    // Ajouter les écouteurs pour les boutons "Ajouter" des offres
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

    if (cartState.selectedIngredients.has(card)) {
        cartState.selectedIngredients.delete(card);
        card.classList.remove('selected');
        cartState.totalPrice -= price;
        card.querySelector('.selected-badge')?.remove();
    } else {
        cartState.selectedIngredients.add(card);
        card.classList.add('selected');
        cartState.totalPrice += price;
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

    if (totalElement) totalElement.textContent = cartState.totalPrice.toLocaleString();
    if (selectedCount) selectedCount.textContent = `${cartState.selectedIngredients.size}/4`;
    if (validationMsg) validationMsg.style.display = cartState.selectedIngredients.size < 4 ? 'inline' : 'none';
}

// Activer/désactiver le bouton "Ajouter au panier"
function updateAddToCartButtonState() {
    const addToCartBtn = document.querySelector('.blend-btn.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.disabled = cartState.selectedIngredients.size < 4;
        addToCartBtn.setAttribute('aria-disabled', cartState.selectedIngredients.size < 4);
    }
}

// Afficher/fermer le modal panier
function toggleCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.toggle('active');
        modal.setAttribute('aria-hidden', !modal.classList.contains('active'));
        if (modal.classList.contains('active')) {
            modal.showModal();
        } else {
            modal.close();
        }
    }
}

// Mettre à jour l’affichage du panier
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cartCount');

    if (!cartItems || !cartTotal || !cartCount) {
        console.error('Éléments du panier non trouvés');
        return;
    }

    cartItems.innerHTML = cartState.cart.length === 0 
        ? '<p>Votre panier est vide</p>'
        : cartState.cart.map((item, index) => `
            <div class="cart-item" role="listitem">
                <div class="cart-item-details">
                    <span>${item.item}</span>
                    <span>${(item.price * item.quantity).toLocaleString()} CFA</span>
                </div>
                <p>Ingrédients: ${item.ingredients ? item.ingredients.join(', ') : 'Non spécifié'}</p>
                <div class="cart-item-details">
                    <select onchange="updateQuantity(${index}, this.value)" aria-label="Quantité de ${item.item}">
                        ${[1, 2, 3, 4, 5].map(q => `<option value="${q}" ${item.quantity === q ? 'selected' : ''}>${q}</option>`).join('')}
                    </select>
                    <button onclick="removeFromCart(${index})" aria-label="Supprimer ${item.item}">Supprimer</button>
                </div>
            </div>
        `).join('');

    const total = cartState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + CONFIG.DELIVERY_FEE;
    cartTotal.textContent = total.toLocaleString();
    cartCount.textContent = cartState.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartIcon').setAttribute('aria-label', `Ouvrir le panier (${cartCount.textContent} articles)`);
}

// Passer à la commande
function proceedToCheckout() {
    if (cartState.cart.length === 0 && cartState.selectedIngredients.size < 4) {
        showToast(MESSAGES.CART_EMPTY);
        return;
    }
    toggleCartModal();
    const orderSection = document.getElementById('order');
    if (orderSection) orderSection.scrollIntoView({ behavior: 'smooth' });
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
        const isValid = /^\+229[0-9]{8}$/.test(phone);
        error.textContent = isValid ? '' : 'Numéro invalide (ex: +229 XX XX XX XX)';
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

// Valider le paiement
function validatePayment() {
    const paymentMethod = document.getElementById('paymentMethod')?.value;
    const error = document.getElementById('paymentError');
    if (error) {
        const isValid = CONFIG.PAYMENT_OPTIONS.includes(paymentMethod);
        error.textContent = isValid ? '' : 'Méthode de paiement requise';
        error.classList.toggle('active', !isValid);
        return isValid;
    }
    return false;
}

// Envoyer via WhatsApp
function sendWhatsAppMessage(phone, message, isClient = false) {
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = isClient ? phone : CONFIG.BUSINESS_PHONE;
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
}

// Traiter la commande
async function processOrder(event) {
    event.preventDefault();
    const name = document.getElementById('clientName')?.value.trim();
    const phone = document.getElementById('clientPhone')?.value.trim();
    const address = document.getElementById('clientAddress')?.value.trim();
    const paymentMethod = document.getElementById('paymentMethod')?.value;

    if (!validateName() || !validatePhone() || !validateAddress() || !validatePayment() || cartState.cart.length === 0) {
        showToast(MESSAGES.INVALID_FORM);
        return;
    }

    const total = cartState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + CONFIG.DELIVERY_FEE;

    // Simuler le paiement Mobile Money
    const paymentResult = await processMobileMoneyPayment(phone, total);
    if (!paymentResult.success) {
        showToast(MESSAGES.INVALID_PAYMENT);
        return;
    }

    const { message, orderNumber, total: orderTotal } = generateOrderMessage(name, phone, address, paymentResult.transactionId);

    // Envoyer à l'entreprise
    sendWhatsAppMessage(phone, message);

    // Envoyer la confirmation au client
    const clientMessage = `Bonjour ${name},\nVotre commande ${orderNumber} a été reçue par Fresh Mood !\nTotal: ${orderTotal.toLocaleString()} CFA\nVotre smoothie sera livré dans 15-20 minutes à Cotonou. Merci de votre confiance !`;
    sendWhatsAppMessage(phone, clientMessage, true);

    // Enregistrer dans Google Sheets (exemple avec endpoint fictif)
    logOrderToGoogleSheets({ name, phone, address, orderNumber, total: orderTotal, items: cartState.cart });

    // Afficher la confirmation
    const confirmation = document.getElementById('orderConfirmation');
    const confirmationTotal = document.getElementById('confirmation-total');
    const orderNumberElement = document.getElementById('order-number');

    if (!confirmation || !confirmationTotal || !orderNumberElement) {
        console.error('Éléments de confirmation non trouvés');
        return;
    }

    confirmationTotal.textContent = orderTotal.toLocaleString();
    orderNumberElement.textContent = orderNumber;
    confirmation.showModal();
    confirmation.setAttribute('aria-hidden', 'false');

    const closeConfirmation = document.querySelector('.close-confirmation');
    if (closeConfirmation) {
        closeConfirmation.addEventListener('click', () => {
            confirmation.close();
            confirmation.setAttribute('aria-hidden', 'true');
            document.getElementById('orderForm')?.reset();
            resetCartAndSelection();
        }, { once: true });
    }

    showToast(MESSAGES.ORDER_SENT);
}

// Réinitialiser le panier et la sélection
function resetCartAndSelection() {
    cartState.cart = [];
    cartState.selectedIngredients.forEach(card => {
        card.classList.remove('selected');
        card.querySelector('.selected-badge')?.remove();
    });
    cartState.selectedIngredients.clear();
    cartState.totalPrice = 0;
    updateCartDisplay();
    updatePriceDisplay();
    updateAddToCartButtonState();
    localStorage.removeItem('freshMoodCart');
}

// Réinitialiser la sélection d’ingrédients
function resetCustomSelection() {
    cartState.selectedIngredients.forEach(card => {
        card.classList.remove('selected');
        card.querySelector('.selected-badge')?.remove();
    });
    cartState.selectedIngredients.clear();
    cartState.totalPrice = cartState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

// Enregistrer la commande dans Google Sheets (exemple)
function logOrderToGoogleSheets(order) {
    // À remplacer par une requête vers Google Sheets API
    console.log('Enregistrement de la commande:', order);
    // Exemple d'intégration avec Google Sheets via Apps Script:
    /*
    fetch('https://script.google.com/macros/s/VOTRE_ID/exec', {
        method: 'POST',
        body: JSON.stringify(order)
    }).then(response => response.json()).then(data => console.log('Commande enregistrée:', data));
    */
}