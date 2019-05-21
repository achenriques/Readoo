const constantes = require('../util/constants');
const CommentDao = require('../daos/CommentDao');
const middleware = require('./middlewares');

class CommentProvider {
    
    commentDao = null;

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
    
    getAll(app)
    {
        app.get('/commentary', function (req, res) {
            let commentaries = this.commentDao.getAllCommentary();
            if (Number.isNaN(commentaries)) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(commentaries));
                //res.json(commentaries);
            } else {
                // Sql Err
                let reqError = functions.getRequestError(commentaries);
                res.status(reqError.code)        // HTTP status 204: NotContent
                    .send(reqError.text);
            }
        });
    }

    getOne(app) {
        app.get('/commentary/:id', middleware.verifyToken, function (req, res) {
            let bookId = req.params.id;
            console.log("Estoy getteando " + bookId);     
            if (bookId) {
                let commentaries = this.commentDao.getCommentaryById(+bookId);
                if (Number.isNaN(commentaries)) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(newBookId);
                } else {
                    let reqError = functions.getRequestError(commentaries);
                    res.status(reqError.code)        // HTTP status 204: NotContent
                        .send(reqError.text);
                }
            }
            
        });
    }

    getSubs(app) {
        app.get('/commentary/:id/:commentId', middleware.verifyToken, function (req, res) {
            let bookId = req.params.id;
            let fatherCommentId = req.params.commentId;
            console.log("Estoy getteando " + bookId);     
            if (bookId && fatherCommentId) {
                let commentaries = this.commentDao.getSubCommentaries(+bookId, +fatherCommentId);
                if (Number.isNaN(commentaries)) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(commentaries);
                } else {
                    let reqError = functions.getRequestError(commentaries);
                    res.status(reqError.code)        // HTTP status 204: NotContent
                        .send(reqError.text);
                }
            }
        });
    }

    getBunch(app) {
        app.post('/commentary/fetch', middleware.verifyToken, function (req, res) {
            let bookId = req.body.bookId;
            let numberOfCommentaries = req.body.numberOfCommentaries;
            let lastDate = req.body.lastDate;
            console.log("Estoy cogiendo comentario " + bookId);     
            if (bookId) {
                let commentaries = this.commentDao.bunchOfCommentaries(+bookId, lastDate, constantes.maxComentarios)     
                if (Number.isNaN(commentaries)) {
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(toRet);
                } else {
                    let reqError = functions.getRequestError(commentaries);
                    res.status(reqError.code)        // HTTP status 204: NotContent
                        .send(reqError.text);
                }
            }
        });
    }

    insertOne(app, db) {
        app.post('/commentary/new', middleware.verifyToken, function (req, res) {
            let commentary = req.body.comentario;
            console.log("Estoy insertando comentario " + commentary);     
            if (commentary && commentary.userId && commentary.bookId && commentary.commentary) {
                let newCommentId = this.commentDao.newCommentary(+commentary.userId, +commentary.bookId, 
                        commentary.commentary, +commentary.commentFatherId);
                if (Number.isInteger(newCommentId) && newCommentId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(newCommentId);
                } else {
                    let reqError = functions.getRequestError(newCommentId);
                    res.status(reqError.code)        // HTTP status 204: NotContent
                        .send(reqError.text);
                }
            }
       });
    }
    
    dissableOne(app) {
        app.post('/dissableCommentary', middleware.verifyToken, function (req, res) {
        console.log("Estoy deshabilitando libro");
        let commentaryId = req.body.id;
        if (commentaryId) {
            let oldCommentaryId = this.commentDao.dissableCommentary(+oldCommentaryId);
            if (Number.isInteger(oldCommentaryId) && oldCommentaryId > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(oldCommentaryId);
            } else {
                let reqError = functions.getRequestError(oldCommentaryId);
                res.status(reqError.code)        // HTTP status 204: NotContent
                    .send(reqError.text);
                }
            }
        });
    }

    deleteOne(app, db) {
        app.delete('/commentary', middleware.verifyToken, function (req, res) {
            console.log("Estoy deleteando " + req.body.id);
            let commentaryId = req.body.id;
            if (commentaryId) {
                let oldCommentary = this.commentDao.deleteOne(+commentaryId);
                if (Number.isInteger(oldCommentary) && oldCommentary > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(oldCommentary);
                } else {
                    let reqError = functions.getRequestError(oldCommentary);
                    res.status(reqError.code)        // HTTP status 204: NotContent
                        .send(reqError.text);
                }
            }
        });
    };
    
}

module.exports = CommentProvider;
    