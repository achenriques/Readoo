//IF NEDED...   const mysql = require('mysql');

class LibroProvider {

  constructor(app, db)
  {
    this.getAll(app, db); //Get
    this.deleteOne(app, db);  //Delete
    this.getBucnh_or_insertOne(app, db); // Post
  }

  getAll(app, db)
  {
    app.get('/libro', function (req, res) {
      var con = db.getConn(db.connect).then(function(response)
      {
        response.query("SELECT * FROM libro", function (err, result, fields) {
          response.release();
          if (err)
          {
            console.log(err);
            res.status(204)        // HTTP status 204: NotContent
              .send('Failed at consult');
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
            //res.json(result);
          }
        });
      }, function (error)
      {
        console.log(error);
        res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
          .send('Not DB connection');
      });
    });
  }

  getBucnh_or_insertOne(app, db)
  {
    app.post('/libro', function (req, res) {
      var ultimo = req.body.ultimo;
      console.log("Deberia cojer n libros " + ultimo);
      if (ultimo)
      {
        console.log("Deberia cojer n libros")

        var idUsuario = ultimo.idUsuario;
        var idUltimoLibro = ultimo.idUltimoLibro;
        var fechaUltimo = ultimo.fechaUltimo;
        var numberOfBooks = ultimo.numberOfBooks;
  
        console.log(idUsuario + " , " + idUltimoLibro + " , " + fechaUltimo + " , " + numberOfBooks);
  
        var con = db.getConn(db.connect).then(function(response)
        {
          var statement = "SELECT * FROM libro WHERE idLibro > " + idUltimoLibro + /*" AND fecha > '" + fechaUltimo + */" LIMIT " + numberOfBooks + ";";
   
          response.query(statement, function (err, result) {
            response.release();
            if (err)
            {
              console.log(err);
              res.status(204)        // HTTP status 204: NotContent
                .send('Failed at consult');
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.status(200).json(result);
            }
          });
        }, function (error)
        {
          console.log(error);
          res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
            .send('Not DB connection');
        });
      } else
      {
        var libroToInsert = req.body.libro;
        console.log("Estoy insertando " + libroToInsert);     
        if (libroToInsert)
        {
          console.log("Estoy insertando " + libroToInsert);
        
          for (var i in libroToInsert) {
            console.log(libroToInsert[i]);
          }
    
          var con = db.getConn(db.connect).then(function(response)
          {
            var statement = "INSERT INTO libro (idLibro, titulo, autor, descripcion, review, likes, fecha, coverUrl, " +
            "Usuario_idUsuario, Categoria_idCategoria, visible) VALUES (" + 0 + ", " + db.escape(String(libroToInsert.titulo)) + ", " + db.escape(libroToInsert.autor) +
            ", " + db.escape(libroToInsert.descripcion) + ", " + db.escape(libroToInsert.review) + "', " + db.escape(libroToInsert.likes) + " , current_timestamp(), " +
            db.escape(libroToInsert.coverUrl) + ", " + db.escape(libroToInsert.Usuario_idUsuario) + ", " + db.escape(libroToInsert.Categoria_idCategoria) + ", " + 
            db.escape(libroToInsert.visible) + ");";
    
            response.query(statement, function (err, result) {
              response.release();
              if (err)
              {
                console.log(err);
                res.status(204)        // HTTP status 204: NotContent
                  .send('Failed at consult');
              } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(result.affectedRows);
              }
            });
          }, function (error)
          {
            console.log(error);
            res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
              .send('Not DB connection');
          });
        }
      }
   });
  }

  deleteOne(app, db)
  {
    app.delete('/libro', function (req, res) {
      var idToDelete = req.body.id;
      console.log("Estoy deleteando " + idToDelete);
      var con = db.getConn(db.connect).then(function(response)
      {
        response.query("DELETE FROM libro WHERE idLibro =" + db.escape(idToDelete), function (err, result) {
          response.release();
          if (err)
          {
            console.log(err);
            res.status(204)        // HTTP status 204: NotContent
              .send('Failed at consult');
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result.affectedRows);
          }
        });
      }, function (error)
      {
        console.log(error);
        res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
          .send('Not DB connection');
      });
   });
 };

}

module.exports = LibroProvider;
