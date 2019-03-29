//url of the geojson
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//define base layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});

var satmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var outmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

var myMap = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 2,
  layers: [streetmap, satmap, outmap, graymap]
});
graymap.addTo(myMap);

//create basemaps object
var baseMaps = {
    Streets : streetmap,
    Satellite : satmap,
    Outdoors: outmap,
    Grayscale: graymap
  }

//make the layer for the circle markers
var quakeLayer = new L.layerGroup();
//make a temp layer for the tectonic plates
var faultLayer = new L.layerGroup();

//define the overlay group
var overlayMaps = {
  "Earthquakes": quakeLayer,
  "Fault Lines": faultLayer
};

//make the control visible to change the layers
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

//define variables to be used for info
var lon = 0.0, lat = 0.0;
var tempTime, quakePlace, quakeMag, colorfill, rad;

d3.json(url, function(data) {
  data.features.forEach((quake) => {
    //set lat and long
    lon = quake.geometry.coordinates[0];
    lat = quake.geometry.coordinates[1];

    //get the time, place, and magnitude to display on click
    tempTime = String(new Date(quake.properties.time)).substr(0,34);
    quakePlace = quake.properties.place;
    quakeMag = quake.properties.mag;

    //conditional to determine the color of the circle
    //and the number to multiply the magnitude by to determine radius
    if(quakeMag == 0){colorfill = "lightgreen"; rad = 30000}
    else if(quakeMag <= 1){colorfill = "lightgreen"; rad = quakeMag * 30000}
    else if(quakeMag <= 2){colorfill = "#16C80B"; rad = quakeMag * 35000}
    else if(quakeMag <= 3){colorfill = "#C8C50B"; rad = quakeMag * 40000}
    else if(quakeMag <= 4){colorfill = "#FA8C35"; rad = quakeMag * 45000}
    else if(quakeMag <= 5){colorfill = "#DD26DA"; rad = quakeMag * 45500}
    else{colorfill = "red"; rad = quakeMag * 46000}

    //create the circles
    L.circle([lat,lon], {
      fillColor: colorfill,
      color: "black",
      fillOpacity: 0.85,
      radius: rad
    }).bindPopup("<p style='text-align:center;'> <strong>Time:</strong> " + String(tempTime) + "<br> <strong>Place: </strong>" 
      + quakePlace + "<br> <strong>Mag: </strong>" + String(quakeMag) + "</p>").addTo(myMap)
  })
});

//future legend control code -- need to modify
function getColor(d) {
  return d > 5 ? 'red' :
         d > 4  ? '#DD26DA' :
         d > 3 ? '#FA8C35' :
         d > 2 ? '#C8C50B' :
         d > 1 ? '#16C80B' :
              'lightgreen';
}
var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = [],
    categories = [0,1,2,3,4,5];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
                '<li style="background:' + getColor(categories[i] + 1) + '"></li> ' +
            categories[i] + (categories[i=1] ? '&ndash;' + categories[i+1] + '<br>' : '+');

        }
    return div;
    };
    legend.addTo(myMap);
// https://leafletjs.com/examples/choropleth/

