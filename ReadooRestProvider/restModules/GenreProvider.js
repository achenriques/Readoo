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
        app.get('/genre', function (req, res) {
            let genres = this.genreDao.getAllGenres();
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
            let genreId = req.params.id;
            console.log("Estoy getteando " + genreId);
            if (genreId) {
                let genre = this.genreDao.getOneGenre(+genreId);
                if (Number.isNaN(genre)) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(genre));
                    //res.json(genre);
                } else {
                    // Sql Err
                    let reqError = functions.getRequestError(genre);
                    res.status(reqError.code)
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }

    insertOne(app) {
        app.post('/genre', function (req, res) {
            let genre = req.body.genre;
            console.log("Estoy insertando categoria de usuario" + genre);
            if (genre) {
                let newGenreId = this.genreDao.addGenre(genre.trim());
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

    deleteOne(app) {
        app.delete('/genre', function (req, res) {
            let genreId = req.body.genre;
            console.log("Estoy deleteando " + genreId);
            if (genreId) {
                let oldGenreId = this.genreDao.deleteOne(genreId);
                if (Number.isInteger(oldGenreId) && oldGenreId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(oldGenreId);
                } else {
                    let reqError = functions.getRequestError(oldGenreId);
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
