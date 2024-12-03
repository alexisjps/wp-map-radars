<?php
/**
 * Plugin Name: WP Map Radars
 * Description: Plugin pour afficher des radars sur une carte Mapbox avec une barre de recherche.
 * Version: 1.4
 * Author: Alexis Stephan
 */

if (!defined('ABSPATH')) {
    exit; // Sécurité
}

// Enqueue des scripts et styles
function wp_map_radars_enqueue_scripts() {
    wp_enqueue_script('mapbox-gl', 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js', [], '2.15.0', true);
    wp_enqueue_style('mapbox-gl-css', 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css', [], '2.15.0');
    wp_enqueue_script('wp-map-radars', plugins_url('js/map.js', __FILE__), ['mapbox-gl', 'jquery'], '1.4', true);
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
        <div id="search-container" style="margin-bottom: 20px;">
            <input id="search-bar" type="text" placeholder="Recherchez une ville..." style="width: 100%; padding: 10px; font-size: 16px;" />
        </div>
        <div id="map" style="width: 100%; height: 500px;"></div>
    ';
}
add_shortcode('wp_map_radars', 'wp_map_radars_shortcode');