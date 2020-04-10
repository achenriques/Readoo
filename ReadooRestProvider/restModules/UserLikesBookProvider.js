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
        app.get('/userLikesBook', function (req, res) {
            let userLikesBook = this.userLikesBookDao.getAllUsersLikes();
            if (Number.isNaN(userLikesBook)) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(userLikesBook));
                //res.json(userLikesBook);
            } else {
                // Sql Err
                let reqError = functions.getRequestError(userLikesBook);
                res.status(reqError.code)
                    .send(reqError.text);
            }
        });
    }

    getOne(app) {
        app.get('/userLikesBook/:id', middleware.verifyToken, function (req, res) {
            let userId = req.params.id;
            console.log("Estoy getteando " + userId);
            if (userId)
            {
                let userLikesBook = this.userLikesBookDao.oneUserLike(+userId);
                if (Number.isNaN(userLikesBook)) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(userLikesBook));
                    //res.json(userLikesBook);
                } else {
                    // Sql Err
                    let reqError = functions.getRequestError(userLikesBook);
                    res.status(reqError.code)
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                .send('Missed Id');
            }
        });
    }

    getOneLike(app) {
        app.get('/userLikesBook/:userId/:bookId', middleware.verifyToken, function (req, res) {
            let userId = req.params.userId;
            let bookId = req.params.bookId
            console.log("Estoy getteando " + userId);
            if (userId && bookId)
            {
                let userLikesBook = this.userLikesBookDao.oneUserBookLike(+userId, +bookId);
                if (Number.isNaN(userLikesBook)) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(userLikesBook));
                    //res.json(userLikesBook);
                } else {
                    // Sql Err
                    let reqError = functions.getRequestError(userLikesBook);
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
        app.post('/userLikesBook', middleware.verifyToken, function (req, res) {
            let userLikesBook = req.body.userLikesBook;
            console.log("Estoy insertando gusto de usuario" + userLikesBook);
            if (userLikesBook && userLikesBook.userId && userLikesBook.bookId) {
                let newUserLikeId = this.userLikesBookDao.insertOrUpdateUserLike(+userLikesBook.userId, userLikesBook.bookId);
                if (Number.isInteger(newUserLikeId) && newUserLikeId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(newUserLikeId);
                } else {
                    let reqError = functions.getRequestError(newUserLikeId);
                    res.status(reqError.code)        
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }

    modifyOne(app) {
        app.put('/userLikesBook', function (req, res) {
            let like = req.body.like;
            console.log("Estoy modificando " + like);
            if (like && like.userId && like.bookId && like.like != null) {
                let newUpdatedLikeId = this.userLikesBookDao.updateUserBookLike(+like.userId && +like.bookId && like.like);
                if (Number.isInteger(newUpdatedLikeId) && newUpdatedLikeId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(newUpdatedLikeId);
                } else {
                    let reqError = functions.getRequestError(newUpdatedLikeId);
                    res.status(reqError.code)        
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }

    deleteOne(app) {
        app.delete('/userLikesBook', function (req, res) {
            let like = req.body.like;
            console.log("Estoy deleteando " + like.userId + ", " + like.bookId);
            if (like && like.userId && like.bookId) {
                let oldUserLikeId = this.userLikesBookDao.deleteUserLikes(+userId, +bookId);
                if (Number.isInteger(oldUserLikeId) && oldUserLikeId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(oldUserLikeId);
                } else {
                    let reqError = functions.getRequestError(oldUserLikeId);
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

module.exports = UserLikesBookProvider;
