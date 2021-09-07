
// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

d3.json(queryUrl).then(function(data){
    // Once we get a response, send the data.features object to the createFeatures function.
    createfeatures(data.features);
});

var geojasonMarkerOptions = {
  stroke: false,
  fillOpacity: 0.75,
  color: "black",
  fillColor: getColor(feature.properties.mag),
  radius: feature.properties.mag*50000

}
function createfeatures(earthquakeData) {
    
// Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h2>" + feature.properties.title +
      "</h2><hr><h3>Time:" + new Date(feature.properties.time) +"</a></h3><h3>"+`Mag: ${feature.properties.mag}`+"</h3><h3>"+`Type: ${feature.properties.type}`+"</h3><h4>"+`Rms: ${feature.properties.rms}`+"</h4>");
      
     }
 // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.

  var earthquakes = L.geoJSON(earthquakeData, {
   
    onEachFeature: onEachFeature,
   
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, geojasonMarkerOptions);
        
  }
});

  // Send our earthquakes layer to the createMap function/
createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var map = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 2,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

 


}


