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
const state = {
    totalPrice: 0,
    selectedIngredients: new Set(),
    orderNumber: 1000,
    selectedProvider: 'mtn',
    isProcessing: false
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    try {
        loadSpecialSmoothies();
        initSwiper();
        setupEventListeners();
        setupConfirmationClose();
        setupBannerClose();
        setupNavigation();
        setupMobileMenu();
        registerServiceWorker();
        setupOfflineDetection();
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
        showAlert('error', 'Une erreur est survenue lors du chargement');
    }
});

function setupEventListeners() {
    // Écouteurs délégués pour meilleure performance
    document.addEventListener('click', handleDelegatedEvents);

    // Écouteur pour le formulaire
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', processOrder);
    }

    // Optimisation des entrées mobiles
    handleResponsiveInputs();
}

function handleDelegatedEvents(event) {
    const target = event.target.closest('[data-action]') || event.target;

    // Gestion des ingrédients
    if (target.closest('.ingredient-card')) {
        toggleIngredientSelection(target.closest('.ingredient-card'));
        return;
    }

    // Commandes rapides
    if (target.closest('.promo-order-btn, .order-btn, .signature-order-btn')) {
        handleQuickOrder(event);
        return;
    }

    // Paiement Mobile Money
    if (target.closest('.momo-provider')) {
        selectPaymentMethod(target.closest('.momo-provider'));
        return;
    }
}

// Gestion des commandes rapides
function handleQuickOrder(event) {
    event.preventDefault();
    try {
        const card = event.currentTarget.closest('.promo-card, .signature-card');
        if (!card) return;

        const price = parseInt(card.dataset.discount || card.dataset.price);
        const name = card.dataset.name;

        if (!price || !name) return;

        state.totalPrice = price;
        updatePriceDisplay();

        // Scroll vers le formulaire
        document.getElementById('contact').scrollIntoView({
            behavior: 'smooth'
        });

        // Pré-remplir le nom du produit
        const nameInput = document.getElementById('clientName');
        if (nameInput) {
            nameInput.value = name;
            nameInput.focus();
        }
    } catch (error) {
        console.error("Erreur commande rapide:", error);
        showAlert('error', 'Erreur lors de la commande');
    }
}

// Traitement du formulaire
async function processOrder(event) {
    event.preventDefault();
    if (state.isProcessing) return;

    try {
        state.isProcessing = true;
        disableForm(true);

        if (!validateForm()) {
            state.isProcessing = false;
            disableForm(false);
            return;
        }

        await playBlenderEffect();
        showOrderConfirmation();
    } catch (error) {
        console.error("Erreur traitement commande:", error);
        showAlert('error', 'Erreur lors du traitement');
    } finally {
        state.isProcessing = false;
        disableForm(false);
    }
}

function disableForm(disabled) {
    const form = document.getElementById('orderForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, button, select, textarea');
    inputs.forEach(input => {
        input.disabled = disabled;
        if (input.tagName === 'BUTTON') {
            input.classList.toggle('loading', disabled);
        }
    });
}

// Validation améliorée avec messages précis
function validateForm() {
    const errors = [];
    const name = document.getElementById('clientName')?.value.trim();
    const phone = document.getElementById('clientPhone')?.value.trim();
    const phoneRegex = /^(229|00229|\+229)?[0-9]{8}$/;

    if (!name) errors.push('Le nom est requis');
    if (!phone || !phoneRegex.test(phone.replace(/\D/g, ''))) {
        errors.push('Numéro invalide (ex: 96123456)');
    }
    if (state.selectedIngredients.size < 4 && state.totalPrice === 0) {
        errors.push('Sélectionnez 4 ingrédients minimum');
    }
    if (!state.selectedProvider) {
        errors.push('Sélectionnez un mode de paiement');
    }

    if (errors.length > 0) {
        showAlert('error', errors.join('<br>'));
        return false;
    }
    return true;
}

// Effet blender avec Promise
function playBlenderEffect() {
    return new Promise((resolve) => {
        const blendBtn = document.querySelector('.blend-btn');
        const sound = document.getElementById('blenderSound');
        
        // Feedback tactile
        if ('vibrate' in navigator) navigator.vibrate([30, 40, 30]);
        
        // Son (gestion d'erreur silencieuse)
        sound?.play()?.catch(() => {});
        
        // Animation GSAP
        if (typeof gsap !== 'undefined') {
            gsap.to(blendBtn, {
                keyframes: [
                    { scale: 0.95, duration: 0.1 },
                    { rotate: "+=5deg", duration: 0.05 },
                    { rotate: "-=10deg", duration: 0.05 },
                    { rotate: "+=5deg", duration: 0.05 }
                ],
                onComplete: resolve
            });
        } else {
            setTimeout(resolve, 500);
        }
    });
}

function showOrderConfirmation() {
    const confirmation = document.getElementById('orderConfirmation');
    if (!confirmation) return;

    try {
        // Génération numéro de commande
        const now = new Date();
        const orderId = `#FM${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${state.orderNumber++}`;
        
        document.getElementById('confirmation-total').textContent = state.totalPrice.toLocaleString();
        document.getElementById('order-number').textContent = orderId;
        
        // Animation d'apparition
        confirmation.hidden = false;
        document.body.style.overflow = 'hidden';
        
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(confirmation,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
            
            gsap.fromTo('.confirmation-content',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "back.out" }
            );
        } else {
            confirmation.style.opacity = 1;
        }
    } catch (error) {
        console.error("Erreur confirmation:", error);
        showAlert('error', 'Erreur lors de la confirmation');
    }
}

