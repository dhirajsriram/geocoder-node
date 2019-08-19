# Geocoder

## Abstract

A nodeJs application that handles all the CRUD operation and also geocoding and reverse-geocoding for the [Geocoder](https://github.com/dhirajsriram/geocoder) application

## Installation

Kindly do an npm install at the root directory of both the applications to install the required packages. Following are the libraries that are used

- enzyme v3.10.0
- node-geocoder v3.23.0

```
npm install
```

## Serving Locally

Once the packages have been installed you may the serve applications locally. You may run `npm start` on the root directory of the applications to serve them locally. The application runs here:

- geocoder-node : [http://localhost:8081](http://localhost:8081)

**The backend and the frontend applications must be served simultaneously to persist data**

### Scripts

`npm run start` - Serves the app locally on [http://localhost:8081](http://localhost:8081)

`npm run test` - Runs the test scrips on the specific application

## Deployment

- The application has been deployed on AWS to an **EC2** instance.
- `port 8081` has been opened to accept inbound request
- A node process runs the application on `port 8081`.
- The proxied request from apache is served by the node application.

## Architecture

The front-end and back-end application for geocoder are closely integrated. Any operation related to markers is handled in the back-end which is immediately fetched from the front-end to have the latest version of the data available at all times. Following is an integrated architecture of the applications

<p align="center"><img src="/geocoder.png"></p>

## Description

The application follows a **head-less micro-service** based approach. A list of API is defined in the application that handles the various CRUD operations from the front-end.

`geocode` - Makes an API request to the google maps to retrieve the coordinates based on the search term

`reverseGeocode` - Makes an API request to the google maps to retrieve the address information based on the coordinates

`saveMarker` - Saves the marker data to a local array

`editMarker` - Edits the marker value of a specific element in the array

`deleteMarker` - Removes a marker from the array.

`getMarkers` - Fetches the marker array.

## Design

The micro-service based architecture suits well for an application of this stature since it is an approach that easy to spin-up and easy to manage. [node-geocoder](https://www.npmjs.com/package/node-geocoder) was used to manage the integration with google maps as it offers easy customizability.

## Integrational configurations

node-geocoder makes it easy to switch the third-party API's. The options object provides the necessary properties related to the third-party API's

```js
var options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: "AIzaSyCnz169tp7MAkt0ef4AF4Xc_mBNFpU-aas",
  formatter: null
};
```

### provider

The elaborated list of third party integrations available with node-geocoder can be found [here](https://www.npmjs.com/package/node-geocoder)

## httpadapter

- `https`: This adapter uses the Https nodejs library (default)
- `http`: This adapter uses the Http nodejs library
- `request`: This adapter uses the request nodejs library

You can specify request timeout using parameter `options.timeout`

### Formatter

- `gpx` : format result using GPX format
- `string` : format result to an String array (you need to specify `options.formatterPattern` key)
  - `%P` country
  - `%p` country code
  - `%n` street number
  - `%S` street name
  - `%z` zip code
  - `%T` State
  - `%t` state code
  - `%c` City

## Error Handling

Various steps have been taken to handle errors under the boundaries of the application as well as to handle the errors with third party API's as well. A 500 response with the necessary response is returned when either of the above occurrences happens

```js
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
```
