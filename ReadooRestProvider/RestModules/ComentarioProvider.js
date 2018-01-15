//IF NEDED...   const mysql = require('mysql');

class ComentarioProvider {
    
      constructor(app, db)
      {
        this.getAll(app,db);    //Get
        this.getOne(app, db); //Get
        this.getSubs(app, db); //Get
        this.deleteOne(app, db);  //Delete
        this.insertOne(app, db); // Post
      }
    
      getAll(app, db)
      {
        app.get('/comentario', function (req, res) {
          var con = db.getConn(db.connect).then(function(response)
          {
            response.query("SELECT * FROM usuario_comenta_libro", function (err, result, fields) {
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
        app.get('/comentario/:id', function (req, res) 
        {
            var idlibro = req.params.id;
            console.log("Estoy getteando " + idlibro);     
            if (idlibro)
            {
                var con = db.getConn(db.connect).then(function(response)
                {
                    var statement = "SELECT * FROM usuario_comenta_libro WHERE libro_idLibro =" + idlibro + ";";

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

      getSubs(app, db)
      {
        app.get('/comentario/:id/:idComentario', function (req, res) 
        {
            var idLibro = req.params.id;
            var idFromComentario= req.params.idComentario
            console.log("Estoy getteando " + idLibro);     
            if (idLibro && idFromComentario)
            {
                var con = db.getConn(db.connect).then(function(response)
                {
                    var statement = "SELECT * FROM usuario_comenta_libro WHERE libro_idLibro = " + 
                    idlibro + " AND idComentarioPadre = " + idFromComentario + ";";

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
        app.post('/comentario', function (req, res) {
            var comentario = req.body.comentario;
            console.log("Estoy insertando comentario " + comentario);     
            if (comentario)
            {
                console.log("Estoy insertando comentario " + comentario); 
                for (var i in comentario) {
                    console.log(comentario[i]);
                }
        
                var con = db.getConn(db.connect).then(function(response)
                {
                    var statement = "INSERT INTO usuario_comenta_libro VALUES (" + 0 + ", " + 
                    comentario.idUsuario + ", " + comentario.idLibro + ", current_timestamp(), '"+ 
                    comentario.comentario + "', ";

                    if (comentario.idComentarioPadre) 
                        statement += comentario.idComentarioPadre + ");";
                    else
                    statement += "null);";

                    + comentario.idComentarioPadre + ");";
        
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
        app.delete('/comentario', function (req, res) {
          var idToDelte = req.body.id;
          console.log("Estoy deleteando " + idToDelte);
          var con = db.getConn(db.connect).then(function(response)
          {
            var statement = "DELETE FROM usuario_comenta_libro WHERE idComentario = " + idToDelte + ";";
            
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
       });
     };
    
    }
    
    module.exports = ComentarioProvider;
    