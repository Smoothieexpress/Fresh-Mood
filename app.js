const FRESHMOOD = {
    // Configuration
    config: {
        smoothies: [
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
                name: "Boost Testosterone",
                price: 2500,
                discount: 2000,
                ingredients: ["Gingembre", "Maca", "Banane", "Lait d'amande"],
                badges: ["🚀 Énergie", "💪 Performance"],
                emoji: "💪",
                color: "#FF9F40"
            }
        ],
        fruits: [
            { name: "Banane", price: 300, icon: "fa-banana" },
            { name: "Fraise", price: 400, icon: "fa-strawberry" },
            { name: "Mangue", price: 350, icon: "fa-mango" },
            { name: "Ananas", price: 450, icon: "fa-pineapple" }
        ],
        boosters: [
            { name: "Gingembre", price: 500, icon: "fa-root" },
            { name: "Noix de coco", price: 600, icon: "fa-coconut" },
            { name: "Spiruline", price: 900, icon: "fa-seedling" }
        ]
    },

    // Initialisation
    init() {
        this.totalPrice = 0;
        this.selectedIngredients = new Set();
        this.orderNumber = 1000;
        this.selectedProvider = 'mtn';

        this.initSwiper();
        this.renderSmoothies();
        this.renderIngredients();
        this.setupEventListeners();
    },

    // Setup des événements
    setupEventListeners() {
        // Fermeture bannière promo
        document.querySelector('.close-banner')?.addEventListener('click', () => {
            document.querySelector('.promo-banner').remove();
        });

        // Sélection ingrédients
        document.querySelectorAll('.ingredient-card').forEach(card => {
            card.addEventListener('click', () => this.toggleIngredient(card));
        });

        // Sélection mode de paiement
        document.querySelectorAll('.momo-provider').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.momo-provider').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                this.selectedProvider = btn.dataset.provider;
            });
        });

        // Fermeture confirmation
        document.querySelector('.close-confirmation')?.addEventListener('click', () => {
            document.getElementById('orderConfirmation').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    },

    // Gestion des ingrédients
    toggleIngredient(card) {
        const price = parseInt(card.dataset.price);
        
        if (card.classList.toggle('selected')) {
            this.selectedIngredients.add(card);
            this.totalPrice += price;
            card.append(this.createBadge());
        } else {
            this.selectedIngredients.delete(card);
            this.totalPrice -= price;
            card.querySelector('.selected-badge')?.remove();
        }
        
        this.updatePriceDisplay();
    },

    createBadge() {
        const badge = document.createElement('span');
        badge.className = 'selected-badge';
        badge.innerHTML = '<i class="fas fa-check"></i>';
        return badge;
    },

    // Mise à jour de l'affichage
    updatePriceDisplay() {
        const totalElement = document.getElementById('total-price');
        const countElement = document.getElementById('selected-count');
        const validationMsg = document.getElementById('validationMsg');
        
        totalElement.textContent = this.totalPrice.toLocaleString();
        countElement.textContent = this.selectedIngredients.size;
        
        if (this.selectedIngredients.size >= 4) {
            validationMsg.style.display = 'none';
            countElement.innerHTML = `<i class="fas fa-check"></i> ${this.selectedIngredients.size}/4`;
        } else {
            validationMsg.style.display = 'flex';
            countElement.textContent = `${this.selectedIngredients.size}/4`;
        }
    },

    // Commandes rapides
    handleQuickOrder(price, name) {
        this.totalPrice = price;
        this.updatePriceDisplay();
        
        // Scroll vers le formulaire
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        
        // Focus sur le nom
        document.getElementById('clientName').focus();
    },

    // Traitement du formulaire
    processOrder(event) {
        event.preventDefault();
        
        // Validation
        if (!this.validateForm()) return false;
        
        // Effet blender
        this.playBlenderEffect(() => {
            this.showConfirmation();
        });
        
        return false;
    },

    validateForm() {
        const errors = [];
        const name = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();

        if (!name) errors.push("Veuillez entrer votre nom");
        if (!phone || !/^(229|00229|\+229)?[0-9]{8}$/.test(phone.replace(/\D/g, ''))) {
            errors.push("Numéro de téléphone invalide");
        }
        if (this.selectedIngredients.size < 4 && this.totalPrice === 0) {
            errors.push("Sélectionnez au moins 4 ingrédients");
        }
        if (!this.selectedProvider) errors.push("Sélectionnez un mode de paiement");

        if (errors.length > 0) {
            alert("Erreur :\n" + errors.join("\n"));
            return false;
        }
        return true;
    },

    // Effet blender
    playBlenderEffect(callback) {
        const btn = document.querySelector('.blend-btn');
        const sound = document.getElementById('blenderSound');
        
        // Animation
        gsap.to(btn, {
            keyframes: [
                { scale: 0.95, duration: 0.1 },
                { rotate: "+=5deg", duration: 0.05 },
                { rotate: "-=10deg", duration: 0.05 },
                { rotate: "+=5deg", duration: 0.05 }
            ],
            onComplete: () => {
                btn.style.transform = '';
                if (callback) callback();
            }
        });

        // Son
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Son bloqué :", e));
        
        // Vibration
        if ('vibrate' in navigator) navigator.vibrate([30, 40, 30]);
    },

    // Affichage confirmation
    showConfirmation() {
        const confirmation = document.getElementById('orderConfirmation');
        document.getElementById('confirmation-total').textContent = this.totalPrice.toLocaleString();
        document.getElementById('order-number').textContent = `#FM${new Date().getFullYear()}-${(++this.orderNumber).toString().padStart(3, '0')}`;
        
        confirmation.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        gsap.from(confirmation, { opacity: 0, duration: 0.3 });
    },

    // Rendu des éléments
    initSwiper() {
        new Swiper('.swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    },

    renderSmoothies() {
        const container = document.getElementById('smoothies-container');
        container.innerHTML = this.config.smoothies.map(smoothie => `
            <div class="swiper-slide">
                <div class="smoothie-card" style="--card-color: ${smoothie.color}">
                    <div class="smoothie-emoji">${smoothie.emoji}</div>
                    <h3>${smoothie.name}</h3>
                    <ul class="smoothie-ingredients">
                        ${smoothie.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                    <div class="smoothie-badges">
                        ${smoothie.badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
                    </div>
                    <div class="smoothie-price">
                        <span class="original-price">${smoothie.price} CFA</span>
                        <span class="discounted-price">${smoothie.discount} CFA</span>
                    </div>
                    <button class="order-btn" onclick="FRESHMOOD.handleQuickOrder(${smoothie.discount}, '${smoothie.name}')">
                        Commander maintenant
                    </button>
                </div>
            </div>
        `).join('');
    },

    renderIngredients() {
        // Fruits
        const fruitsContainer = document.querySelector('#fruits .ingredient-grid');
        fruitsContainer.innerHTML = this.config.fruits.map(fruit => `
            <div class="ingredient-card" data-price="${fruit.price}" data-category="fruit">
                <i class="fas ${fruit.icon}"></i>
                <span>${fruit.name}</span>
                <span class="price">+${fruit.price} CFA</span>
            </div>
        `).join('');

        // Boosters
        const boostersContainer = document.querySelector('#boosters .ingredient-grid');
        boostersContainer.innerHTML = this.config.boosters.map(booster => `
            <div class="ingredient-card" data-price="${booster.price}" data-category="booster">
                <i class="fas ${booster.icon}"></i>
                <span>${booster.name}</span>
                <span class="price">+${booster.price} CFA</span>
            </div>
        `).join('');
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => FRESHMOOD.init());