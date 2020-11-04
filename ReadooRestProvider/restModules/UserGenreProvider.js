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
                    console.error(err);
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
            if (userId) {
                that.userGenreDao.oneUsersGenres(+userId).then(
                    function (result) {
                        res.setHeader('Content-Type', 'application/json');
                        return res.send(JSON.stringify(result));
                    }
                ).catch(
                    function (err) {
                        // Sql Err
                        console.error(err);
                        let reqError = functions.getRequestError(err);
                        return res.status(reqError.code)
                            .send(reqError.text);
                    }
                );
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                .send('Missed Id');
            }
        });
    }

    insertOrUpdate(app) {
        const that = this;
        app.post('/userGenre', middleware.verifyToken, function (req, res) {
            let userGenre = req.body.userGenre;
            if (userGenre && userGenre.userId && userGenre.genreIds) {
                let newUserGenreId = that.userGenreDao.updateGenres(+userGenre.userId, userGenre.genreIds);
                if (Number.isInteger(newUserGenreId) && newUserGenreId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json(newUserGenreId);
                } else {
                    console.error(err);
                    let reqError = functions.getRequestError(newUserGenreId);
                    return res.status(reqError.code)        
                        .send(reqError.text);
                }
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }

    deleteOne(app, db) {
        const that = this;
        app.delete('/userGenre', middleware.verifyToken, function (req, res) {
            let userId = req.body.userId;
            if (userId) {
                let oldUserGenreId = that.userGenreDao.deleteUserGenres(+userId);
                if (Number.isInteger(oldUserGenreId) && oldUserGenreId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json(oldUserGenreId);
                } else {
                    console.error(err);
                    let reqError = functions.getRequestError(oldUserGenreId);
                    return res.status(reqError.code)
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
