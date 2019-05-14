const middleware = require('./middlewares');
const UserGenreDao = require('../daos/UserGenreDao');

class UserGenreProvider {

    userGenreDao = null;

    constructor(app, db) {
        this.userGenreDao = new UserGenreDao(db);
        this.getAll(app);           //Get
        this.getOne(app);           //Get
        this.deleteOne(app);        //Delete
        this.insertOrUpdate(app);   // Post
    }

    getAll(app) {
        app.get('/userGenre', function (req, res) {
            let userGenres = this.userGenreDao.getAllUserGenre();
            if (Number.isNaN(userGenres)) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(userGenres));
                //res.json(userGenres);
            } else {
                // Sql Err
                let reqError = functions.getRequestError(userGenres);
                res.status(reqError.code)
                    .send(reqError.text);
            }
        });
    }

    getOne(app) {
        app.get('/userGenre/:id', middleware.verifyToken, function (req, res) {
            let userId = req.params.id;
            console.log("Estoy getteando " + userId);
            if (userId)
            {
                let usersGenres = this.userGenreDao.oneUsersGenres(+userId);
                if (Number.isNaN(usersGenres)) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(usersGenres));
                    //res.json(usersGenres);
                } else {
                    // Sql Err
                    let reqError = functions.getRequestError(usersGenres);
                    res.status(reqError.code)
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                .send('Missed Id');
            }
        });
    }

    insertOrUpdate(app) {
        app.post('/userGenre', middleware.verifyToken, function (req, res) {
            let userGenre = req.body.userGenre;
            console.log("Estoy insertando categoria de usuario" + userGenre);
            if (userGenre && userGenre.userId && userGenre.genreIds) {
                let newUserGenreId = this.userGenreDao.updateGenres(+userGenre.userId, userGenre.genreIds);
                if (Number.isInteger(newUserGenreId) && newUserGenreId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(newUserGenreId);
                } else {
                    let reqError = functions.getRequestError(newUserGenreId);
                    res.status(reqError.code)        
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }

    deleteOne(app, db) {
        app.delete('/userGenre', middleware.verifyToken, function (req, res) {
            let userId = req.body.userId;
            console.log("Estoy deleteando " + userId);
            if (userId) {
                let oldUserGenreId = this.userGenreDao.deleteUserGenres(+userId);
                if (Number.isInteger(oldUserGenreId) && oldUserGenreId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(oldUserGenreId);
                } else {
                    let reqError = functions.getRequestError(oldUserGenreId);
                    res.status(reqError.code)
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }

}

module.exports = UserGenreProvider;
