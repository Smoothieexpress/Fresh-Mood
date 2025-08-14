// Constantes globales
const MESSAGES = {
    MIN_INGREDIENTS: "Sélectionnez 4 ingrédients minimum",
    CART_EMPTY: "Panier vide ou sélectionnez 4 ingrédients",
    ITEM_ADDED: "Smoothie ajouté au panier !",
    ITEM_REMOVED: "Article supprimé",
    INVALID_FORM: "Veuillez remplir tous les champs correctement",
    ORDER_SENT: "Commande envoyée via WhatsApp !",
};

// Variables d'état
let state = {
    totalPrice: 0,
    selectedIngredients: new Set(),
    cart: [],
    orderNumber: 1000,
};

// Numéro WhatsApp de l'entreprise
const BUSINESS_PHONE = "+22966953934";

// Initialisation
document.addEventListener('DOMContentLoaded', initializeApp);

// Fonction principale d'initialisation
function initializeApp() {
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

    // Ajouter les écouteurs pour les boutons "Commander" des offres
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
    if (validationMsg) validationMsg.style.display = state.selectedIngredients.size < 4 ? 'inline indagini

System: The response was cut off due to length constraints. Below is the completion of the **app.js** file, ensuring all requested functionalities are included. This completes the full code for you to copy and paste into your repository.

---

### **app.js** (continued)

```javascript
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
        item: `Smoothie personnalisé`,
        ingredients: ingredients,
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
        console.error('Éléments du panier non trouvés');
        return;
    }

    cartItems.innerHTML = state.cart.length === 0 
        ? '<p>Panier vide</p>'
        : state.cart.map((item, index) => `
            <div class="cart-item" role="listitem">
                <div class="cart-item-details">
                    <span>${item.item}</span>
                    <span>${(item.price * item.quantity).toLocaleString()} CFA</span>
                </div>
                <p>Ingrédients: ${item.ingredients ? item.ingredients.join(', ') : 'Non spécifié'}</p>
                <div class="cart-item-details">
                    <select onchange="updateQuantity(${index}, this.value)" aria-label="Quantité de ${item.item}">
                        ${[1, 2, 3, 4, 5].map(q => `<option value="${q}" `\({item.quantity === q ? 'selected' : ''}>\)`{q}</option>`).join('')}
                    </select>
                    <button onclick="removeFromCart(${index})" aria-label="Supprimer ${item.item}">Supprimer</button>
                </div>
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

// Ajouter un smoothie prédéfini et envoyer directement via WhatsApp
function handleQuickOrder(event) {
    const button = event.currentTarget;
    const price = parseInt(button.dataset.discount);
    const name = button.dataset.name;
    const ingredients = button.dataset.ingredients.split(', ');

    if (!name || isNaN(price)) {
        console.error('Données du smoothie invalides', button);
        return;
    }

    // Ajouter au panier pour affichage
    state.cart.push({ item: name, price, ingredients, quantity: 1 });
    updateCartDisplay();
    toggleCartModal();
    showToast(MESSAGES.ITEM_ADDED);

    // Aller directement au formulaire pour commander via WhatsApp
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

// Générer le message de commande
function generateOrderMessage(name, phone, address) {
    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderNumber = `#FM2025-${(++state.orderNumber).toString().padStart(3, '0')}`;
    let message = `Nouvelle commande ${orderNumber}\n\n`;
    message += `Client: ${name}\n`;
    message += `Téléphone: ${phone}\n`;
    message += `Adresse: ${address}\n\n`;
    message += `Détails de la commande:\n`;
    state.cart.forEach(item => {
        message += `- ${item.item} (x${item.quantity})\n`;
        if (item.ingredients) {
            message += `  Ingrédients: ${item.ingredients.join(', ')}\n`;
        }
        message += `  Prix: ${(item.price * item.quantity).toLocaleString()} CFA\n`;
    });
    message += `\nTotal: ${total.toLocaleString()} CFA`;
    return { message, orderNumber, total };
}

// Envoyer via WhatsApp
function sendWhatsAppMessage(phone, message, isClient = false) {
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = isClient ? `+229${phone}` : BUSINESS_PHONE;
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
}

// Traiter la commande
function processOrder(event) {
    event.preventDefault();
    const name = document.getElementById('clientName')?.value.trim();
    const phone = document.getElementById('clientPhone')?.value.trim();
    const address = document.getElementById('clientAddress')?.value.trim();

    if (!validateName() || !validatePhone() || !validateAddress() || state.cart.length === 0) {
        showToast(MESSAGES.INVALID_FORM);
        return;
    }

    const { message, orderNumber, total } = generateOrderMessage(name, phone, address);

    // Envoyer à l'entreprise
    sendWhatsAppMessage(phone, message);

    // Envoyer la facture au client
    const clientMessage = `Bonjour ${name},\nVotre commande ${orderNumber} a été reçue par Fresh Mood !\n\n${message}\n\nVotre smoothie arrive dans 15-20min. Merci !`;
    sendWhatsAppMessage(phone, clientMessage, true);

    // Afficher la confirmation
    const confirmation = document.getElementById('orderConfirmation');
    const confirmationTotal = document.getElementById('confirmation-total');
    const orderNumberElement = document.getElementById('order-number');

    if (!confirmation || !confirmationTotal || !orderNumberElement) {
        console.error('Éléments de confirmation non trouvés');
        return;
    }

    confirmationTotal.textContent = total.toLocaleString();
    orderNumberElement.textContent = orderNumber;
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