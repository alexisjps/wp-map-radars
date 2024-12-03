document.addEventListener('DOMContentLoaded', () => {
  mapboxgl.accessToken = wpMapRadars.mapboxToken;

  // Initialisation de la carte
  const map = new mapboxgl.Map({
      container: 'map',
      style: wpMapRadars.mapboxStyle,
      center: [2.3488, 48.8534], // Coordonnées par défaut (Paris)
      zoom: 12,
  });

  // Charger les données du CSV
  fetch(wpMapRadars.csvUrl)
      .then(response => response.text())
      .then(csvText => {
          const rows = csvText.split('\n').slice(1); // Ignorer l'en-tête
          rows.forEach(row => {
              const [type, latitude, longitude] = row.split(',');
              if (latitude && longitude) {
                  // Définir une icône en fonction du type de radar
                  const icon = type === 'Radar Fixe' ? 'marker-red' :
                               type === 'Feu Rouge' ? 'marker-green' : 'marker-blue';

                  // Ajouter un marker sur la map
                  new mapboxgl.Marker({ color: icon })
                      .setLngLat([parseFloat(longitude), parseFloat(latitude)])
                      .addTo(map);
              }
          });
      })
      .catch(error => console.error('Erreur lors du chargement du CSV :', error));
});