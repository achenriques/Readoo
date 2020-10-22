const path = require('path');
const constants = require('../util/constants');
const functions = require('../util/functions');
const middleware = require('./middlewares');
const ChatDao = require('../daos/ChatDao');
const resizeToIcon = require('../util/imageFormater').resizeToIcon;

class CommentProvider {
    
    constructor(app, db)
    {
        this.chatDao = new ChatDao(db);
        this.getAll(app);       //Get
        this.getHistory(app);   //Get
        this.getBunch(app);     //Get
        this.insertOne(app);    //Post
        this.deleteOne(app);    //Delete
    }
    
    getAll(app) {
        const that = this;
        app.get('/chat', function (req, res) {
            that.chatDao.getAll().then(
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

    getHistory(app) {
        const that = this;
        app.get('/chatHistory/', middleware.verifyToken, function (req, res) {
            let userId = req.params.id;
            console.log("Estoy getteando chat history" + userId);     
            if (+userId) {
                that.chatDao.getChatHistory(+userId).then(
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
        app.get('/chatMessages/:id', middleware.verifyToken, function (req, res) {
            let chatId = req.params.id;
            console.log("Estoy getteando " + chatId);     
            if (+chatId) {
                that.chatDao.getChatById(+chatId).then(
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

    deleteOne(app) {
        const that = this;
        app.delete('/chat', function (req, res) {
            console.log("Estoy deleteando " + req.body.id);
            let chatId = req.body.chatId;
            if (chatId) {
                that.bookDao.deleteBook(+chatId).then(
                    function (result) {
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(200).json(result);
                    }
                ).catch(
                    function (err) {
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
    