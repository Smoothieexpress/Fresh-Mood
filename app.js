// Configuration des données
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

document.addEventListener("DOMContentLoaded", () => {
  const ingredientCards = document.querySelectorAll(".ingredient-card");
  const totalPriceEl = document.getElementById("total-price");
  const validationMsg = document.querySelector(".validation-msg");
  const orderBtn = document.getElementById("order-btn");
  const form = document.getElementById("order-form");

  let selectedIngredients = [];

  // Prix par ingrédient
  const pricePerIngredient = 250;

  // Gérer sélection des ingrédients
  ingredientCards.forEach(card => {
    card.addEventListener("click", () => {
      const ingredient = card.dataset.name;

      if (selectedIngredients.includes(ingredient)) {
        selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
        card.classList.remove("selected");
      } else {
        selectedIngredients.push(ingredient);
        card.classList.add("selected");
      }

      updatePrice();
      toggleValidation();
    });
  });

  // Mettre à jour le prix
  function updatePrice() {
    const total = selectedIngredients.length * pricePerIngredient;
    totalPriceEl.textContent = total + " FCFA";
  }

  // Afficher ou cacher le message de validation
  function toggleValidation() {
    if (selectedIngredients.length < 4) {
      validationMsg.style.display = "block";
    } else {
      validationMsg.style.display = "none";
    }
  }

  // Gérer le formulaire de commande
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (selectedIngredients.length < 4) {
      validationMsg.style.display = "block";
      return;
    }

    const nom = document.getElementById("name").value.trim();
    const telephone = document.getElementById("phone").value.trim();
    const paiement = document.querySelector("input[name='paiement']:checked");

    if (!nom || !telephone || !paiement) {
      alert("Veuillez remplir tous les champs et sélectionner un mode de paiement.");
      return;
    }

    // Simulation envoi de commande
    alert(`Commande envoyée !
Nom : ${nom}
Téléphone : ${telephone}
Ingrédients : ${selectedIngredients.join(", ")}
Paiement : ${paiement.value}
Montant total : ${selectedIngredients.length * pricePerIngredient} FCFA`);

    form.reset();
    selectedIngredients = [];
    ingredientCards.forEach(card => card.classList.remove("selected"));
    updatePrice();
    toggleValidation();
  });

  // Auto-scroll horizontal spécialités
  const specialitesContainer = document.querySelector(".specialites-container");
  if (specialitesContainer) {
    setInterval(() => {
      specialitesContainer.scrollLeft += 2;
      if (specialitesContainer.scrollLeft + specialitesContainer.clientWidth >= specialitesContainer.scrollWidth) {
        specialitesContainer.scrollLeft = 0;
      }
    }, 50);
  }

  // SwiperJS (si utilisé pour slider)
  if (typeof Swiper !== "undefined") {
    new Swiper(".swiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false
      },
      breakpoints: {
        768: {
          slidesPerView: 2
        },
        1024: {
          slidesPerView: 3
        }
      }
    });
  }
});