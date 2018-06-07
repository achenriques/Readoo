const mysql = require('mysql');const constantes = require('../Util/serverOptions');

class ComentarioProvider {
    
      constructor(app, db)
      {
        this.getAll(app,db);    //Get
        this.getOne(app, db); //Get
        this.getSubs(app, db); //Get
        this.getBunch(app, db); //Post
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
            var idLibro = req.params.id;
            console.log("Estoy getteando " + idLibro);     
            if (idLibro)
            {
                var con = db.getConn(db.connect).then(function(response)
                {
                    var statement = "SELECT * FROM usuario_comenta_libro WHERE libro_idLibro =" + mysql.escape(idLibro) + ";";

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
                    mysql.escape(idLibro) + " AND idComentarioPadre = " + mysql.escape(idFromComentario) + ";";

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

      getBunch(app, db) {
        app.post('/comentario/fetch', function (req, res) {
            var idLibro = req.body.idLibro;
            var numComentarios = req.body.numComentarios;
            var fechaUltimo = req.body.fechaUltimo;

            console.log("Estoy cogiendo comentario " + idLibro);     
            if (idLibro)
            {     
                var con = db.getConn(db.connect).then(function(response)
                {
                    var statement = "SELECT c.idComentario, c.usuario_idUsuario, c.libro_idLibro, c.fecha,c.comentario, " +
                    "c.idComentarioPadre, u.avatarUrl FROM usuario_comenta_libro c INNER JOIN usuario u " +
                    "ON c.usuario_idUsuario = u.idUsuario WHERE libro_idLibro = " + 
                    mysql.escape(idLibro) + " AND idComentarioPadre = NULL ";
                    if (fechaUltimo) {
                        statement += "AND fecha < " + mysql.escape(fechaUltimo) + " ";
                    }
                    statement += " ORDER BY fecha DESC LIMIT " + constantes.maxComentarios;

                    response.query(statement, function (err, result, fields) {
                        response.release();
                        if (err)
                        {
                            console.log(err);
                            res.status(204)        // HTTP status 204: NotContent
                            .send('Failed at consult');
                        } else {
                            var comentarios = result.slice();
                            var toRet = [];
                            if (result && result.lenght) {
                                var arr = result.map( function(el) { return el.idComentario; });

                                var statement2 = "SELECT c.idComentario, c.usuario_idUsuario, c.libro_idLibro, c.fecha,c.comentario, " +
                                "c.idComentarioPadre, u.avatarUrl FROM usuario_comenta_libro c INNER JOIN usuario u " +
                                "ON c.usuario_idUsuario = u.idUsuario WHERE libro_idLibro = " + 
                                mysql.escape(idLibro) + "AND idComentarioPadre IS NOT NULL AND idComentarioPadre IN " + arr ;
                                if (fechaUltimo) {
                                    statement2 += "AND fecha < " + mysql.escape(fechaUltimo) + " ";
                                }
                                statement2 += " ORDER BY fecha DESC LIMIT " + constantes.maxComentarios * 2;

                                response.query(statement2, function (err2, result2, fields2) {
                                    response.release();
                                    if (err2)
                                    {
                                        console.log(err);
                                        res.status(204)        // HTTP status 204: NotContent
                                        .send('Failed at consult');
                                    } else {
                                        if (result2 && result2.lenght) {
                                            toRet = comentarios.map(function (o) {
                                                return {
                                                    ...o,
                                                    subComentarios: result2.filter(function (elemet) {
                                                        return +elemen.idComentarioPadre === +o.idComentario;
                                                    })
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                toRet = comentarios;
                            }
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(toRet));
                            //res.json(result);
                        }
                    });
                }, function (error)
                {
                    console.log(error);
                    res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
                      .send('Not DB connection');
                });
            } else {
                res.status(204)        // HTTP status 204: NotContent
                .send('Failed at consult. No ID for search');
            }
       });
      }

      insertOne(app, db)
      {
        app.post('/comentario/nuevo', function (req, res) {
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
                    mysql.escape(comentario.idUsuario) + ", " + mysql.escape(comentario.idLibro) + ", current_timestamp(), "+ 
                    mysql.escape(comentario.comentario) + ", ";

                    if (comentario.idComentarioPadre) 
                        statement += mysql.escape(comentario.idComentarioPadre) + ");";
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
            var statement = "DELETE FROM usuario_comenta_libro WHERE idComentario = " + mysql.escape(idToDelte) + ";";
            
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
    