//IF NEDED...   const mysql = require('mysql');

class CategoriaProvider {

    constructor(app, db) {
        this.getAll(app, db);    //Get
        this.getOne(app, db); //Get
        this.deleteOne(app, db);  //Delete
        this.insertOne(app, db); // Post
    }

    getAll(app, db) {
        app.get('/categoria', function (req, res) {
            var con = db.getConn(db.connect).then(function (response) {
                response.query("SELECT * FROM categoria", function (err, result, fields) {
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

    getOne(app, db) {
        app.get('/usuariocategoria/:id', function (req, res) {
            var idCategoria = req.params.id;
            console.log("Estoy getteando " + idCategoria);
            if (idCategoria) {
                var con = db.getConn(db.connect).then(function (response) {
                    response.query("SELECT * FROM categoria WHERE _idCategoria =" + db.escape(idCategoria) + ";", function (err, result, fields) {
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
            } else {
                res.status(404)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }

    insertOne(app, db) {
        app.post('/categoria', function (req, res) {
            var categoria = req.body.categoria;
            console.log("Estoy insertando categoria de usuario" + categoria);
            if (categoria) {
                console.log("Estoy insertando categoria de usuario" + categoria);
                for (var i in categoria) {
                    console.log(categoria[i]);
                }

                var con = db.getConn(db.connect).then(function (response) {
                    var statement = "INSERT INTO categoria VALUES (0, " + db.escape(categoria.tipo) + ");";

                    response.query(statement, function (err, result) {
                        response.release();
                        if (err) {
                            if (err.code == 'ER_DUP_ENTRY') {
                                console.log(err);
                                res.status(206)        // HTTP status 206: Duplicated entry
                                    .send('Duplicated Entry');
                            } else {
                                console.log(err);
                                res.status(204)        // HTTP status 204: NotContent
                                    .send('Failed at consult');
                            }
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
            }
        });
    }

    deleteOne(app, db) {
        app.delete('/categoria', function (req, res) {
            var categoria = req.body.categoria;
            console.log("Estoy deleteando " + categoria);
            var con = db.getConn(db.connect).then(function (response) {
                var statement = "DELETE FROM categoria WHERE idCategoria = " +
                    db.escape(categoria.idCategoria) /*+ " AND Categoria_idCategoria = " + 
          usuariocategoria.idCategoria */+ ";";

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
    };
}

module.exports = CategoriaProvider;
