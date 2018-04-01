const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './ReadooRestProvider/Uploads/Portadas')
  },
  filename: function (req, file, cb) {
    var fileType = file.mimetype.split('/');
    if (fileType && fileType[0] === 'image' &&
      (fileType[1] === 'jpg' || fileType[1] === 'jpeg' || fileType[1] === 'png' || fileType[1] === 'svg')) {
      var fileName = 'User' + '-' + Date.now() + '.' + fileType[1];
      cb(null, fileName) //TODO: cambiar por usuario actual
      req.body.coverUrl = fileName;
    } else {
      req.body.coverUrl = '';
      cb(null, 'portada' + '-' + 'alguna')
    }
  }
})

var upload = multer({ storage: storage })

class LibroProvider {

  constructor(app, db) {
    this.getPortada(app, db); //Get
    this.getAll(app, db); //Get
    this.deleteOne(app, db);  //Delete
    this.getBucnh(app, db); // Post
    this.insertOne(app, db); // Post
  }

  getPortada(app, db) {
    app.get('/libro/portada/:portada', function (req, res) {
      var nombrePortada = req.params.portada;
      console.log("Estoy getteando Portada" + nombrePortada);
      if (nombrePortada) {
        var archivo = path.resolve('./ReadooRestProvider/Uploads/Portadas/' + nombrePortada);
        if (archivo) {
          res.sendfile(archivo);
        }
        else {
          console.log(error);
          res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
            .send('No archive found');
        }
      } else {
        res.status(404)        // HTTP status 400: BadRequest
          .send('Missed Id');
      }
    });
  }

  getAll(app, db) {
    app.get('/libro', function (req, res) {
      var con = db.getConn(db.connect).then(function (response) {
        response.query("SELECT * FROM libro", function (err, result, fields) {
          response.release();
          if (err) {
            console.log(err);
            res.status(204)        // HTTP status 204: NotContent
              .send('Failed at consult');
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
            //res.json(result);
          }
        });
      }, function (error) {
        console.log(error);
        res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
          .send('Not DB connection');
      });
    });
  }

  getBucnh(app, db) {
    app.post('/libro', function (req, res) {
      var ultimo = req.body.ultimo;
      console.log("Deberia cojer n libros " + ultimo);
      if (ultimo) {
        console.log("Deberia cojer n libros")

        var idUsuario = ultimo.idUsuario;
        var idUltimoLibro = ultimo.idUltimoLibro;
        var fechaUltimo = ultimo.fechaUltimo;
        var numberOfBooks = ultimo.numberOfBooks;

        console.log(idUsuario + " , " + idUltimoLibro + " , " + fechaUltimo + " , " + numberOfBooks);

        var con = db.getConn(db.connect).then(function (response) {
          var statement = "SELECT * FROM libro WHERE idLibro > " + idUltimoLibro + /*" AND fecha > '" + fechaUltimo + */" LIMIT " + numberOfBooks + ";";

          response.query(statement, function (err, result) {
            response.release();
            if (err) {
              console.log(err);
              res.status(204)        // HTTP status 204: NotContent
                .send('Failed at consult');
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.status(200).json(result);
            }
          });
        }, function (error) {
          console.log(error);
          res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
            .send('Not DB connection');
        });
      }
    });
  }

  insertOne(app, db) {
    app.post('/newLibro', upload.single('portada'), function (req, res) {
      console.log("Estoy insertando libro");

      var con = db.getConn(db.connect).then(function (response) {
        var statement = "INSERT INTO libro (idLibro, titulo, autor, descripcion, review, likes, fecha, coverUrl, " +
          "Usuario_idUsuario, Categoria_idCategoria, visible) VALUES (" + 0 + ", " + mysql.escape(String(req.body.titulo)) + ", " + mysql.escape(req.body.autor) +
          ", " + mysql.escape(req.body.descripcion) + ", " + mysql.escape(req.body.opinion) + ", " + 0 + " , current_timestamp(), " +
          mysql.escape(req.body.coverUrl) + ", " + mysql.escape(Number(req.body.usuario)) + ", " + mysql.escape(Number(req.body.categoria)) + ", " +
          mysql.escape("S") + ");";

        response.query(statement, function (err, result) {
          response.release();
          if (err) {
            console.log(err);
            res.status(204)        // HTTP status 204: NotContent
              .send('Failed at consult');
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result.affectedRows);
          }
        });
      }, function (error) {
        console.log(error);
        res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
          .send('Not DB connection');
      });
    });
  }

  deleteOne(app, db) {
    app.delete('/libro', function (req, res) {
      var idToDelete = req.body.id;
      console.log("Estoy deleteando " + idToDelete);
      var con = db.getConn(db.connect).then(function (response) {
        response.query("DELETE FROM libro WHERE idLibro =" + mysql.escape(idToDelete), function (err, result) {
          response.release();
          if (err) {
            console.log(err);
            res.status(204)        // HTTP status 204: NotContent
              .send('Failed at consult');
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result.affectedRows);
          }
        });
      }, function (error) {
        console.log(error);
        res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
          .send('Not DB connection');
      });
    });
  };

}

module.exports = LibroProvider;
