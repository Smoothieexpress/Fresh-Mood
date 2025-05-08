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
        initSwiper();
        setupEventListeners();
        setupConfirmationClose();
        setupBannerClose();
        setupNavigation();
        registerServiceWorker();
        setupOfflineDetection();
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
        showAlert('error', 'Une erreur est survenue lors du chargement');
    }
});

function setupEventListeners() {
    // Écouteurs délégués pour meilleure performance
    document.addEventListener('DOMContentLoaded', function() {
    // Menu Hamburger
    const hamburger = document.querySelector('.hamburger-btn');
    const nav = document.querySelector('.main-nav');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Sous-menus
    document.querySelectorAll('.submenu-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.classList.toggle('active');
        });
    });
    
    // Fermer la bannière promo
    document.querySelector('.close-banner').addEventListener('click', function() {
        document.querySelector('.promo-banner').style.display = 'none';
    });
    
    // Sélection des ingrédients
    const ingredients = document.querySelectorAll('.ingredient-card');
    const state = {
        selectedIngredients: new Set(),
        totalPrice: 0
    };
    
    ingredients.forEach(ingredient => {
        ingredient.addEventListener('click', function() {
            const price = parseInt(this.dataset.price);
            const id = this.dataset.id || this.textContent.trim();
            
            if (state.selectedIngredients.has(id)) {
                // Désélection
                this.classList.remove('selected');
                state.selectedIngredients.delete(id);
                state.totalPrice -= price;
            } else {
                // Sélection
                this.classList.add('selected');
                state.selectedIngredients.add(id);
                state.totalPrice += price;
            }
            
            updateSelectionDisplay();
        });
    });
    
    function updateSelectionDisplay() {
        // Mise à jour du prix
        document.getElementById('total-price').textContent = state.totalPrice;
        
        // Mise à jour du compteur
        document.getElementById('selected-count').textContent = state.selectedIngredients.size;
        
        // Validation
        const validationMsg = document.getElementById('validationMsg');
        if (state.selectedIngredients.size >= 4) {
            validationMsg.innerHTML = '<i class="fas fa-check-circle"></i> Sélection valide';
            validationMsg.style.color = 'var(--success)';
        } else {
            validationMsg.innerHTML = '<i class="fas fa-info-circle"></i> Sélectionnez au moins 4 ingrédients';
            validationMsg.style.color = 'var(--error)';
        }
    }
    
    // Commandes rapides
    document.querySelectorAll('.promo-order-btn, .order-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const price = this.dataset.price || this.closest('[data-price]').dataset.price;
            const name = this.dataset.name || this.closest('[data-name]').dataset.name;
            
            state.totalPrice = parseInt(price);
            updateSelectionDisplay();
            
            // Pré-remplir le nom
            document.getElementById('clientName').value = name;
        });
    });
    
    // Paiement Mobile Money
    document.querySelectorAll('.momo-provider').forEach(provider => {
        provider.addEventListener('click', function() {
            document.querySelectorAll('.momo-provider').forEach(p => {
                p.classList.remove('active');
                p.setAttribute('aria-pressed', 'false');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            state.selectedProvider = this.dataset.provider;
        });
    });
    
    // Formulaire de commande
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Effet blender
            const blendBtn = document.querySelector('.blend-btn');
            const sound = document.getElementById('blenderSound');
            
            blendBtn.classList.add('processing');
            sound.play().catch(() => {});
            
            // Simulation traitement
            setTimeout(() => {
                showOrderConfirmation();
                blendBtn.classList.remove('processing');
            }, 1500);
        }
    });
    
    function validateForm() {
        // Votre logique de validation ici
        return true;
    }
    
    function showOrderConfirmation() {
        const confirmation = document.getElementById('orderConfirmation');
        document.getElementById('confirmation-total').textContent = state.totalPrice;
        document.getElementById('order-number').textContent = `#FM${Date.now().toString().slice(-4)}`;
        
        confirmation.hidden = false;
        document.body.style.overflow = 'hidden';
        
        // Fermer la confirmation
        document.querySelector('.close-confirmation').addEventListener('click', function() {
            confirmation.hidden = true;
            document.body.style.overflow = '';
        });
    }
    
    // Charger les spécialités
    loadSpecialties();
});

function loadSpecialties() {
    const specialties = [
        {
            name: "Boost Energy",
            price: 2500,
            discount: 2000,
            ingredients: ["Banane", "Mangue", "Gingembre"],
            emoji: "⚡"
        }
        // Ajoutez d'autres spécialités
    ];
    
    const container = document.getElementById('smoothies-container');
    
    specialties.forEach(item => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="smoothie-card">
                <h3>${item.name} ${item.emoji}</h3>
                <p>${item.ingredients.join(', ')}</p>
                <div class="price">${item.discount} CFA <small>${item.price} CFA</small></div>
                <button class="order-btn" data-price="${item.discount}" data-name="${item.name}">Commander</button>
            </div>
        `;
        container.appendChild(slide);
    });
    
    // Initialiser Swiper
    new Swiper('.swiper', {
        loop: true,
        pagination: { el: '.swiper-pagination' },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });
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

// Gestion des ingrédients
function toggleIngredientSelection(event) {
    const card = event.currentTarget;
    const id = card.dataset.id || card.textContent.trim();
    const price = parseInt(card.dataset.price) || 0;

    if (state.selectedIngredients.has(id)) {
        card.classList.remove('selected');
        state.selectedIngredients.delete(id);
        state.totalPrice -= price;
    } else {
        card.classList.add('selected');
        state.selectedIngredients.add(id);
        state.totalPrice += price;
    }

    updatePriceDisplay();
}

function updatePriceDisplay() {
    const totalElement = document.getElementById('total-price');
    const countElement = document.getElementById('selected-count');
    
    if (totalElement) {
        totalElement.textContent = state.totalPrice.toLocaleString();
        totalElement.classList.add('price-update');
        setTimeout(() => totalElement.classList.remove('price-update'), 500);
    }
    
    if (countElement) {
        countElement.textContent = state.selectedIngredients.size;
    }
}

// Gestion paiement Mobile Money
function selectPaymentMethod(event) {
    const provider = event.currentTarget;
    const providerType = provider.dataset.provider;
    
    if (!providerType) return;
    
    document.querySelectorAll('.momo-provider').forEach(p => {
        p.classList.toggle('active', p === provider);
        p.setAttribute('aria-pressed', p === provider ? 'true' : 'false');
    });
    
    state.selectedProvider = providerType;
}

// Optimisation pour le mobile
function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.main-nav ul');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active', !isExpanded);
    });
}