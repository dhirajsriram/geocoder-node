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
    resp.send(res);
  });
});

app.get("/reverseGeocode", (req, res) => {
  var resp = res;
  geocoder.reverse({ lat: req.query.lat, lon: req.query.lon }, function(err, res) {
    resp.send(res);
  });
});

app.post("/saveMarker", function(req, res) {
  markers.push(req.body.marker);
  res.json({ Success: "Marker saved" });
});

app.post("/deleteMarker", function(req, res) {
  let marker = markers.find((marker, i) => marker[0].formattedAddress == req.body.marker);
  let index = markers.indexOf(marker);
  markers.splice(index, 1);
  res.json({ Success: "Marker Deleted" });
});

app.post("/editMarker", function(req, res) {
  let marker = markers.find((marker, i) => marker[0].formattedAddress == req.body.marker);
  let index = markers.indexOf(marker);
  let resp = res;
  geocoder.geocode(req.body.edit, function(err, res) {
    if (index > 0) {
      markers[index] = res;
      resp.json({ Success: "Marker Edited" });
    } else {
      resp.send(res);
      markers.push(res)
    }
  });
});

app.get("/getMarkers", (req, res) => {
  res.json({ markers: markers });
});

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Geocode node-app listening at http://localhost:%s", port);
});
