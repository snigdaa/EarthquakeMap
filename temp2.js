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
    //set the style for the circlemarkers in this function
    function circleInfo(feature) {
        //get the latitude and longitude
        lon = feature.geometry.coordinates[0];
        lat = feature.geometry.coordinates[1];
        //get the time, place, and magnitude to display
        tempTime = String(new Date(feature.properties.time)).substr(0,34);
        quakePlace = feature.properties.place;
        quakeMag = feature.properties.mag;
        //conditional to determine color and radius of circle
        if(quakeMag == 0){colorfill = "lightgreen"; rad = 30000}
        else if(quakeMag <= 1){colorfill = "lightgreen"; rad = quakeMag * 30000}
        else if(quakeMag <= 2){colorfill = "#16C80B"; rad = quakeMag * 35000}
        else if(quakeMag <= 3){colorfill = "#C8C50B"; rad = quakeMag * 40000}
        else if(quakeMag <= 4){colorfill = "#FA8C35"; rad = quakeMag * 45000}
        else if(quakeMag <= 5){colorfill = "#DD26DA"; rad = quakeMag * 45500}
        else{colorfill = "red"; rad = quakeMag * 46000}
        //final style return
        return {
            fillColor: colorfill,
            color: "black",
            fillOpacity: 0.85,
            radius: rad,
            weight: 0.3
        }
    }

    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
          },
        style: circleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<p style='text-align:center;'> <strong>Time:</strong> " 
            + String(new Date(feature.properties.time)).substr(0.34) + "<br> <strong>Place: </strong>" 
            + feature.properties.place + "<br> <strong>Mag: </strong>" + String(feature.properties.mag) + "</p>"

            )
        }           
    }).addTo(quakeLayer)
})