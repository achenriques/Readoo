const functions = require('../util/functions');
const middleware = require('./middlewares');
const LastBookDao = require('../daos/LastBookDao');

class LastBookProvider {
    
    constructor(app, db)
    {
        this.lastBookDao = new LastBookDao(db);
        this.returnErrCode = functions.returnErrCode;
        this.getAll(app);       //Get
        this.getOne(app);       //Get
        this.deleteOne(app);    //Delete
        this.insertOrUpdateOne(app);    // Post
    }
    
    getAll(app) {
        const that = this;
        app.get('/lastBook', function (req, res) {
            let lastBooks = that.lastBookDao.getAllLastBooks().then(function (result) {
                if (result) {
                    return res.status(200).setHeader('Content-Type', 'application/json')
                            .send(JSON.stringify(result));
                }
            }).catch(function (err) {
                console.error(err);
                return that.returnErrCode(err, res);
            });
        });
    }

    getOne(app) {
        const that = this;
        app.get('/lastBook/:id', middleware.verifyToken, function (req, res) 
        {
            let userId = req.params.id;
            console.log("Estoy getteando " + userId);     
            if (userId)
            {
                that.lastBookDao.getLastBook(+userId).then(function (result) {
                    if (result) {
                        return res.status(200).setHeader('Content-Type', 'application/json')
                                .send(JSON.stringify(result));
                    }
                }).catch(function (err) {
                    console.error(err);
                    return that.returnErrCode(err, res);
                });
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                        .send('Missed Id');
            }
        });
    }

    insertOrUpdateOne(app) {
        const that = this;
        app.post('/lastBook', middleware.verifyToken, function (req, res) {
            let lastBook = req.body.lastBook;
            if (lastBook && lastBook.userId && lastBook.bookId && lastBook.genreId) {
                that.lastBookDao.addOrUpdateBook(+lastBook.userId, +lastBook.bookId, +lastBook.genreId).then(function (result) {
                    if (result.affectedRows > 0) {
                        console.log("Saved last book: " + lastBook.userId + "-" + lastBook.bookId + "-" + lastBook.genreId);
                    }
                    return res.status(200).send(true);
                }).catch(function (err) {
                    console.error(err);
                    return that.returnErrCode(err, res);
                });
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                        .send({info: 'failed.save.last.book'});
            }
       });
    }
    
    deleteOne(app) {
        const that = this;
        app.delete('/lastBook', function (req, res) {
            let lastBookId = req.body.id;
            if (lastBookId) {
                that.bookDao.deleteLastBook(+lastBookId).then(function (result) {
                    if (result.affectedRows > 0) {
                        console.log("Deleted last book: " + lastBook.bookId);
                    }
                    return res.status(200).setHeader('Content-Type', 'application/json')
                                .send(true);
                }).catch(function (err) {
                    console.error(err);
                    return that.returnErrCode(err, res);
                });
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                        .send('Missed Data');
            }
        });
    };
    
}
    
module.exports = LastBookProvider;
    