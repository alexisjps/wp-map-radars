document.addEventListener('DOMContentLoaded', () => {
    mapboxgl.accessToken = wpMapRadars.mapboxToken;

    // Initialisation de la carte
    const map = new mapboxgl.Map({
        container: 'map',
        style: wpMapRadars.mapboxStyle,
        center: [2.3488, 48.8534], // Coordonnées par défaut (Paris)
        zoom: 12,
    });

    // Tableau pour vérifier les doublons
    const addedCoordinates = new Set();

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
                    addedCoordinates.add(coordKey); // Marquer les coordonnées comme ajoutées

                    // Définir une icône en fonction du type de radar
                    let iconUrl = '';
                    if (type === 'Radar fixe') {
                        iconUrl = `${wpMapRadars.pluginUrl}/img/fix.png`;
                    }

                    if (iconUrl) {
                        // Marker personnalisé
                        const el = document.createElement('div');
                        el.className = 'custom-marker';
                        el.style.backgroundImage = `url(${iconUrl})`;
                        el.style.width = '30px';
                        el.style.height = '30px';
                        el.style.backgroundSize = 'cover';

                        new mapboxgl.Marker(el)
                            .setLngLat([longitude, latitude])
                            .addTo(map);
                    } else {
                        // Marker par défaut de Mapbox
                        new mapboxgl.Marker()
                            .setLngLat([longitude, latitude])
                            .addTo(map);
                    }
                } else if (addedCoordinates.has(coordKey)) {
                    console.warn(`Doublon détecté : Latitude = ${latitude}, Longitude = ${longitude}`);
                }
            });
        })
        .catch(error => console.error('Erreur lors du chargement du CSV :', error));
});