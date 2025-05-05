export async function loadSmoothieData() {
  try {
    const response = await fetch('../data/smoothies-db.json');
    const data = await response.json();
    window.smoothieData = data; // Rend les données globales
    console.log('Données chargées:', data); // Vérifiez dans la console
  } catch (error) {
    console.error("Erreur de chargement:", error);
  }
}