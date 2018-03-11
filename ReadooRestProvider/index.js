var express = require('express');
var app = express();

var router = express.Router();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var basicAuth = require('express-basic-auth')
var serverCredentials = require('./Util/serverOptions');
app.use(basicAuth(serverCredentials));

var Connection = require('./Util/dbConnection');
var db = new Connection();

var LoginController = require('./LoginController');
new LoginController(app, db);

var LibroProvider = require('./RestModules/LibroProvider')
new LibroProvider(app, db);

var UsuarioProvider = require('./RestModules/UsuarioProvider');
new UsuarioProvider(app, db);

var UsuarioCategoriaProvider = require('./RestModules/UsuarioCategoriaProvider');
new UsuarioCategoriaProvider(app, db);

var UltimoProvider = require('./RestModules/UltimoProvider');
new UltimoProvider(app, db);

var UsuarioLikeLibroProvider = require('./RestModules/UsuarioLikeLibroProvider');
new UsuarioLikeLibroProvider(app, db);

var ComentarioProvider = require('./RestModules/ComentarioProvider');
new ComentarioProvider(app, db);

var ReporteComentarioProvider = require('./RestModules/ReporteComentarioProvider');
new ReporteComentarioProvider(app, db);

var ReporteLibroProvider = require('./RestModules/ReporteLibroProvider');
new ReporteLibroProvider(app, db);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
