var NodeGeocoder = require("node-geocoder");
var express = require("express");
const app = express();
var bodyParser = require("body-parser");

var options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: "AIzaSyCnz169tp7MAkt0ef4AF4Xc_mBNFpU-aas",
  formatter: null
};

var markers = [];
var geocoder = NodeGeocoder(options);

app.use(bodyParser.json());

app.get("/geocode", (req, res) => {
  var resp = res;
  geocoder.geocode(req.query.address, function(err, res) {
    if (err) {
      resp.status(500).json({ Error: "The data cannot be fetched from the provider. Check your credentials and try again" });
    } else {
      resp.send(res);
    }
  });
});

app.get("/reverseGeocode", (req, res) => {
  var resp = res;
  geocoder.reverse({ lat: req.query.lat, lon: req.query.lon }, function(err, res) {
    if (err) {
      next(err); // Pass errors to Express.
    } else {
      resp.send(res);
    }
  });
});

app.post("/saveMarker", function(req, res) {
  markers.push(req.body.marker);
  res.json({ Success: "Marker saved" });
});

app.post("/deleteMarker", function(req, res) {
  let marker = markers.find((marker, i) => marker[0].formattedAddress == req.body.marker);
  let index = markers.indexOf(marker);
  if (index > -1) {
    markers.splice(index, 1);
    res.json({ Success: "Marker Deleted" });
  } else {
    res.status(500).json({ Error: "The location that you modified cannot be found" });
  }
});

app.post("/editMarker", function(req, res) {
  let marker = markers.find((marker, i) => marker[0].formattedAddress == req.body.marker);
  let index = markers.indexOf(marker);
  let resp = res;
    geocoder.geocode(req.body.edit, function(err, res) {
      if (index >= 0) {
        markers[index] = res;
        resp.json({ Success: "Marker Edited" });
      } else {
        if(res[0]){
        resp.send(res);
        markers.push(res)
      }
      else{
        resp.status(500).json({ Error: "No relevant address found for the searchterm" });
      }
      }
    });
});

app.get("/getMarkers", (req, res) => {
  if (markers.length > 0) {
    res.json({ markers: markers });
  } else {
    res.status(500).json({ Error: "No locations found" });
  }
});

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Geocode node-app listening at http://localhost:%s", port);
});
