<?php
/**
 * Plugin Name: WP Map Radars
 * Description: Plugin pour afficher des radars sur une carte Mapbox avec une barre de recherche et autocomplétion.
 * Version: 1.5
 * Author: Alexis Stephan
 */

if (!defined('ABSPATH')) {
    exit; // Sécurité
}

// Enqueue des scripts et styles
function wp_map_radars_enqueue_scripts() {
    wp_enqueue_script('mapbox-gl', 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js', [], '2.15.0', true);
    wp_enqueue_script('mapbox-geocoder', 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js', ['mapbox-gl'], '5.0.0', true);
    wp_enqueue_style('mapbox-gl-css', 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css', [], '2.15.0');
    wp_enqueue_style('mapbox-geocoder-css', 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css', [], '5.0.0');
    wp_enqueue_script('wp-map-radars', plugins_url('js/map.js', __FILE__), ['mapbox-gl', 'mapbox-geocoder'], '1.5', true);
    wp_enqueue_style('wp-map-radars-css', plugins_url('css/style.css', __FILE__));

    // Passer l'URL du fichier CSV et la clé API Mapbox au script JS
    wp_localize_script('wp-map-radars', 'wpMapRadars', [
        'csvUrl' => plugins_url('data/radars.csv', __FILE__),
        'pluginUrl' => plugins_url('', __FILE__), // URL de base du plugin
        'mapboxToken' => 'pk.eyJ1IjoiYm9vYnljb2RpZXBpZSIsImEiOiJjbTQyeDRocWUwNjlyMmpxdzdzbnMyNjNxIn0.xdQ6EpdA01-JVikCrMEh-w',
        'mapboxStyle' => 'mapbox://styles/mapbox/streets-v10',
    ]);
}
add_action('wp_enqueue_scripts', 'wp_map_radars_enqueue_scripts');

// Shortcode pour afficher la map et la barre de recherche
function wp_map_radars_shortcode() {
    return '
        <div id="search-container" style="display: flex; align-items: center; margin-bottom: 20px;">
            <input id="search-bar" type="text" placeholder="Recherchez une ville..." style="flex: 1; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px 0 0 5px;" />
            <button id="search-button" style="padding: 10px 20px; font-size: 16px; border: 1px solid #ccc; border-left: none; background-color: #007BFF; color: white; border-radius: 0 5px 5px 0; cursor: pointer;">
                Rechercher
            </button>
        </div>
        <div id="map" style="width: 100%; height: 500px;"></div>
    ';
}
add_shortcode('wp_map_radars', 'wp_map_radars_shortcode');