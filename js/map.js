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
                  let iconUrl = '';
                  if (type.trim() === 'Radar Fixe') {
                      iconUrl = `${wpMapRadars.pluginUrl}/img/fix.png`;
                  } else if (type.trim() === 'Feu Rouge') {
                      iconUrl = `${wpMapRadars.pluginUrl}/img/feux_rouges.png`;
                  }

                  // Ajouter un marker personnalisé si l'URL de l'icône est définie
                  if (iconUrl) {
                      const el = document.createElement('div');
                      el.className = 'custom-marker';
                      el.style.backgroundImage = `url(${iconUrl})`;
                      el.style.width = '30px';
                      el.style.height = '30px';
                      el.style.backgroundSize = 'cover';

                      new mapboxgl.Marker(el)
                          .setLngLat([parseFloat(longitude), parseFloat(latitude)])
                          .addTo(map);
                  }
              }
          });
      })
      .catch(error => console.error('Erreur lors du chargement du CSV :', error));
});