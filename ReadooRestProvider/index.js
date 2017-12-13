var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );

var Connection = require('./Util/dbConnection');
var db = new Connection();

var LibroProvider = require('./RestModules/LibroProvider')
new LibroProvider(app, db);

var UsuarioProvider = require('./RestModules/UsuarioProvider');
new UsuarioProvider(app, db);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
