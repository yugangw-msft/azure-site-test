var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var server = app.listen(port, function () {
  console.log("We have started our server on port 3000");
});

// Create connection to database
var config = {
     userName: process.env.MY_DB_USER, //update me
     password: process.env.MY_DB_PASSWORD, // update me
     server: 'yugangwsqlserver.database.windows.net', // update me
     options:
        {
          database: 'yugangwsqldb2', //update me
          encrypt: true
        }
   };

app.get('/', function (req, res) {
  var connection = new Connection(config);
  // Read all rows from table
  connection.on('connect', function (err) {
    if (err) {
      res.send(err);
    }
    else {
      request = new Request(
           "SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid",
              function (err, rowCount, rows) {
                res.send(rowCount + ' row(s) returned');
              }
             );

      request.on('row', function (columns) {
        columns.forEach(function (column) {
          ;//res.send("%s\t%s", column.metadata.colName, column.value);
        });
      });
      connection.execSql(request);
    }
  }
 );
});
