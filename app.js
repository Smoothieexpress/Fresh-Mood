// Configuration des données premium
const specialSmoothies = [
    {
        id: 1,
        name: "Boost Testosterone",
        price: 2500,
        discount: 2000,
        ingredients: ["Gingembre", "Maca", "Banane", "Lait d'amande"],
        benefits: ["Augmente l'énergie", "Améliore la performance"],
        emoji: "💪",
        color: "#FF9F40",
        isNew: true
    },
    {
        id: 2,
        name: "Passion Night",
        price: 3000,
        discount: 2400,
        ingredients: ["Fraise", "Chocolat", "Miel", "Ginseng"],
        benefits: ["Aphrodisiaque naturel", "Favorise la relaxation"],
        emoji: "💖",
        color: "#FF69B4",
        isPopular: true
    },
    {
        id: 3,
        name: "Detox Morning",
        price: 2200,
        discount: 1800,
        ingredients: ["Ananas", "Céleri", "Gingembre", "Citron"],
        benefits: ["Élimine les toxines", "Boost matinal"],
        emoji: "🌿",
        color: "#38B2AC",
        isVegan: true
    }
];

// État global de l'application
const appState = {
    cart: {
        items: [],
        total: 0
    },
    selectedPayment: null,
    currentOrder: null
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    initSwiperCarousel();
    setupIngredientsSelection();
    setupPromoBanner();
    setupOrderForm();
    setupMobileMenu();
    setupQuickOrderButtons();
    setupPaymentMethods();
    renderAllSmoothies();
});

/* ==================== */
/* FONCTIONS PRINCIPALES */
/* ==================== */

// 1. Carrousel des smoothies
function initSwiperCarousel() {
    const swiper = new Swiper('.swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
}

// 2. Affichage des smoothies
function renderAllSmoothies() {
    renderPromoSmoothies();
    renderSignatureSmoothies();
}

function renderSignatureSmoothies() {
    const container = document.getElementById('smoothies-container');
    
    container.innerHTML = specialSmoothies.map(smoothie => `
        <div class="swiper-slide">
            <div class="smoothie-card" style="border-color: ${smoothie.color}">
                ${smoothie.isNew ? '<span class="badge-new">Nouveau</span>' : ''}
                ${smoothie.isPopular ? '<span class="badge-popular">Populaire</span>' : ''}
                
                <div class="smoothie-header">
                    <span class="smoothie-emoji">${smoothie.emoji}</span>
                    <h3>${smoothie.name}</h3>
                </div>
                
                <div class="smoothie-details">
                    <ul class="ingredients">
                        ${smoothie.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                    
                    <div class="benefits">
                        ${smoothie.benefits.map(benefit => `<span class="benefit-tag">${benefit}</span>`).join('')}
                    </div>
                </div>
                
                <div class="smoothie-footer">
                    <div class="price">
                        <span class="original-price">${smoothie.price} CFA</span>
                        <span class="discounted-price">${smoothie.discount} CFA</span>
                    </div>
                    <button class="order-btn" 
                            data-id="${smoothie.id}"
                            data-name="${smoothie.name}"
                            data-price="${smoothie.discount}">
                        Commander
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 3. Gestion des ingrédients
function setupIngredientsSelection() {
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', function() {
            const ingredientId = this.dataset.id;
            const ingredientPrice = parseInt(this.dataset.price);
            
            // Toggle selection
            if (this.classList.toggle('selected')) {
                addToCart(ingredientId, ingredientPrice);
            } else {
                removeFromCart(ingredientId, ingredientPrice);
            }
            
            updateCartDisplay();
        });
    });
}

function addToCart(id, price) {
    appState.cart.items.push({ id, price });
    appState.cart.total += price;
}

function removeFromCart(id, price) {
    appState.cart.items = appState.cart.items.filter(item => item.id !== id);
    appState.cart.total -= price;
}

// 4. Gestion des commandes
function setupQuickOrderButtons() {
    document.querySelectorAll('.order-btn, .promo-order-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const price = this.dataset.price;
            const name = this.dataset.name;
            
            // Ajout au panier
            appState.cart.total = parseInt(price);
            updateCartDisplay();
            
            // Scroll vers le formulaire
            document.getElementById('contact').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// 5. Formulaire de commande
function setupOrderForm() {
    const form = document.getElementById('orderForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateOrderForm()) {
            processOrder();
        }
    });
}

function validateOrderForm() {
    // Validation des champs
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    
    if (!name) {
        showAlert('error', 'Veuillez entrer votre nom complet');
        return false;
    }
    
    if (!phone || !/^(229|00229|\+229)?[0-9]{8}$/.test(phone)) {
        showAlert('error', 'Numéro de téléphone invalide (format: 96 12 34 56)');
        return false;
    }
    
    if (appState.cart.total === 0) {
        showAlert('error', 'Veuillez sélectionner au moins un produit');
        return false;
    }
    
    if (!appState.selectedPayment) {
        showAlert('error', 'Veuillez sélectionner un mode de paiement');
        return false;
    }
    
    return true;
}

function processOrder() {
    // Simulation de traitement
    showLoadingAnimation();
    
    setTimeout(() => {
        hideLoadingAnimation();
        showOrderConfirmation();
    }, 2000);
}

// 6. Affichage et mise à jour
function updateCartDisplay() {
    document.getElementById('total-price').textContent = appState.cart.total.toLocaleString();
    document.getElementById('selected-count').textContent = appState.cart.items.length;
    
    // Animation
    document.querySelector('.price-display').classList.add('updated');
    setTimeout(() => {
        document.querySelector('.price-display').classList.remove('updated');
    }, 300);
}

function showOrderConfirmation() {
    const confirmation = document.getElementById('orderConfirmation');
    
    // Génération numéro de commande
    const orderNumber = `FM-${Date.now().toString().slice(-6)}`;
    
    // Mise à jour des infos
    document.getElementById('confirmation-total').textContent = appState.cart.total.toLocaleString();
    document.getElementById('order-number').textContent = orderNumber;
    
    // Affichage
    confirmation.hidden = false;
    document.body.style.overflow = 'hidden';
}

// 7. Fonctions utilitaires
function setupPromoBanner() {
    document.querySelector('.close-banner').addEventListener('click', () => {
        document.querySelector('.promo-banner').style.display = 'none';
    });
}

function setupPaymentMethods() {
    document.querySelectorAll('.momo-provider').forEach(btn => {
        btn.addEventListener('click', function() {
            appState.selectedPayment = this.dataset.provider;
            
            // Mise à jour visuelle
            document.querySelectorAll('.momo-provider').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
}

function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function showLoadingAnimation() {
    const btn = document.querySelector('.blend-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
}

function hideLoadingAnimation() {
    const btn = document.querySelector('.blend-btn');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-blender"></i> Lancer le blender';
}

// Initialisation du service worker pour le PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW enregistré:', registration.scope);
            })
            .catch(error => {
                console.log('Échec SW:', error);
            });
    });
}