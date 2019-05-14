const middleware = require('./middlewares');
const GenreDao = require('../daos/GenreDao');

class GenreProvider {

    genreDao = null;

    constructor(app, db) {
        this.genreDao = new GenreDao(db);
        this.getAll(app, db);       //Get
        this.getOne(app, db);       //Get
        this.deleteOne(app, db);    //Delete
        this.insertOne(app, db);    // Post
    }

    getAll(app) {
        app.get('/genre', function (req, res) {
            let genres = this.genreDao.getAllBook();
            if (Number.isNaN(genres)) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(genres));
                //res.json(genres);
            } else {
                // Sql Err
                let reqError = functions.getRequestError(genres);
                res.status(reqError.code)
                    .send(reqError.text);
            }
        });
    }

    getOne(app) {
        app.get('/genre/:id', function (req, res) {
            var genreId = req.params.id;
            console.log("Estoy getteando " + genreId);
            if (genreId) {
                let genre = this.genreDao.getOneGenre(+genreId);
                if (Number.isNaN(genre)) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(genre));
                    //res.json(books);
                } else {
                    // Sql Err
                    let reqError = functions.getRequestError(genre);
                    res.status(reqError.code)
                        .send(reqError.text);
                }
            } else {
                res.status(404)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }

    insertOne(db) {
        app.post('/genre', function (req, res) {
            var genre = req.body.genre;
            console.log("Estoy insertando categoria de usuario" + genre);
            if (genre) {
                let newGenreId = this.genreDao.addGenre(genre);
                if (Number.isInteger(newGenreId) && newGenreId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(newGenreId);
                } else {
                    let reqError = functions.getRequestError(newGenreId);
                    res.status(reqError.code)        
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed data');
            }
        });
    }

    deleteOne(db) {
        app.delete('/genre', function (req, res) {
            var genreId = req.body.genre;
            console.log("Estoy deleteando " + genreId);
            if (genreId) {
                let oldBookId = this.bookDao.deleteOne(genreId);
                if (Number.isInteger(oldBookId) && oldBookId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(oldBookId);
                } else {
                    let reqError = functions.getRequestError(oldBookId);
                    res.status(reqError.code)        
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed data');
            }
        });
    };
}

module.exports = GenreProvider;
