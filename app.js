// Configuration des données premium
const specialSmoothies = [
{
name: "Boost Testosterone",
price: 2500,
ingredients: ["Gingembre", "Maca", "Banane", "Lait d'amande"],
badges: [" Énergie", " Performance"],
emoji: " ",
color: "#FF9F40"
},
{
name: "Passion Night",
price: 3000,
ingredients: ["Fraise", "Chocolat", "Miel", "Ginseng"],
badges: [" Aphrodisiaque", " Romance"],
emoji: " ",
color: "#FF69B4"
},
{
name: "Detox Morning",
price: 2200,
ingredients: ["Ananas", "Céleri", "Gingembre", "Citron"],
badges: [" Détox", " Matinal"],
emoji: " ",
color: "#38B2AC"
}
];
// Variables globales
let totalPrice = 0;
const selectedIngredients = new Set();
let orderNumber = 1000;
// Initialisation
document.addEventListener('DOMContentLoaded', () => {
initSwiper();
setupIngredients();
setupOrderForm();
setupBannerClose();
setupConfirmationClose();
setupNavigation();
});
// Carrousel premium avec défilement automatique
function initSwiper() {
const swiper = new Swiper('.swiper', {
slidesPerView: 1,
spaceBetween: 30,
loop: true,
centeredSlides: true,
autoplay: {
delay: 3000,
disableOnInteraction: false,
},
pagination: {
el: '.swiper-pagination',
clickable: true,
},
breakpoints: {
768: {
slidesPerView: 2,
centeredSlides: false,
},
1024: {
slidesPerView: 3,
centeredSlides: true,
}
}
});
renderSmoothies();
}
// Rendu des smoothies spéciaux
function renderSmoothies() {
const container = document.getElementById('smoothies-container');
container.innerHTML = specialSmoothies.map(smoothie => `
<div class="swiper-slide">
<div class="smoothie-card" style="--card-color: ${smoothie.color}">
<div class="smoothie-emoji">${smoothie.emoji}</div>
<h3>${smoothie.name}</h3>
<ul class="smoothie-ingredients">
${smoothie.ingredients.map(ing => `<li>${ing}</li>`).join('')}
</ul>
<div class="smoothie-badges">
${smoothie.badges.map(badge => `<span class="badge">${badge}</
span>`).join('')}
</div>
<div class="smoothie-price">${smoothie.price.toLocaleString()} CFA</div>
<button class="order-btn" onclick="handleQuickOrder(${smoothie.price}, '$
{smoothie.name}')">
Commander maintenant <i class="fas fa-arrow-right"></i>
</button>
</div>
</div>
`).join('');
}
// Gestion des ingrédients premium
function setupIngredients() {
const ingredientCards = document.querySelectorAll('.ingredient-card');
ingredientCards.forEach(card => {
card.addEventListener('click', () => {
// Animation de clic
card.style.transform = 'scale(0.95)';
setTimeout(() => {
}, 150);
card.style.transform = card.classList.contains('selected') ? 'scale(1)' : 'scale(1.05)';
const price = parseInt(card.dataset.price);
// Gestion de la sélection
if (card.classList.toggle('selected')) {
selectedIngredients.add(card);
totalPrice += price;
// Ajout du badge visuel
const badge = document.createElement('span');
badge.className = 'selected-badge';
badge.innerHTML = '<i class="fas fa-check"></i>';
card.appendChild(badge);
} else {
selectedIngredients.delete(card);
totalPrice -= price;
// Suppression du badge
const badge = card.querySelector('.selected-badge');
if (badge) badge.remove();
}
updatePriceDisplay();
checkValidation();
});
});
}
// Mise à jour de l'affichage du prix
function updatePriceDisplay() {
const totalElement = document.getElementById('total-price');
const countElement = document.getElementById('selected-count');
totalElement.textContent = totalPrice.toLocaleString();
countElement.textContent = selectedIngredients.size;
// Animation
totalElement.classList.add('price-update');
setTimeout(() => {
totalElement.classList.remove('price-update');
}, 500);
}
// Validation de la sélection
function checkValidation() {
const validationMsg = document.getElementById('validationMsg');
if (selectedIngredients.size < 4) {
validationMsg.style.display = 'flex';
} else {
validationMsg.style.display = 'none';
}
}
// Commande rapide
function handleQuickOrder(price, name) {
if (confirm(`Confirmez la commande du "${name}" pour ${price.toLocaleString()} CFA ?`))
{
showOrderConfirmation(price, name);
}
}
// Formulaire de commande premium avec validation du téléphone Bénin
function setupOrderForm() {
// Gestion du changement d'opérateur
document.querySelectorAll('.momo-provider').forEach(btn => {
btn.addEventListener('click', function() {
document.querySelectorAll('.momo-provider').forEach(b =>
b.classList.remove('active'));
this.classList.add('active');
});
});
// Formatage automatique du téléphone
const phoneInput = document.getElementById('momo-phone');
phoneInput.addEventListener('input', function(e) {
let value = this.value.replace(/\D/g, '');
if (value.length > 8) value = value.substring(0, 8);
let formatted = '';
for (let i = 0; i < value.length; i++) {
if (i === 2 || i === 4 || i === 6) formatted += ' ';
formatted += value[i];
}
this.value = formatted.trim();
});
// Soumission du formulaire
document.getElementById('orderForm').addEventListener('submit', async function(e) {
e.preventDefault();
// Validation des ingrédients
if (selectedIngredients.size < 4) {
showAlert('error', 'Sélectionnez au moins 4 ingrédients');
return;
}
// Validation du téléphone
const phone = phoneInput.value.replace(/\D/g, '');
if (phone.length !== 8) {
showAlert('error', 'Numéro de téléphone invalide. Format: 96 12 34 56');
return;
}
// Afficher le loader
const submitBtn = document.querySelector('.cta-btn');
submitBtn.disabled = true;
submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
try {
// Simulation de paiement (à remplacer par l'API réelle)
await new Promise(resolve => setTimeout(resolve, 2000));
// 80% de chance de succès pour la démo
if (Math.random() > 0.2) {
showOrderConfirmation(totalPrice, 'Votre commande');
resetForm();
} else {
throw new Error("Paiement échoué : Solde insuffisant");
}
} catch (error) {
showAlert('error', error.message);
} finally {
submitBtn.disabled = false;
submitBtn.innerHTML = '<span class="btn-text">VALIDER MA COMMANDE</
span><span class="btn-icon"><i class="fas fa-arrow-right"></i></span>';
}
});
}
// Affichage de la confirmation de commande
function showOrderConfirmation(price, name) {
const confirmation = document.getElementById('orderConfirmation');
const totalElement = document.getElementById('confirmation-total');
const orderNumberElement = document.getElementById('order-number');
// Génération d'un numéro de commande
orderNumber++;
const formattedOrderNumber = `#FM2024-${orderNumber.toString().padStart(3, '0')}`;
// Mise à jour des données
totalElement.textContent = price.toLocaleString();
orderNumberElement.textContent = formattedOrderNumber;
// Affichage
confirmation.classList.add('active');
document.body.style.overflow = 'hidden';
// Animation GSAP
gsap.from('.confirmation-content', {
y: 50,
opacity: 0,
duration: 0.5,
ease: 'back.out'
});
}
// Fermeture de la confirmation
function setupConfirmationClose() {
const closeBtn = document.querySelector('.close-confirmation');
const confirmation = document.getElementById('orderConfirmation');
closeBtn.addEventListener('click', () => {
confirmation.classList.remove('active');
document.body.style.overflow = 'auto';
resetForm();
});
}
// Réinitialisation du formulaire
function resetForm() {
document.getElementById('orderForm').reset();
// Désélection des ingrédients
selectedIngredients.forEach(card => {
card.classList.remove('selected');
const badge = card.querySelector('.selected-badge');
if (badge) badge.remove();
});
selectedIngredients.clear();
totalPrice = 0;
updatePriceDisplay();
checkValidation();
}
// Fermeture de la bannière promo
function setupBannerClose() {
const closeBtn = document.querySelector('.close-banner');
const banner = document.querySelector('.promo-banner');
if (closeBtn && banner) {
closeBtn.addEventListener('click', () => {
banner.style.transform = 'translateY(-100%)';
banner.style.opacity = '0';
setTimeout(() => {
banner.remove();
}, 500);
});
}
}
// Navigation fluide vers les sections
function setupNavigation() {
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function(e) {
e.preventDefault();
const targetId = this.getAttribute('href');
const targetElement = document.querySelector(targetId);
if (targetElement) {
window.scrollTo({
top: targetElement.offsetTop - 100,
behavior: 'smooth'
});
// Fermer le sous-menu si ouvert
if (this.parentElement.querySelector('.submenu')) {
this.parentElement.querySelector('.submenu').style.opacity = '0';
this.parentElement.querySelector('.submenu').style.visibility = 'hidden';
}
}
});
});
}
// Affichage des alertes
function showAlert(type, message) {
const alert = document.createElement('div');
alert.className = `alert alert-${type}`;
alert.innerHTML = `
<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
${message}
`;
document.body.appendChild(alert);
// Positionnement fixed pour être visible pendant le scroll
alert.style.position = 'fixed';
alert.style.top = '20px';
alert.style.left = '50%';
alert.style.transform = 'translateX(-50%)';
alert.style.zIndex = '2000';
// Animation d'apparition
gsap.from(alert, {
y: -50,
opacity: 0,
duration: 0.3
});
// Disparition après 3s
setTimeout(() => {
gsap.to(alert, {
y: -100,
opacity: 0,
duration: 0.3,
onComplete: () => alert.remove()
});
}, 3000);
}
data/smoothies-db.json
{
"categories": [
"Beauté & Peau",
"Énergie & Vitalité",
"Détox & Digestion",
"Immunité & Défenses naturelles",
"Relaxation & Bien-être mental",
"Fraîcheur & Hydratation"
],
"smoothies": [
{
"id": 1,
"name": "Éclat de teint",
"category": "Beauté & Peau",
"ingredients": ["Banane", "Ananas", "Carotte", "Gingembre", "Citron"],
"effects": "Teint frais, vitamines A et C, antioxydants",
"price": 2500,
"badges": ["Beauté", "Peau"],
"color": "#FF9F40",
"featured": true,
"image": "img/eclat-teint.jpg"
},
{
"id": 2,
"name": "Boost de testostérone",
"category": "Énergie & Vitalité",
"ingredients": ["Datte", "Arachide", "Gingembre", "Lait de soja", "Citron"],
"effects": "Force masculine, endurance, boost hormonal",
"price": 3000,
"badges": ["Énergie", "Vitalité"],
"color": "#7B2CBF",
"featured": true,
"image": "img/boost-testo.jpg"
},
{
"id": 3,
"name": "Détox citronnée",
"category": "Détox & Digestion",
"ingredients": ["Citron", "Concombre", "Menthe", "Pomme verte"],
"effects": "Élimination des toxines, rafraîchissant",
"price": 2200,
"badges": ["Détox", "Digestion"],
"color": "#38B2AC",
"featured": true,
"image": "img/detox-citron.jpg"
}
],
"ingredients": {
"fruits": [
"Banane",
"Mangue",
"Ananas",
"Papaye",
"Pastèque",
"Melon",
"Pomme verte",
"Pomme rouge",
"Poire",
"Orange",
"Mandarine",
"Citron",
"Citron vert",
"Fraise",
"Framboise",
"Myrtille",
"Cassis",
"Groseille",
"Litchi",
"Raisin",
"Kiwi",
"Grenade",
"Goyave",
"Fruit de la passion",
"Figue",
"Datte",
"Pruneau",
"Baie de goji",
"Avocat",
"Noix de coco"
],
"légumes": [
"Carotte",
"Betterave",
"Concombre",
"Épinard",
"Céleri",
"Kale (chou frisé)",
"Courgette",
"Patate douce",
"Fenouil",
"Brocoli",
"Chou rouge",
"Poivron",
"Tomate"
],
"superaliments": [
"Spiruline",
"Graines de chia",
"Graines de lin",
"Açaï",
"Maca",
"Cacao cru",
"Protéines végétales (pois, riz, chanvre)",
"Collagène végétal",
"Guarana",
"Baobab",
"Moringa",
"Gelée royale",
"Pollen",
"Miel",
"Sirop d'érable",
"Ginseng",
"Gélules d'ortie (en poudre)",
"Ashwagandha"
],
"laits": [
"Lait d'amande",
"Lait de soja",
"Lait de riz",
"Lait d'avoine",
"Lait de coco",
"Lait de cajou",
"Lait de noisette",
"Lait de chanvre"
]
}
}
smoothies-loader.js
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
});
this.renderSearchResults(results);
}
}
// Initialisation
document.addEventListener('DOMContentLoaded', () => {
new SmoothieLoader();
});