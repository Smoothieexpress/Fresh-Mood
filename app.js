// Configuration des smoothies spéciaux
const specialSmoothies = [
    {
        name: "Boost Testostérone 💪",
        price: 2500,
        ingredients: ["Gingembre", "Maca", "Banane", "Lait d'amande"],
        badges: ["🔥 Énergie", "💪 Performance"]
    },
    {
        name: "Passion Night ❤️",
        price: 3000,
        ingredients: ["Fraise", "Chocolat", "Miel", "Ginseng"],
        badges: ["❤️ Aphrodisiaque", "✨ Romance"]
    }
];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initSwiper();
    setupIngredients();
    setupOrderForm();
});

// Carrousel des smoothies spéciaux
function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    const container = document.querySelector('.swiper-wrapper');
    container.innerHTML = specialSmoothies.map(smoothie => `
        <div class="swiper-slide">
            <div class="smoothie-card">
                <h3>${smoothie.name}</h3>
                <p>${smoothie.ingredients.join(', ')}</p>
                <div class="price">${smoothie.price} CFA</div>
                <button class="order-btn" 
                        data-price="${smoothie.price}"
                        onclick="handleQuickOrder(${smoothie.price}, '${smoothie.name}')">
                    Commander maintenant 🚀
                </button>
            </div>
        </div>
    `).join('');
}

// Gestion des ingrédients
function setupIngredients() {
    let total = 0;
    const validationMsg = document.getElementById('validationMsg');

    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
            const selected = document.querySelectorAll('.selected');
            
            total = Array.from(selected).reduce((sum, ing) => 
                sum + parseInt(ing.dataset.price), 0);
            
            validationMsg.style.display = selected.length < 4 ? 'block' : 'none';
        });
    });
}

// Commande rapide
function handleQuickOrder(price, name) {
    if(confirm(`Confirmez la commande du "${name}" pour ${price} CFA ?`)) {
        alert(`✅ Commande validée ! Préparation en cours...`);
    }
}

// Formulaire de commande
function setupOrderForm() {
    document.getElementById('orderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const selected = document.querySelectorAll('.selected');
        if(selected.length < 4) {
            alert("❌ Sélectionnez au moins 4 ingrédients !");
            return;
        }

        const total = Array.from(selected).reduce((sum, ing) => 
            sum + parseInt(ing.dataset.price), 0);
        
        alert(`✅ Merci ! Votre commande de ${total} CFA est en préparation.`);
        document.getElementById('orderForm').reset();
        selected.forEach(ing => ing.classList.remove('selected'));
    });
}