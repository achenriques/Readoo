const functions = require('../util/functions');
const middleware = require('./middlewares');
const UserLikesBookDao = require('../daos/UserLikesBookDao');

class UserLikesBookProvider {

    constructor(app, db) {
        this.userLikesBookDao = new UserLikesBookDao(db);
        this.getAll(app);           //Get
        this.getOne(app);       //Get
        this.getOneLike(app);       //Get
        this.modifyOne(app);        //Put Probablemente inutil. Solo borrado o insert
        this.insertOrUpdate(app);   // Post
        this.deleteOne(app);        //Delete   
    }

    getAll(app, db) {
        const that = this;
        app.get('/userLikesBook', function (req, res) {
           that.userLikesBookDao.getAllUsersLikes().then(
                function (result) {
                    return res.header('Content-Type', 'application/json').send(JSON.stringify(userLikesBook));
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
        app.get('/userLikesBook/:id', middleware.verifyToken, function (req, res) {
            let userId = req.params.id;
            if (userId) {
                that.userLikesBookDao.oneUserLike(+userId).then(
                    function (result) {
                        return res.header('Content-Type', 'application/json').send(JSON.stringify(userLikesBook));
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
                res.status(400)        // HTTP status 400: BadRequest
                .send('Missed Id');
            }
        });
    }

    getOneLike(app) {
        const that = this;
        app.get('/userLikesBook/:userId/:bookId', middleware.verifyToken, function (req, res) {
            let userId = req.params.userId;
            let bookId = req.params.bookId
            if (userId && bookId) {
                that.userLikesBookDao.oneUserBookLike(+userId, +bookId).then(
                    function (result) {
                        return res.header('Content-Type', 'application/json').send(JSON.stringify(result));
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
                res.status(400)        // HTTP status 400: BadRequest
                .send('Missed Id');
            }
        });
    }

    insertOrUpdate(app) {
        const that = this;
        app.post('/userLikesBook', middleware.verifyToken, function (req, res) {
            let userLikesBook = req.body;
            if (userLikesBook && userLikesBook.userId && userLikesBook.bookId) {
                that.userLikesBookDao.insertOrUpdateUserLike(+userLikesBook.userId, userLikesBook.bookId).then(
                    function (result) {
                        return res.header('Content-Type', 'application/json').send(JSON.stringify(result));
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
                res.status(400)        // HTTP status 400: BadRequest
                .send('Missed Id');
            }
        });
    }

    modifyOne(app) {
        const that = this;
        app.put('/userLikesBook', function (req, res) {
            let like = req.body.like;
            if (like && like.userId && like.bookId && like.like != null) {
                that.this.userLikesBookDao.updateUserBookLike(+like.userId, +like.bookId, like.like).then(
                    function (result) {
                        return res.header('Content-Type', 'application/json').send(JSON.stringify(result));
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
                res.status(400)        // HTTP status 400: BadRequest
                .send('Missed Id');
            }
        });
    }

    deleteOne(app) {
        const that = this;
        app.delete('/userLikesBook', function (req, res) {
            let like = req.body;
            if (like && like.userId && like.bookId) {
                that.userLikesBookDao.deleteUserLikes(+like.userId, +like.bookId).then(
                    function (result) {
                        return res.header('Content-Type', 'application/json').send(JSON.stringify(result));
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
                res.status(400)        // HTTP status 400: BadRequest
                .send('Missed Id');
            }
        });
    }

}

module.exports = UserLikesBookProvider;
