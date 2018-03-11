//IF NEDED...   const mysql = require('mysql');

class UsuarioLikeLibroProvider {
    
      constructor(app, db)
      {
        this.getAll(app,db);    //Get
        this.getOneUser(app, db); //Get
        this.getOneLike(app, db); //Get
        this.modifyOne(app, db);    //Put Probablemente inutil. Solo borrado o insert
        this.insertOne(app, db); // Post
        this.deleteOne(app, db);  //Delete   
      }
    
      getAll(app, db)
      {
        app.get('/usuariolikelibro', function (req, res) {
          var con = db.getConn(db.connect).then(function(response)
          {
            response.query("SELECT * FROM usuario_like_libro", function (err, result, fields) {
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

      getOneUser(app, db)
      {
        app.get('/usuariolikelibro/:id', function (req, res) 
        {
            var idusuario = req.params.id;
            console.log("Estoy getteando " + idusuario);     
            if (idusuario)
            {
                var con = db.getConn(db.connect).then(function(response)
                {
                    response.query("SELECT * FROM usuario_like_libro WHERE Usuario_idUsuario =" + db.escape(idusuario) + ";", 
                    function (err, result, fields) {
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

      getOneLike(app, db)
      {
        app.get('/usuariolikelibro/:idUsuario/:idLibro', function (req, res) 
        {
            var idUsuario = req.params.idUsuario;
            var idLibro = req.params.idLibro;
            console.log("Estoy getteando like " + idUsuario);     
            if (idUsuario)
            {
                var con = db.getConn(db.connect).then(function(response)
                {
                    var statement = "SELECT * FROM usuario_like_libro WHERE Usuario_idUsuario =" + 
                    db.escape(idUsuario) + " AND Libro_idLibro = " + db.escape(idLibro) + " ;";

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
        app.post('/usuariolikelibro', function (req, res) {
            var like = req.body.like;    
            if (like)
            {
                console.log("Estoy insertando like de usuario" + like); 
                for (var i in like) {
                    console.log(like[i]);
                }
        
                var con = db.getConn(db.connect).then(function(response)
                {
                    var statement = "INSERT INTO usuario_like_libro VALUES (" + db.escape(like.idUsuario) + ", " 
                    + db.escape(like.idLibro) + ");";
        
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

      modifyOne(app, db)
      {
        app.put('/usuariolikelibro', function (req, res) {
            var like = req.body.like;
            console.log("Estoy modificando " + like);     
            if (like)
            {
                for (var i in like) {
                console.log(like[i]);
                }
        
                var con = db.getConn(db.connect).then(function(response)
                {
                var statement = "UPDATE usuario_like_libro SET gusta = '" + db.escape(like.gusta) +
                "' WHERE Usuario_idUsuario = " + db.escape(like.idUsuario) + " AND Libro_idLibro = " + db.escape(like.idLibro) + ";";
        
                response.query(statement, function (err, result) {
                    response.release();
                    if (err)
                    {
                        if (err.code == 'ER_DUP_ENTRY')
                        {
                            console.log(err);
                            res.status(206)        // HTTP status 206: Duplicated entry
                                .send('Duplicated Entry');
                        }
                        else
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
        app.delete('/usuariolikelibro', function (req, res) {
          var like = req.body.like;
          console.log("Estoy deleteando " + like.idUsuario + ", " + like.idLibro );
          var con = db.getConn(db.connect).then(function(response)
          {
            var statement = "DELETE FROM usuario_like_libro WHERE Usuario_idUsuario = " + 
            db.escape(like.idUsuario) + " AND Libro_idLibro = " + db.escape(like.idLibro) + ";";

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
    
    module.exports = UsuarioLikeLibroProvider;
    