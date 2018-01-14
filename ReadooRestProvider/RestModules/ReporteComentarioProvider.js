//IF NEDED...   const mysql = require('mysql');

class ReporteComentarioProvider {
    
  constructor(app, db)
  {
    this.getAll(app,db);    //Get
    this.getOne(app, db); //Get
    this.deleteOne(app, db);  //Delete
    this.insertOne(app, db); // Post
  }

  getAll(app, db)
  {
    app.get('/reporte', function (req, res) {
      var con = db.getConn(db.connect).then(function(response)
      {
        var statement = "SELECT * FROM usuario_reporta_comentario;";
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
    app.get('/reporte/:id', function (req, res) 
    {
        var idReporte = req.params.id;
        console.log("Estoy getteando " + idReporte);     
        if (idReporte)
        {
            var con = db.getConn(db.connect).then(function(response)
            {
                var statement = "SELECT * FROM usuario_reporta_comentario WHERE usuario_comenta_libro_idComentario =" + 
                idReporte + ";";

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
    app.post('/reporte', function (req, res) {
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
                var statement = "INSERT INTO usuario_reporta_comentario VALUES (" + 
                reporte.idusuario + ", " + reporte.idComentario + ", '" + reporte.motivo + "');";
    
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
    app.delete('/reporte', function (req, res) {
      var idToDeleteUsuario = req.body.idUsuario;
      var idToDeleteComentario = req.body.idComentario;          
      console.log("Estoy deleteando " + idToDeleteComentario);
      if (idToDeleteComentario && idToDeleteUsuario) {
        var con = db.getConn(db.connect).then(function(response)
        {
          var statement = "DELETE FROM usuario_reporta_comentario WHERE usuario_idUsuario = " + 
          idToDeleteUsuario + " AND usuario_comenta_libro_idComentario = " + idToDeleteComentario + ";";
          
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

module.exports = ReporteComentarioProvider;
    