//IF NEDED...   const mysql = require('mysql');

class ReporteLibroProvider {
    
  constructor(app, db)
  {
    this.getAll(app,db);    //Get
    this.getOne(app, db); //Get
    this.deleteOne(app, db);  //Delete
    this.insertOne(app, db); // Post
  }

  getAll(app, db)
  {
    app.get('/reporteLibro', function (req, res) {
      var con = db.getConn(db.connect).then(function(response)
      {
        var statement = "SELECT * FROM usuario_reporta_libro;";
        response.query(statement, function (err, result, fields) {
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

  getOne(app, db)
  {
    app.get('/reporteLibro/:id', function (req, res) 
    {
        var idReporte = req.params.id;
        console.log("Estoy getteando " + idReporte);     
        if (idReporte)
        {
            var con = db.getConn(db.connect).then(function(response)
            {
                var statement = "SELECT * FROM usuario_reporta_libro WHERE libro_idLibro =" + 
                db.escape(idReporte) + ";";

                response.query(statement, function (err, result, fields) {
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
        } else
        {
            res.status(404)        // HTTP status 400: BadRequest
            .send('Missed Id');
        }
    });
  }

  insertOne(app, db)
  {
    app.post('/reporteLibro', function (req, res) {
        var reporte = req.body.reporte;
        console.log("Estoy insertando reporte " + reporte);     
        if (reporte)
        {
            console.log("Estoy insertando reporte " + reporte); 
            for (var i in reporte) {
                console.log(reporte[i]);
            }
    
            var con = db.getConn(db.connect).then(function(response)
            {
                var statement = "INSERT INTO usuario_reporta_libroo VALUES (" + 
                db.escape(reporte.idUsuario) + ", " + db.escape(reporte.idLibro) + ", " + 
                db.escape(reporte.motivo) + ");";
    
                response.query(statement, function (err, result) {
                    response.release();
                    if (err)
                    {
                        if (err.code == 'ER_DUP_ENTRY')
                        {   
                            console.log(err);
                            res.status(206)        // HTTP status 206: Duplicated entry
                                .send('Duplicated Entry');
                        } else
                        {
                            console.log(err);
                            res.status(204)        // HTTP status 204: NotContent
                            .send('Failed at consult');
                        }
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
    });
  }

  deleteOne(app, db)
  {
    app.delete('/reporteLibro', function (req, res) {
      var idToDeleteUsuario = req.body.idUsuario;
      var idToDeleteLibro = req.body.idLibro;          
      console.log("Estoy deleteando " + idToDeleteComentario);
      if (idToDeleteLibro && idToDeleteUsuario) {
        var con = db.getConn(db.connect).then(function(response)
        {
          var statement = "DELETE FROM usuario_reporta_libro WHERE usuario_idUsuario = " + 
          db.escape(idToDeleteUsuario) + " AND libro_idLibro = " + db.escape(idToDeleteLibro) + ";";
          
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
    });
  };
}

module.exports = ReporteLibroProvider;