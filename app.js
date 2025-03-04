// Initialisation du carrousel
const swiper = new Swiper('.swiper', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 3,
        }
    }
});

// Filtrage des smoothies
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        document.querySelectorAll('.swiper-slide').forEach(slide => {
            slide.style.display = (filter === 'all' || slide.dataset.category === filter) 
                ? 'block' 
                : 'none';
        });
    });
});

// Personnalisation
let total = 0;
document.querySelectorAll('.ingredient').forEach(ingredient => {
    ingredient.addEventListener('click', () => {
        ingredient.classList.toggle('selected');
        const price = parseInt(ingredient.dataset.price);
        total = ingredient.classList.contains('selected') 
            ? total + price 
            : total - price;
        
        document.getElementById('customTotal').textContent = total;
    });
});

function scrollToSmoothies() {
    document.getElementById('smoothies').scrollIntoView({
        behavior: 'smooth'
    });
}