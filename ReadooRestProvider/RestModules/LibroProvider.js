const mysql = require('mysql');

class LibroProvider {

  constructor(app, db)
  {
    this.getAll(app, db);
    this.deleteOne(app, db);
    this.insertOne(app, db);
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
            res.status(404)        // HTTP status 404: NotFound
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
        res.status(404)        // HTTP status 404: NotFound
          .send('Not found');
      });
    });
  }

  deleteOne(app, db)
  {
    app.delete('/libro', function (req, res) {
      var idToDelete = req.body.id;
      console.log("Estoy deleteando " + idToDelete);
      var con = db.getConn(db.connect).then(function(response)
      {
        response.query("DELETE FROM libro WHERE idLibro =" + idToDelete, function (err, result) {
          response.release();
          if (err)
          {
            console.log(err);
            res.status(404)        // HTTP status 404: NotFound
              .send('Failed at consult');
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result.affectedRows);
          }
        });
      }, function (error)
      {
        console.log(error);
        res.status(401)        // HTTP status 404: NotFound
          .send('Imposible to delete');
      });
   }
 }

 insertOne(app, db)
 {
   app.post('/libro', function (req, res) {
     var libroToInsert = req.body.libro;
     console.log("Estoy insertando " + libroToInsert);

     for (var i in libroToInsert) {
        console.log(libroToInsert[i]);
    }

     var con = db.getConn(db.connect).then(function(response)
     {
       var statement = "INSERT INTO libro (idLibro, titulo, autor, descripcion, review, likes, fecha, coverUrl, " +
        "Usuario_idUsuario, Categoria_idCategoria) VALUES (" + 0 + ", '" + String(libroToInsert.titulo) + "', '" + String(libroToInsert.autor) +
        "', '" + String(libroToInsert.descripcion) + "', '" + String(libroToInsert.review) + "', " + libroToInsert.likes + " , current_timestamp(), '" +
        String(libroToInsert.coverUrl) + "', " + libroToInsert.Usuario_idUsuario + ", " + libroToInsert.Categoria_idCategoria + ")";

       response.query(statement, function (err, result) {
         response.release();
         if (err)
         {
           console.log(err);
           res.status(404)        // HTTP status 404: NotFound
             .send('Failed at consult');
         } else {
           res.setHeader('Content-Type', 'application/json');
           res.status(200).json(result.affectedRows);
         }
       });
     }, function (error)
     {
       console.log(error);
       res.status(401)        // HTTP status 404: NotFound
         .send('Imposible to insert');
     });
  });
 }

}

module.exports = LibroProvider;
