var expect  = require('chai').expect;
var request = require('request');
supertest = require('supertest'),
api = supertest('http://localhost:8081');

describe("SAMPLE unit test",function(){
    it('Calls google geocode api when triggered', function(done) {
        request('http://localhost:8081/geocode?address=Newark,%20Essex%20County,%20New%20Jersey' , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    it('Calls google reverse-geocode api when triggered', function(done) {
        request('http://localhost:8081/reverseGeocode?lat=43.445646&lon=88.332155' , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    it('Saves the value to the backend when called', function(done) {
        api.post('/saveMarker')
            .send({"marker":[{"formattedAddress":"Newark, NJ, USA","latitude":40.735657,"longitude":-74.1723667,"extra":{"googlePlaceId":"ChIJHQ6aMnBTwokRc-T-3CrcvOE","confidence":0.5,"premise":null,"subpremise":null,"neighborhood":"Newark","establishment":null},"administrativeLevels":{"level2long":"Essex County","level2short":"Essex County","level1long":"New Jersey","level1short":"NJ"},"city":"Newark","country":"United States","countryCode":"US","provider":"google"}]})
            .end(function (err, res) {
                expect(res.body.formattedAddress).to.not.equal(null);
                done();
            });   
    });
    it('Deletes the value of marker when called', function(done) {
        api.post('/deleteMarker')
            .send({"marker":"Montclair, NJ, USA"})
            .end(function (err, res) {
                expect(res.body.formattedAddress).to.not.equal(null);
                done();
            });   
    });
    it('Gets the value of markers when called', function(done) {
        request('http://localhost:8081/getMarkers' , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    
})