function setupConfirmationClose() {
    const closeBtn = document.querySelector('.close-confirmation');
    if (!closeBtn) return;

    closeBtn.addEventListener('click', () => {
        const confirmation = document.getElementById('orderConfirmation');
        if (typeof gsap !== 'undefined') {
            gsap.to(confirmation, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    confirmation.hidden = true;
                    document.body.style.overflow = 'auto';
                    resetForm();
                }
            });
        } else {
            confirmation.hidden = true;
            document.body.style.overflow = 'auto';
            resetForm();
        }
    });
}

function resetForm() {
    const form = document.getElementById('orderForm');
    if (!form) return;

    form.reset();
    state.selectedIngredients.forEach(id => {
        const card = document.querySelector(`[data-id="${id}"]`);
        card?.classList.remove('selected');
    });
    state.selectedIngredients.clear();
    state.totalPrice = 0;
    updatePriceDisplay();
}

function setupBannerClose() {
    const closeBtn = document.querySelector('.close-banner');
    if (!closeBtn) return;

    closeBtn.addEventListener('click', () => {
        const banner = document.querySelector('.promo-banner');
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

function setupNavigation() {
    document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a[href^="#"]');
        if (!anchor) return;

        event.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const headerHeight = document.querySelector('.main-header')?.offsetHeight || 100;
            window.scrollTo({
                top: target.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    });
}

function scrollToSection(selector) {
    const target = document.querySelector(selector);
    if (target) {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 100;
        window.scrollTo({
            top: target.offsetTop - headerHeight,
            behavior: 'smooth'
        });
    }
}

function handleResponsiveInputs() {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) return;

    document.querySelectorAll('input, textarea, select').forEach(input => {
        // Correction zoom iOS
        input.style.fontSize = '16px';
        
        input.addEventListener('focus', () => {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        });
        
        input.addEventListener('blur', () => {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
        });
    });
}

function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(alert);
    
    // Animation entrée
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(alert,
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3 }
        );
    }
    
    // Disparition après 3s
    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            gsap.to(alert, {
                y: -50,
                opacity: 0,
                duration: 0.3,
                onComplete: () => alert.remove()
            });
        } else {
            alert.remove();
        }
    }, 3000);
}

function setupOfflineDetection() {
    window.addEventListener('offline', () => {
        showAlert('error', 'Vous êtes hors connexion');
    });
    
    window.addEventListener('online', () => {
        showAlert('success', 'Connexion rétablie');
    });
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('SW enregistré:', reg.scope))
                .catch(err => console.log('Échec SW:', err));
        });
    }
}

// Initialisation Swiper
function initSwiper() {
    if (typeof Swiper === 'undefined') return;

    try {
        new Swiper('.swiper', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            breakpoints: {
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    } catch (error) {
        console.error("Erreur Swiper:", error);
    }
}

function loadSpecialSmoothies() {
    const container = document.getElementById('smoothies-container');
    if (!container) return;

    container.innerHTML = specialSmoothies.map(smoothie => `
        <article class="swiper-slide signature-card" data-name="${smoothie.name}" data-price="${smoothie.price}">
            <div class="signature-content" style="border-color: ${smoothie.color}">
                <h3>${smoothie.name}</h3>
                <p>${smoothie.ingredients.join(', ')}</p>
                <div class="signature-price">${smoothie.discount.toLocaleString()} CFA</div>
                <button class="signature-order-btn" 
                        onclick="handleQuickOrder(event)">
                    Commander
                </button>
            </div>
        </article>
    `).join('');
}

// Gestion des ingrédients
function toggleIngredientSelection(card) {
    if (!card) return;
    
    const price = parseInt(card.dataset.price) || 0;
    const id = card.getAttribute('data-id') || card.textContent.trim();
    
    card.classList.toggle('selected');
    
    if (card.classList.contains('selected')) {
        state.selectedIngredients.add(id);
        state.totalPrice += price;
    } else {
        state.selectedIngredients.delete(id);
        state.totalPrice -= price;
    }
    
    updatePriceDisplay();
}

function updatePriceDisplay() {
    const totalElement = document.getElementById('total-price');
    const countElement = document.getElementById('selected-count');
    const validationMsg = document.getElementById('validationMsg');
    
    if (totalElement) {
        totalElement.textContent = state.totalPrice.toLocaleString();
        totalElement.classList.add('price-update');
        setTimeout(() => totalElement.classList.remove('price-update'), 500);
    }
    
    if (countElement) {
        countElement.textContent = state.selectedIngredients.size;
    }
    
    if (validationMsg) {
        if (state.selectedIngredients.size >= 4) {
            validationMsg.innerHTML = '<i class="fas fa-check-circle"></i> <span>Prêt à commander !</span>';
            validationMsg.style.color = '#4CAF50';
        } else {
            validationMsg.innerHTML = '<i class="fas fa-info-circle"></i> <span>Sélectionnez au moins 4 ingrédients</span>';
            validationMsg.style.color = '#FF9800';
        }
    }
}

// Gestion paiement Mobile Money
function selectPaymentMethod(provider) {
    if (!provider) return;

    document.querySelectorAll('.momo-provider').forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-pressed', 'false');
    });

    provider.classList.add('active');
    provider.setAttribute('aria-pressed', 'true');
    state.selectedProvider = provider.dataset.provider;
}

// Menu Mobile Garanti Sans Bug
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger-btn');
    const nav = document.querySelector('.main-nav');
    const body = document.body;

    if (!hamburger || !nav) return;

    // Gestion du clic sur le hamburger
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Mise à jour de l'accessibilité
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
    });

    // Fermer le menu au clic sur un lien
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                body.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Gestion des sous-menus sur mobile
    document.querySelectorAll('.has-submenu > a').forEach(item => {
        item.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = item.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
}