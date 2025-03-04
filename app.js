// Configuration initiale
const smoothiesData = [
    {
        name: "Boost Tropical",
        price: 1500,
        category: "energy",
        ingredients: ["🍌 Banane", "🥭 Mangue", "🍍 Ananas"],
        badges: ["⚡ Énergie", "🧠 Concentration"]
    },
    {
        name: "Passion Night",
        price: 2000,
        category: "love",
        ingredients: ["🍓 Fraise", "🍫 Chocolat", "🌿 Maca"],
        badges: ["❤️ Aphrodisiaque", "🔥 Libido"]
    }
];

// Mettre à jour les données des ingrédients
const ingredientsData = [
    { name: "🍌 Banane", price: 300, benefit: "Énergie rapide" },
    { name: "🥭 Mangue", price: 500, benefit: "Riche en vitamine C" },
    { name: "🍍 Ananas", price: 400, benefit: "Aide à la digestion" },
    { name: "🍓 Fraise", price: 450, benefit: "Antioxydants" },
    { name: "🥑 Avocat", price: 600, benefit: "Acides gras sains" },
    { name: "🌿 Épinard", price: 350, benefit: "Fer et minéraux" },
    { name: "🫐 Myrtilles", price: 550, benefit: "Antioxydants puissants" },
    { name: "🍯 Miel", price: 300, benefit: "Énergie naturelle" }
];

// Initialisation
function init() {
    renderFilters();
    renderSmoothies();
    renderIngredients();
    initSwiper();
}

// Génération des filtres
function renderFilters() {
    const filters = [
        { id: "all", label: "Tous" },
        { id: "energy", label: "⚡ Énergie" },
        { id: "detox", label: "🌿 Détox" },
        { id: "love", label: "❤️ Aphrodisiaque" }
    ];

    const filtersContainer = document.getElementById("filters");
    filtersContainer.innerHTML = filters.map(filter => `
        <button class="filter-btn" 
                data-filter="${filter.id}"
                onclick="filterSmoothies('${filter.id}')">
            ${filter.label}
        </button>
    `).join("");
}

// Génération des smoothies
function renderSmoothies(filter = "all") {
    const container = document.getElementById("smoothies-container");
    container.innerHTML = smoothiesData
        .filter(smoothie => filter === "all" || smoothie.category === filter)
        .map(smoothie => `
            <div class="swiper-slide" data-category="${smoothie.category}">
                <div class="smoothie-card">
                    <div class="badges">${smoothie.badges.map(b => `<span class="badge">${b}</span>`).join("")}</div>
                    <h3>${smoothie.name}</h3>
                    <p>${smoothie.ingredients.join(", ")}</p>
                    <div class="price">${smoothie.price} CFA</div>
                    <button class="order-btn">Commander</button>
                </div>
            </div>
        `).join("");
}

// Génération des ingrédients
function renderIngredients() {
    const grid = document.getElementById("ingredients-grid");
    grid.innerHTML = ingredientsData.map(ingredient => `
        <div class="ingredient-card" 
             data-price="${ingredient.price}"
             onclick="toggleIngredient(this)">
            ${ingredient.name}
            <div class="tooltip">${ingredient.benefit}</div>
        </div>
    `).join("");
}

// Gestion des interactions
let total = 0;
function toggleIngredient(element) {
    element.classList.toggle("selected");
    const price = parseInt(element.dataset.price);
    total = element.classList.contains("selected") ? total + price : total - price;
    document.getElementById("total-price").textContent = total;
}

// Initialisation Swiper
function initSwiper() {
    new Swiper('.swiper', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        loop: true,
    });
}

// Démarrage
init();
function handleOrder(e) {
    e.preventDefault();
    
    const selectedIngredients = document.querySelectorAll('.ingredient-card.selected');
    if(selectedIngredients.length < 4) {
        alert("❌ Sélectionnez au moins 4 ingrédients !");
        return;
    }

    const orderData = {
        name: document.getElementById('clientName').value,
        phone: document.getElementById('clientPhone').value,
        ingredients: Array.from(selectedIngredients).map(ing => ing.textContent.trim()),
        total: total
    };

    alert(`✅ Merci ${orderData.name} ! Votre commande de ${orderData.total} CFA est en préparation.`);
    document.getElementById('orderForm').reset();
    
    // Réinitialiser la sélection
    selectedIngredients.forEach(ing => ing.classList.remove('selected'));
    total = 0;
    document.getElementById('total-price').textContent = total;
}