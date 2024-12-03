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
            rows.forEach((row, index) => {
                const columns = row.split(',');
                const type = columns[10]?.trim(); // Colonne "type" (index 10)
                const latitude = parseFloat(columns[3]); // Colonne "latitude" (index 3)
                const longitude = parseFloat(columns[4]); // Colonne "longitude" (index 4)

                console.log(`Ligne ${index + 1}: Type = ${type}, Latitude = ${latitude}, Longitude = ${longitude}`);

                if (!isNaN(latitude) && !isNaN(longitude)) {
                    // Définir une icône en fonction du type de radar
                    let iconUrl = '';
                    if (type === 'Radar fixe') {
                        iconUrl = `${wpMapRadars.pluginUrl}/img/fix.png`;
                    } else if (type === 'Radar feu rouge') {
                        iconUrl = `${wpMapRadars.pluginUrl}/img/feux_rouges.png`;
                    }

                    if (iconUrl) {
                        const el = document.createElement('div');
                        el.className = 'custom-marker';
                        el.style.backgroundImage = `url(${iconUrl})`;
                        el.style.width = '30px';
                        el.style.height = '30px';
                        el.style.backgroundSize = 'cover';

                        new mapboxgl.Marker(el)
                            .setLngLat([longitude, latitude])
                            .addTo(map);
                    }
                } else {
                    console.error(`Coordonnées invalides à la ligne ${index + 1}`);
                }
            });
        })
        .catch(error => console.error('Erreur lors du chargement du CSV :', error));
});