const path = require('path');
const constants = require('../util/constants');
const functions = require('../util/functions');
const middleware = require('./middlewares');
const CommentDao = require('../daos/CommentDao');

class CommentProvider {
    
    constructor(app, db)
    {
        this.commentDao = new CommentDao(db);
        this.getAll(app);       //Get
        this.getOne(app);       //Get
        this.getBunch(app);     //Post
        this.getSubs(app);      //Post
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
                        let principalIds = [];
                        resultSet.forEach(function(c, index, rSet) {
                            // Parse the image
                            if (c.userAvatarUrl != null && c.userAvatarUrl.length !== 0) {
                                let file = path.resolve('./ReadooRestProvider/uploads/userAvatars/' + c.userAvatarUrl);
                                if (file) {
                                    c.userAvatarUrl = 'data:image/png;base64, ' + functions.base64_encode(file);
                                }
                            }

                            principalIds.push(c.commentId);

                            toRet.push({
                                commentId: c.commentId, 
                                commentText: c.commentText, 
                                userId: c.userId,
                                userNick: c.userNick,
                                userAvatarUrl: c.userAvatarUrl, 
                                bookId: c.bookId, 
                                date: c.commentDate,
                                commentFatherId: null,
                                nSubCommentaries: 0,
                                subCommentaries: []
                            });
                        });

                        if (principalIds.length) {
                            that.commentDao.getNumberOfSubCommentaries(principalIds).then(
                                function (resultSet2) {
                                    resultSet2.forEach(function(nC, index, rSet) {
                                        // Parse the image
                                        let principalCommentary = toRet.find(function(principalCommentary) {
                                            return principalCommentary.commentId == nC.commentFatherId;
                                        });
    
                                        if (principalCommentary != null) {
                                            principalCommentary.nSubCommentaries = nC.nAnswers;
                                        }
                                    });
                                    return res.header('Content-Type', 'application/json').status(200).json(toRet);
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
                            return res.header('Content-Type', 'application/json').status(200).json(toRet);
                        }
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
        app.post('/commentary/fetchSubs', middleware.verifyToken, function (req, res) {
            let bookId = req.body.bookId;
            let fatherId = req.body.fatherCommentaryId;
            let lastDate = req.body.lastDate;
            console.log("Estoy cogiendo comentario " + bookId);     
            if (bookId, fatherCommentaryId) {
                that.commentDao.getBunchOfSubCommentaries(+bookId, [+fatherId], lastDate, constants.MAX_COMMENTARIES).then(
                    function (resultSet) {
                        // Commentaries are prcessed to group their children
                        let toRet = [];
                        resultSet.forEach(function(c, index, rSet) {
                            // Parse the image
                            if (c.userAvatarUrl != null && c.userAvatarUrl.length !== 0) {
                                let file = path.resolve('./ReadooRestProvider/uploads/userAvatars/' + c.userAvatarUrl);
                                if (file) {
                                    c.userAvatarUrl = 'data:image/png;base64, ' + functions.base64_encode(file);
                                }
                            }

                            toRet.push({
                                commentId: c.commentId, 
                                commentText: c.commentText, 
                                userId: c.userId,
                                userNick: c.userNick,
                                userAvatarUrl: c.userAvatarUrl, 
                                bookId: c.bookId, 
                                date: c.commentDate,
                                commentFatherId: c.commentFatherId,
                                subCommentaries: []
                            });
                        });
                        return res.header('Content-Type', 'application/json').status(200).json(toRet);
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
            let commentInfo = req.body;
            console.log("Estoy insertando comentario " + commentInfo);     
            if (commentInfo && commentInfo.userId && commentInfo.bookId && commentInfo.commentText) {
                that.commentDao.addCommentary(+commentInfo.userId, +commentInfo.bookId, 
                    commentInfo.commentText, (commentInfo.commentFatherId != null) ? +commentInfo.commentFatherId : null).then(
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
    