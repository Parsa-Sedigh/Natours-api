/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken = 'pk.eyJ1IjoicGFyc2E3ODk5IiwiYSI6ImNsMGwyem5lejBzaDQzY3VvNjJlM3lvc3YifQ.BRL8v_0QsmWNkqgURHO_eg';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/parsa7899/cl0l3dqk3004z14ldck5vpupy',
    // center: [-118.113491, 34.111745],
    // zoom: 4,
    // interactive: false,
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker(for this, we need to create a new html element)
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    // add a popup on marker
    new mapboxgl
      .Popup({offset: 30})
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend the map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

// fitBounds() method moves and zooms the map right to the bounds, to fit our markers.
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    }
  });
};
