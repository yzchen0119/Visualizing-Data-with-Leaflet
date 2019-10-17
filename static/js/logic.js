// API link
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(url, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Create GeoJSON layer containing the features array on the earthquakeData object
function createFeatures(earthquakeData) {
  
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function(feature, layer) {
	  layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + 
	  "<br> Magnitude: " + feature.properties.mag + "</p>");
	},
	pointToLayer: function (feature, latlng) {
	  return new L.circle(latlng, {
		  fillOpacity: 1,
		  fillColor: markerColor(feature.properties.mag),
		  radius: markerSize(feature.properties.mag),
		  color: "#507567",
		  weight: .5,
		  stroke: true,
	  })
	}		  
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Define Map layers
  var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  
  // BaseMaps that users can select
  var baseMaps = {
    "Light Map": lightMap,
	"Satellite Map": satelliteMap
  };
  
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -115.71
    ],
    zoom: 4,
    layers: [lightMap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);
  
  // Create legend control
  var legend = L.control({position: "bottomright"});
  
  legend.onAdd = function () {
	var div = L.DomUtil.create("div", "info legend"),
	    magnitudes = [0, 1, 2, 3, 4, 5];
	for (var i = 0; i < magnitudes.length; i++) {
	  div.innerHTML +=
	    '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' +
		magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
	}
	return div;
	console.log(div);
  };
  legend.addTo(myMap);
}

function markerSize(mag) {
  return mag * 24000;
}

function markerColor(mag) {
  return mag > 5 ? '#cc3232' :
  mag > 4  ? '#db7b2b' :
  mag > 3  ? '#e7b416' :
  mag > 2  ? '#f5e642' :
  mag > 1  ? '#d4f542' :
             '#adfc74';
}
