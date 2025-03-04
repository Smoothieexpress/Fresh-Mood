document.addEventListener('DOMContentLoaded', function() {
  const showSpecialSmoothiesBtn = document.getElementById('showSpecialSmoothies');
  const specialSmoothiesSection = document.getElementById('specialSmoothies');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Liste des smoothies
  const smoothies = [
    {
      name: "Smoothie Énergie Tropicale",
      image: "images/energie_tropicale.jpg",
      benefits: "Boost d'énergie naturelle.",
      category: "energie"
    },
    {
      name: "Smoothie Détox Vert",
      image: "images/detox_vert.jpg",
      benefits: "Détoxifiant et aide à la digestion.",
      category: "detox"
    },
    {
      name: "Smoothie Vitalité Masculine",
      image: "images/vitalite_masculine.jpg",
      benefits: "Favorise la production de testostérone.",
      category: "aphrodisiaque"
    },
    {
      name: "Smoothie Boost Immunitaire",
      image: "images/boost_immunitaire.jpg",
      benefits: "Renforce le système immunitaire.",
      category: "immunite"
    },
    // Ajoute d'autres smoothies ici...
  ];

  // Fonction pour afficher les smoothies spéciaux
  function displaySpecialSmoothies(smoothies) {
    specialSmoothiesSection.innerHTML = '';
    smoothies.forEach(smoothie => {
      const smoothieElement = document.createElement('div');
      smoothieElement.classList.add('smoothie-item');
      smoothieElement.innerHTML = `
        <img src="${smoothie.image}" alt="${smoothie.name}">
        <h3>${smoothie.name}</h3>
        <p>${smoothie.benefits}</p>
      `;
      specialSmoothiesSection.appendChild(smoothieElement);
    });
  }

  // Afficher les smoothies spéciaux au clic
  showSpecialSmoothiesBtn.addEventListener('click', () => {
    displaySpecialSmoothies(smoothies);
  });

  // Filtrer les smoothies par catégorie
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.dataset.filter;
      const filteredSmoothies = smoothies.filter(smoothie => smoothie.category === category);
      displaySpecialSmoothies(filteredSmoothies);
    });
  });
});