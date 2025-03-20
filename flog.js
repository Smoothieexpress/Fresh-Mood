// Exemple de fonctionnalité JavaScript pour votre blog
document.addEventListener('DOMContentLoaded', function () {
    console.log('Le blog est prêt !');

    // Exemple : Ajouter un effet au survol des articles
    const articles = document.querySelectorAll('article');
    articles.forEach(article => {
        article.addEventListener('mouseenter', () => {
            article.style.transform = 'scale(1.02)';
            article.style.transition = 'transform 0.3s ease';
        });

        article.addEventListener('mouseleave', () => {
            article.style.transform = 'scale(1)';
        });
    });

    // Exemple : Afficher un message quand un article est cliqué
    articles.forEach(article => {
        article.addEventListener('click', () => {
            alert('Vous allez être redirigé vers l\'article complet.');
        });
    });
});