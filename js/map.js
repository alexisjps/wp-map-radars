document.addEventListener('DOMContentLoaded', () => {
    mapboxgl.accessToken = wpMapRadars.mapboxToken;

    // Initialisation de la carte
    const map = new mapboxgl.Map({
        container: 'map',
        style: wpMapRadars.mapboxStyle,
        center: [2.3488, 48.8534], // Coordonnées par défaut (Paris)
        zoom: 12,
    });

    const addedCoordinates = new Set();
    const bounds = new mapboxgl.LngLatBounds();
    const markers = []; // Stocke tous les markers pour les manipuler

    let filterTypes = ['Radar fixe', 'Radar feu rouge']; // Types de radars sélectionnés par défaut

    // Fonction pour ajouter un marker à la carte
    function addMarker(type, latitude, longitude, iconUrl) {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundImage = `url(${iconUrl})`;
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundSize = 'cover';

        const marker = new mapboxgl.Marker(el).setLngLat([longitude, latitude]);

        marker.type = type; // Associe le type au marker
        marker.addTo(map);
        markers.push(marker);

        bounds.extend([longitude, latitude]); // Étend les limites
    }

    // Fonction pour afficher/masquer les markers selon le type
    function filterMarkers() {
        markers.forEach(marker => {
            if (filterTypes.includes(marker.type)) {
                marker.getElement().style.display = 'block'; // Affiche le marker
            } else {
                marker.getElement().style.display = 'none'; // Cache le marker
            }
        });
    }

    // Charger les données du CSV
    fetch(wpMapRadars.csvUrl)
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split('\n').slice(1); // Ignorer l'en-tête
            rows.forEach((row, index) => {
                const columns = row.split(',');
                const type = columns[10]?.trim(); // Colonne "type"
                const latitude = parseFloat(columns[3]); // Colonne "latitude"
                const longitude = parseFloat(columns[4]); // Colonne "longitude"

                const coordKey = `${latitude},${longitude}`; // Clé unique pour les coordonnées

                if (!isNaN(latitude) && !isNaN(longitude) && !addedCoordinates.has(coordKey)) {
                    addedCoordinates.add(coordKey);

                    let iconUrl = '';
                    if (type === 'Radar fixe') {
                        iconUrl = `${wpMapRadars.pluginUrl}/img/fix.png`;
                    } else if (type === 'Radar feu rouge') {
                        iconUrl = `${wpMapRadars.pluginUrl}/img/feux_rouges.png`;
                    } else {
                        // Icône par défaut de Mapbox
                        iconUrl = 'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png';
                    }

                    addMarker(type, latitude, longitude, iconUrl);
                }
            });

            // Ajuster la carte pour contenir tous les markers
            if (addedCoordinates.size > 0) {
                map.fitBounds(bounds, { padding: 50 });
            }
        })
        .catch(error => console.error('Erreur lors du chargement du CSV :', error));

    // Gestionnaire pour les checkboxs
    document.querySelectorAll('#radar-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checkedBoxes = document.querySelectorAll('#radar-filters input[type="checkbox"]:checked');
            filterTypes = Array.from(checkedBoxes).map(cb => cb.value); // Mets à jour les types sélectionnés
            filterMarkers(); // Applique les filtres
        });
    });
});