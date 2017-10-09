var util = require('util');
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
  var resource = 'https://management.azure.com/'; // can be any Azure resources, like key-vault
  var tokenUri = util.format('%s?resource=%s&api-version=2017-09-01', msiEndpoint, resource);
  var options = {
    url: tokenUri,
    headers: {
      Secret: msiSecret
    }
  };
  request(options, function (error, response, body) {
    if (error || response.statusCode != 200) {
      res.send(util.format('MSI token request failed. Error: %s, Response: %s', error, response));
      return;
    }
    res.send('Token:' + JSON.parse(body).access_token);
    //use this token to initialize an Azure SDK client and do something....
  });
});
