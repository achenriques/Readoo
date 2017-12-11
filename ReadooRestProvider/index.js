var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );

var Connection = require('./Util/dbConnection');
var db = new Connection();

var LibroProvider = require('./RestModules/LibroProvider')
new LibroProvider(app, db);

/*
app.get('/', function (req, res) {
  var con = db.getConn(db.connect).then(function(response)
  {
    response.query("SELECT * FROM libro", function (err, result, fields) {
      response.release();
      if (err)
      {
        console.log(err);
        res.status(404)        // HTTP status 404: NotFound
          .send('Failed at consult');
      } else {
        res.json(result);
        console.log(response);
      }
    });
  }, function (error)
  {
    console.log(error);
    res.status(404)        // HTTP status 404: NotFound
      .send('Not found');
  });
});
*/

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
