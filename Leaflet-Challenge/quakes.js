// Create function to adjust size of dot according to quake magnitude.
function dotSize(magnitude) {
  return magnitude*5;
};

// Create function to adjust color of dot according to quake depth.
// Color palette generated by: https://hihayk.github.io/scale/#10/10/50/50/-51/74/20/25/FF9C00/255/151/0/white.
function dotColor(depth) {
  if (depth >= 100) {
    color = "#FF80D2";
  }
  else if (depth >= 95 && depth < 100) {
    color = "#FF73B9";
  }
  else if (depth >= 90 && depth < 95) {
    color = "#FF669C";
  }
  else if (depth >= 85 && depth < 90) {
    color = "#FF597D";
  }
  else if (depth >= 80 && depth < 85) {
    color = "#FF4D5B";
  }
  else if (depth >= 75 && depth < 80) {
    color = "#FF4040";
  }
  else if (depth >= 70 && depth < 75) {
    color = "#FF4533";
  }
  else if (depth >= 65 && depth < 70) {
    color = "#FF5726";
  }
  else if (depth >= 60 && depth < 65) {
    color = "#FF6C1A";
  }
  else if (depth >= 55 && depth < 60) {
    color = "#FF830D";
  }
  else if (depth >= 50 && depth < 55) {
    color = "#FF9C00";
  }
  else if (depth >= 45 && depth < 50) {
    color = "#F2AA00";
  }
  else if (depth >= 40 && depth < 45) {
    color = "#E6B700";
  }
  else if (depth >= 35 && depth < 40) {
    color = "#D9C200";
  }
  else if (depth >= 30 && depth < 35) {
    color = "#CCCB00";
  }
  else if (depth >= 25 && depth < 30) {
    color = "#BFBF00";
  }
  else if (depth >= 20 && depth < 25) {
    color = "#A7B300";
  }
  else if (depth >= 15 && depth < 20) {
    color = "#8CA600";
  }
  else if (depth >= 10 && depth < 15) {
    color = "#739900";
  }
  else if (depth >= 5 && depth < 10) {
    color = "#5B8C00";
  }
  else if (depth >= 0 && depth < 5) {
    color = "#468000";
  };
  return color;
};

// Store API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(data => {

  // Upon response, send the data.features object to the createFeatures function.
  createFeatures(data.features);

function createFeatures(quakeData) {

  // Define function to run for each feature in the features array.
  // Create a popup for each feature describing data.
  function onEachFeature(feature, layer) {
    layer.bindPopup("Location: " + feature.properties.place + "<br>Time: " + feature.properties.time + "<br> Magnitude: " + feature.properties.mag + "<br> Depth (km): " + feature.geometry.coordinates[2]);
  }

  // Create a GeoJSON layer containing the features array on the quakeData.
  // Run onEachFeature once for each return on quake data.
  var quakes = L.geoJSON(quakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        opacity: 1,
        fillOpacity: 0.5,
        fillColor: dotColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: dotSize(feature.properties.mag),
        stroke: true,
        weight: 0.3
      })
    }
  });

  // Send quakes layer to createMap function.
  createMap(quakes);
}

function createMap(quakes) {

  // Create base layer.
  var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create baseMaps object.
  var baseMaps = {
    "Street Map": streetMap,
    "Topographic Map": topoMap
  };

  // Create overlay object.
  var overlayMap = {
    quakes: quakes
  };

  // Create map to load with streetmap and earthquakes layer, centered on geographic center of United States.
  var loadMap = L.map("map", {
    center: [
      44.58, -103.46
    ],
    zoom: 5,
    layers: [streetMap, quakes]
  });

  // Create a layer control and connect to the base and overlay maps.
  L.control.layers(baseMaps, overlayMap).addTo(loadMap);

  // Create map legend.
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
      depth = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    var colors = ["#357210","#538716","#769B1C","#9DAE23","#C0B82B","#D1AE34","#D89346","#DF7E58","#E56F6A","#EB7E95","#F092BD"]
    var labels = [];
    
    // Define minimum and maximum values.
    var legendLimits = "<h2 style='text-align: center'>Earthquakes in the Past Month</h2><h3 style='text-align: center'>Recorded Depth (km)</h3>" +
      "<div class=\"labels\">" +
      "<div class=\"min\">" + depth[0] + "</div>" +
      "<div class=\"max\">" + depth[depth.length - 1] + "</div>" +
      "</div>";

      div.innerHTML = legendLimits;

      depth.forEach(function(depth, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };

  // Add legend to map.
  legend.addTo(loadMap);
}});