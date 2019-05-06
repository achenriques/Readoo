//IF NEDED...   const mysql = require('mysql');

class UsuarioCategoriaProvider {
    
      constructor(app, db)
      {
        this.getAll(app,db);    //Get
        this.getOne(app, db); //Get
        this.deleteOne(app, db);  //Delete
        this.insertOne(app, db); // Post
      }
    
      getAll(app, db)
      {
        app.get('/usuariocategoria', function (req, res) {
          var con = db.getConn(db.connect).then(function(response)
          {
            response.query("SELECT * FROM usuario_categoria", function (err, result, fields) {
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
        app.get('/usuariocategoria/:id', function (req, res) 
        {
            var idusuario = req.params.id;
            console.log("Estoy getteando " + idusuario);     
            if (idusuario)
            {
                var con = db.getConn(db.connect).then(function(response)
                {
                    response.query("SELECT * FROM usuario_categoria WHERE Usuario_idUsuario =" + db.escape(idusuario) + ";", function (err, result, fields) {
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
        app.post('/usuariocategoria', function (req, res) {
            var usuariocategoria = req.body.usuariocategoria;
            console.log("Estoy insertando categoria de usuario" + usuariocategoria);     
            if (usuariocategoria)
            {
                console.log("Estoy insertando categoria de usuario" + usuariocategoria); 
                for (var i in usuariocategoria) {
                    console.log(usuariocategoria[i]);
                }
        
                usuariocategoria.idCategoria.forEach(idsCategoria => {
                var con = db.getConn(db.connect).then(function(response)
                {
                    var statement = "INSERT INTO usuario_categoria VALUES (" + db.escape(usuariocategoria.idUsuario) + ", " + 
                    db.escape(idsCategoria) + ");";
        
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
              });
            }
       });
      }
    
      deleteOne(app, db)
      {
        app.delete('/usuariocategoria', function (req, res) {
          var usuariocategoria = req.body.usuariocategoria;
          console.log("Estoy deleteando " + usuariocategoria);
          var con = db.getConn(db.connect).then(function(response)
          {
            var statement = "DELETE FROM usuario_categoria WHERE Usuario_idUsuario = " + 
            db.escape(usuariocategoria.idUsuario) /*+ " AND Categoria_idCategoria = " + 
            usuariocategoria.idCategoria */+ ";";

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
    
    module.exports = UsuarioCategoriaProvider;
    