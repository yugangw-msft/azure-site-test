var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log("We have started our server on port 3000");
});

app.get('/', function (req, res) {
  var status = 200;
  console.log('Using Node ' + process.version);
  if (req.query.status) {
    status = Number(req.query.status)
  }
  if (status >= 400) {
    console.error("Something wrong");
  }
  else {
    console.log("Something normal");
  }
  var echo = req.query.echo;
  res.status(status);
  res.send(echo + " at " + (new Date().toLocaleString()));
});
