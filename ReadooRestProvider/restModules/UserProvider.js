//IF NEDED...   const mysql = require('mysql');

class UsuarioProvider {
    
      constructor(app, db)
      {
        this.getAll(app, db); //Get
        this.getOne(app, db); //Get
        this.modifyOne(app, db);    //Put
        this.deleteOne(app, db);  //Delete
        this.insertOne(app, db); // Post
      }
    
      getAll(app, db)
      {
        app.get('/usuario', function (req, res) {
          var con = db.getConn(db.connect).then(function(response)
          {
            response.query("SELECT * FROM usuario", function (err, result, fields) {
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
        app.get('/usuario/:id', function (req, res) 
        {
            var idusuario = req.params.id;
            console.log("Estoy getteando " + idusuario);     
            if (idusuario)
            {
                var con = db.getConn(db.connect).then(function(response)
                {
                    response.query("SELECT * FROM usuario WHERE idUsuario = " + idusuario + ";", function (err, result, fields) {
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

      modifyOne(app, db)
      {
        app.put('/usuario', function (req, res) {
            var usuarioToInsert = req.body.usuario;
            console.log("Estoy modificando " + usuarioToInsert);     
            if (usuarioToInsert)
            {
                for (var i in usuarioToInsert) {
                console.log(usuarioToInsert[i]);
                }
        
                var con = db.getConn(db.connect).then(function(response)
                {
                var statement = "UPDATE usuario SET nombre = '" + usuarioToInsert.nombre + "', apellido = '" + usuarioToInsert.apellido +
                "', apodo = '" + usuarioToInsert.apodo + "', pass = '" + usuarioToInsert.pass + "', email = '" + usuarioToInsert.email + 
                "', sobreMi = '" + usuarioToInsert.sobreMi + "', karma = " + usuarioToInsert.karma + ", avatarUrl = '" 
                + usuarioToInsert.avatarUrl + "', visible = '" + usuarioToInsert.visible +
                "' WHERE idUsuario = " + usuarioToInsert.idUsuario + ";";
        
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
    
      insertOne(app, db)
      {
        app.post('/usuario', function (req, res) {
            var usuarioToInsert = req.body.usuario;
            console.log("Estoy insertando " + usuarioToInsert);     
            if (usuarioToInsert)
            {
                console.log("Estoy insertando " + usuarioToInsert);
            
                for (var i in usuarioToInsert) {
                    console.log(usuarioToInsert[i]);
                }
        
                var con = db.getConn(db.connect).then(function(response)
                {
                var statement = "INSERT INTO usuario VALUES (" + 0 + ", '" + usuarioToInsert.nombre + "', '" + usuarioToInsert.apellido +
                "', '" + usuarioToInsert.apodo + "', '" + usuarioToInsert.pass + "', '" + usuarioToInsert.email + "', '" + 
                usuarioToInsert.sobreMi + "', " + usuarioToInsert.karma + ", '" + usuarioToInsert.avatarUrl + "', '" + usuarioToInsert.visible + "');";
        
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
                        res.status(200).json(result);
                        console.log(result);
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
        app.delete('/usuario', function (req, res) {
          var idToDelete = req.body.id;
          console.log("Estoy deleteando " + idToDelete);
          var con = db.getConn(db.connect).then(function(response)
          {
            response.query("DELETE FROM usuario WHERE idusuario =" + idToDelete, function (err, result) {
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
    
    module.exports = UsuarioProvider;
    