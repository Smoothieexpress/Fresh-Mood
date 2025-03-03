document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const form = document.getElementById('orderForm');
    let selectedItems = [];
    const basePrice = 15;

    // Sélection des ingrédients
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('selected');
            const ingredient = item.textContent.trim();
            
            if(selectedItems.includes(ingredient)) {
                selectedItems = selectedItems.filter(i => i !== ingredient);
            } else {
                selectedItems.push(ingredient);
            }
            
            updatePrice();
        });
    });

    // Calcul du prix
    function updatePrice() {
        const totalPrice = basePrice + (selectedItems.length * 2);
        document.getElementById('priceDisplay').textContent = 
            `Total: ${totalPrice} € (Base: ${basePrice}€ + ${selectedItems.length} suppléments)`;
    }

    // Gestion du formulaire
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;

        if(name && phone && selectedItems.length > 0) {
            const orderDetails = {
                name,
                phone,
                ingredients: selectedItems,
                price: basePrice + (selectedItems.length * 2)
            };

            console.log('Commande:', orderDetails);
            alert(`Merci ${name} ! Votre smoothie avec ${selectedItems.join(', ')} est en préparation. Total: ${orderDetails.price}€`);
            form.reset();
            selectedItems = [];
            menuItems.forEach(item => item.classList.remove('selected'));
            updatePrice();
        } else {
            alert('Veuillez remplir tous les champs et sélectionner au moins un ingrédient !');
        }
    });
});
