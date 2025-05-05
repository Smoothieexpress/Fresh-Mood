class SmoothieLoader {
  constructor() {
    this.data = null;
    this.init();
  }

  async init() {
    await this.loadData();
    this.injectCategories();
    this.renderFeaturedSmoothies();
    this.setupSearch();
  }

  async loadData() {
    try {
      const response = await fetch('data/smoothies-db.json');
      this.data = await response.json();
    } catch (error) {
      console.error("Erreur de chargement des données:", error);
    }
  }

  injectCategories() {
    const composeSubmenu = document.querySelector('.submenu');
    this.data.categories.forEach(category => {
      composeSubmenu.innerHTML += `
        <li><a href="#${category.replace(/\s+/g, '-').toLowerCase()}">${category}</a></li>
      `;
    });
  }

  renderFeaturedSmoothies() {
    const container = document.getElementById('smoothies-container');
    const featured = this.data.smoothies.filter(s => s.featured);
    
    container.innerHTML = featured.map(smoothie => `
      <div class="swiper-slide">
        <div class="smoothie-card" style="--card-color: ${smoothie.color}">
          <h3>${smoothie.name}</h3>
          <ul class="smoothie-ingredients">
            ${smoothie.ingredients.map(i => `<li>${i}</li>`).join('')}
          </ul>
          <div class="smoothie-price">${smoothie.price.toLocaleString()} CFA</div>
          <button class="order-btn" 
                  data-price="${smoothie.price}" 
                  data-name="${smoothie.name}">
            Commander
          </button>
        </div>
      </div>
    `).join('');
  }

  setupSearch() {
    // Implémentation de la recherche
    document.getElementById('search').addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const results = this.data.smoothies.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.ingredients.some(i => i.toLowerCase().includes(term))
      );
      this.renderSearchResults(results);
    });
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  new SmoothieLoader();
});