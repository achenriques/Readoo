const functions = require('../util/functions');
const middleware = require('./middlewares');
const GenreDao = require('../daos/GenreDao');

class GenreProvider {

    constructor(app, db) {
        this.genreDao = new GenreDao(db);
        this.getAll(app);       //Get
        this.getOne(app);       //Get
        this.deleteOne(app);    //Delete
        this.insertOne(app);    // Post
    }

    getAll(app) {
        const that = this;
        app.get('/genre', function (req, res) {
            that.genreDao.getAllGenre().then(
                function (result) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.send(JSON.stringify(result));
                }
            ).catch(
                function (err) {
                    // Sql Err
                    let reqError = functions.getRequestError(err);
                    return res.status(reqError.code)
                        .send(reqError.text);
                }
            );
        });
    }

    getOne(app) {
        const that = this;
        app.get('/genre/:id', function (req, res) {
            let genreId = req.params.id;
            console.log("Estoy getteando " + genreId);
            if (genreId) {
                that.genreDao.getOneGenre(+genreId).then(
                    function (result) {
                        res.setHeader('Content-Type', 'application/json');
                        if (result.changedRows > 0) {
                            return res.status(200).json(result);
                        } else {
                            // Acepted but no changes commited
                            return res.status(202).json(result);
                        }
                    }
                ).catch(
                    function (err) {
                        let reqError = functions.getRequestError(err);
                        return res.status(reqError.code)        
                            .send(reqError.text);
                    }
                );
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }

    insertOne(app) {
        const that = this;
        app.post('/genre', function (req, res) {
            let genre = req.body.genre;
            console.log("Estoy insertando categoria de usuario" + genre);
            if (genre) {
                that.genreDao.addGenre(genre.trim()).then(
                    function (result) {
                        res.setHeader('Content-Type', 'application/json');
                        if (result.changedRows > 0) {
                            return res.status(200).json(result);
                        } else {
                            // Acepted but no changes commited
                            return res.status(202).json(result);
                        }
                    }
                ).catch(
                    function (err) {
                        let reqError = functions.getRequestError(err);
                        return res.status(reqError.code)        
                            .send(reqError.text);
                    }
                );
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed data');
            }
        });
    }

    deleteOne(app) {
        app.delete('/genre', function (req, res) {
            let genreId = req.body.genre;
            console.log("Estoy deleteando " + genreId);
            if (genreId) {
                this.genreDao.deleteOne(genreId).then(
                    function (result) {
                        res.setHeader('Content-Type', 'application/json');
                        if (result.changedRows > 0) {
                            return res.status(200).json(result);
                        } else {
                            // Acepted but no changes commited
                            return res.status(202).json(result);
                        }
                    }
                ).catch(
                    function (err) {
                        let reqError = functions.getRequestError(err);
                        return res.status(reqError.code)        
                            .send(reqError.text);
                    }
                );
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed data');
            }
        });
    };
}

module.exports = GenreProvider;
