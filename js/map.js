document.addEventListener('DOMContentLoaded', () => {
    mapboxgl.accessToken = wpMapRadars.mapboxToken;

    // Initialisation de la carte
    const map = new mapboxgl.Map({
        container: 'map',
        style: wpMapRadars.mapboxStyle,
        center: [2.3488, 48.8534], // Coordonnées par défaut (Paris)
        zoom: 12,
    });

    const bounds = new mapboxgl.LngLatBounds();

    // Charger les données du CSV
    fetch(wpMapRadars.csvUrl)
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split('\n').slice(1); // Ignorer l'en-tête
            rows.forEach((row) => {
                const columns = row.split(',');
                const latitude = parseFloat(columns[3]); // Colonne "latitude"
                const longitude = parseFloat(columns[4]); // Colonne "longitude"

                // Vérifier que les coordonnées sont valides
                if (!isNaN(latitude) && !isNaN(longitude)) {
                    // Ajouter un marker par défaut de Mapbox
                    new mapboxgl.Marker()
                        .setLngLat([longitude, latitude])
                        .addTo(map);

                    bounds.extend([longitude, latitude]); // Étend les limites de la carte
                }
            });

            // Ajuster la carte pour contenir tous les markers
            if (bounds.isEmpty()) {
                map.setCenter([2.3488, 48.8534]); // Paris par défaut si aucun marker
            } else {
                map.fitBounds(bounds, { padding: 50 });
            }
        })
        .catch(error => console.error('Erreur lors du chargement du CSV :', error));

    // Ajouter le widget d'auto-complete Mapbox Geocoder
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        placeholder: 'Recherchez une ville...', // Texte de l'auto-complete
        mapboxgl: mapboxgl,
    });

    // Intégrer le Geocoder à côté de la barre de recherche
    const searchContainer = document.getElementById('search-container');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');

    searchContainer.insertBefore(geocoder.onAdd(map), searchButton);

    // Gestionnaire du bouton "Rechercher"
    searchButton.addEventListener('click', () => {
        const query = searchBar.value;

        // Effectuer une recherche si le champ est rempli
        if (query.trim() !== '') {
            geocoder.query(query);
        } else {
            alert('Veuillez entrer une ville à rechercher.');
        }
    });
});