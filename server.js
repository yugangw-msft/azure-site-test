var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(port,function(){
    console.log("We have started our server on port 3000");
});

app.get('/', function (req, res) {
  var hostname = req.headers.host.split(":")[0];

  if(hostname.startsWith("admin."))
    res.send("this is admin response!");
  else {
    console.error("Something wrong");
    console.log("Something normal");
    res.send('APPSETTING_WEBSITE_SITE_NAME is:' + process.env.APPSETTING_WEBSITE_SITE_NAME);
  }
});
