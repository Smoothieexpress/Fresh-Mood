document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.querySelector('input[type="text"]').value;
        const phone = document.querySelector('input[type="tel"]').value;

        if(name && phone) {
            alert(`Merci ${name} ! Votre commande est en préparation. Nous vous appellerons au ${phone}.`);
            form.reset();
        } else {
            alert('Veuillez remplir tous les champs requis !');
        }
    });
});