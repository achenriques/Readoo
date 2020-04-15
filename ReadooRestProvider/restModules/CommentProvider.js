const constants = require('../util/constants');
const functions = require('../util/functions');
const CommentDao = require('../daos/CommentDao');
const middleware = require('./middlewares');

class CommentProvider {
    
    constructor(app, db)
    {
        this.commentDao = new CommentDao(db);
        this.getAll(app);       //Get
        this.getOne(app);       //Get
        this.getSubs(app);      //Get
        this.getBunch(app);     //Post
        this.deleteOne(app);    //Delete
        this.dissableOne(app);  //Post
        this.insertOne(app);    //Post
    }
    
    getAll(app) {
        const that = this;
        app.get('/commentary', function (req, res) {
            that.commentDao.getAllCommentary().then(
                function (result) {
                    return res.header('Content-Type', 'application/json').send(JSON.stringify(result));
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
        app.get('/commentary/:id', middleware.verifyToken, function (req, res) {
            let bookId = req.params.id;
            console.log("Estoy getteando " + bookId);     
            if (bookId) {
                that.commentDao.getCommentaryById(+bookId).then(
                    function (result) {
                        return res.header('Content-Type', 'application/json').send(JSON.stringify(result));
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

    getSubs(app) {
        const that = this;
        app.get('/commentary/:id/:commentId', middleware.verifyToken, function (req, res) {
            let bookId = req.params.id;
            let fatherCommentId = req.params.commentId;
            console.log("Estoy getteando " + bookId);     
            if (bookId && fatherCommentId) {
                that.commentDao.getSubCommentaries(+bookId, +fatherCommentId).then(
                    function (result) {
                        return res.header('Content-Type', 'application/json').send(JSON.stringify(result));
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

    getBunch(app) {
        const that = this;
        app.post('/commentary/fetch', middleware.verifyToken, function (req, res) {
            let bookId = req.body.bookId;
            let lastDate = req.body.lastDate;
            console.log("Estoy cogiendo comentario " + bookId);     
            if (bookId) {
                that.commentDao.getBunchOfCommentaries(+bookId, lastDate, constants.MAX_COMMENTARIES).then(
                    function (resultSet) {
                        // Commentaries are prcessed to group their children
                        let toRet = [];
                        resultSet.forEach(function(c, index, rSet) {
                            let commentaryToRet = toRet.find(function(comment) {
                                return comment.commentId === c.commentId;
                            });
                            if (commentaryToRet !== undefined) {
                                // If the commentary exits in toRet array thats means the
                                //  id is unique so we only have to add the new subComments...
                                commentaryToRet.subcommentaries.push({
                                    commentId: c.commentId2, 
                                    userId: c.userId2, 
                                    bookId: c.bookId, 
                                    date: c.commentDate2,
                                    userAvatarUrl: c.userAvatarUrl2, 
                                    commentFatherId: null,
                                    subcommentaries: []
                                });
                            } else {
                                toRet.push({
                                    commentId: c.commentId, 
                                    userId: c.userId, 
                                    bookId: c.bookId, 
                                    date: c.commentDate,
                                    userAvatarUrl: c.userAvatarUrl, 
                                    commentFatherId: c.commentFatherId,
                                    subcommentaries: (c.commentId2 != null) ? [{
                                        commentId: c.commentId2, 
                                        userId: c.userId2, 
                                        bookId: c.bookId, 
                                        date: c.commentDate2,
                                        userAvatarUrl: c.userAvatarUrl2, 
                                        commentFatherId: null,
                                        subcommentaries: null
                                    }] : []
                                });
                            }
                        });
                        return res.header('Content-Type', 'application/json').send(JSON.stringify(toRet));
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

    insertOne(app, db) {
        const that = this;
        app.post('/commentary/new', middleware.verifyToken, function (req, res) {
            let commentary = req.body.comentario;
            console.log("Estoy insertando comentario " + commentary);     
            if (commentary && commentary.userId && commentary.bookId && commentary.commentary) {
                that.commentDao.addCommentary(+commentary.userId, +commentary.bookId, 
                        commentary.commentary, +commentary.commentFatherId).then(
                    function (result) {
                        return res.header('Content-Type', 'application/json').send(JSON.stringify(result));
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
    
    dissableOne(app) {
        const that = this;
        app.post('/dissableCommentary', middleware.verifyToken, function (req, res) {
            console.log("Estoy deshabilitando libro");
            let commentaryId = req.body.id;
            if (commentaryId) {
                that.commentDao.dissableCommentary(+oldCommentaryId).then(
                    function (result) {
                        return res.header('Content-Type', 'application/json').send(JSON.stringify(result));
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

    deleteOne(app, db) {
        const that = this;
        app.delete('/commentary', middleware.verifyToken, function (req, res) {
            console.log("Estoy deleteando " + req.body.id);
            let commentaryId = req.body.id;
            if (commentaryId) {
                that.commentDao.deleteOne(+commentaryId).then(
                    function (result) {
                        return res.header('Content-Type', 'application/json').send(JSON.stringify(result));
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
    };
    
}

module.exports = CommentProvider;
    