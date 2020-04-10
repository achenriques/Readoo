const functions = require('../util/functions');
const middleware = require('./middlewares');
const UserGenreDao = require('../daos/UserGenreDao');

class UserGenreProvider {

    constructor(app, db) {
        this.userGenreDao = new UserGenreDao(db);
        this.getAll(app);           //Get
        this.getOne(app);           //Get
        this.deleteOne(app);        //Delete
        this.insertOrUpdate(app);   // Post
    }

    getAll(app) {
        const that = this;
        app.get('/userGenre', function (req, res) {
            that.userGenreDao.getAllUserGenre().then(
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
        app.get('/userGenre/:id', middleware.verifyToken, function (req, res) {
            let userId = req.params.id;
            console.log("Estoy getteando " + userId);
            if (userId) {
                that.userGenreDao.oneUsersGenres(+userId).then(
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
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                .send('Missed Id');
            }
        });
    }

    insertOrUpdate(app) {
        const that = this;
        app.post('/userGenre', middleware.verifyToken, function (req, res) {
            let userGenre = req.body.userGenre;
            console.log("Estoy insertando categoria de usuario" + userGenre);
            if (userGenre && userGenre.userId && userGenre.genreIds) {
                let newUserGenreId = that.userGenreDao.updateGenres(+userGenre.userId, userGenre.genreIds);
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
        const that = this;
        app.delete('/userGenre', middleware.verifyToken, function (req, res) {
            let userId = req.body.userId;
            console.log("Estoy deleteando " + userId);
            if (userId) {
                let oldUserGenreId = that.userGenreDao.deleteUserGenres(+userId);
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
