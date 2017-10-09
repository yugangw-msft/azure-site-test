var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var request = require('request');
var msiEndpoint = process.env.MSI_ENDPOINT;
var msiSecret = process.env.MSI_SECRET;

var server = app.listen(port, function (){
    console.log("We have started our server on port 3000");
});

app.get('/', function (req, res) {
  if (!msiEndpoint || !msiSecret) {
    res.send('MSI is not configured!');
    return;
  }
  var tokenUri = msiEndpoint + '/resource=https://management.azure.com/&api-version=2017-09-01';
  var options = {
    url: tokenUri,
    headers: {
      Secret: msiSecret
    }
  };
  request(tokenUri, function (error, response, body) {
    if (error) {
      res.send('MSI token request failed: ' + error);
      return;
    }
    res.send('Token:' + JSON.stringify(response));
  });
});
