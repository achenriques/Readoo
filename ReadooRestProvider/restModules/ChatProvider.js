const socketIo = require('socket.io');
const path = require('path');
const functions = require('../util/functions');
const middleware = require('./middlewares');
const ChatDao = require('../daos/ChatDao');
const resizeToIcon = require('../util/imageFormater').resizeToIcon;

class ChatProvider {
    
    constructor(app, server, db)
    {
        this.chatDao = new ChatDao(db);
        this.getAll(app);       // Get
        this.getHistory(app);   // Get
        this.getBunch(app);     // Get
        this.deleteOne(app);    // Delete

        this.io = socketIo(server, {
            path: '/chat'
        });

        this.io.on('connection', (socket) => {
            console.log(socket);
            console.log('a user connected');
            socket.emit("socketId", socket.id);

            // resend message to other client
            socket.on("newMessage", (message) => {
                this.arrivedMessage(message); 
                socket.emit('message', message);
            });

            // disconect handler...
            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });
        
    }

    emitError(error) {
        if (!this.io.disconnect) {
            if (error !== undefined) {
                let reqError = functions.getRequestError(error);
                this.io.emit("error", reqError.text);
            } else {
                this.io.emit("error", "");
            }            
        }
    }

    saveMessage(chatMessage) {
        this.chatDao.saveOne(+chatMessage.chatId, +chatMessage.userIdFrom, chatMessage.message).then(function(result) {
            if (result.affectedRows === 0) {
                this.emitError();
            }
        }).catch(function(err) {
            console.error(err);
            this.emitError(err);
        });
    }

    arrivedMessage(chatMessage) {
        if (chatMessage && chatMessage.message !== undefined) {
            let msgText = "" + chatMessage.message;
            if (msgText.trim().length > 0) {
                let chatId = chatMessage.chatId;
                if (chatId !== undefined && chatId > 0) {
                    // in chat history
                    this.saveMessage(chatMessage);
                } else {
                    // not in chat history. Must insert
                    if (+chatMessage.userIdFrom !== +chatMessage.userIdTo) {
                        const that = this;
                        this.chatDao.insertOne(+chatMessage.userIdFrom, +chatMessage.userIdTo).then(function(result) {
                            if (result.affectedRows > 0) {
                                // set a new id before save message
                                chatMessage.chatId = +result.insertId;
                                that.saveMessage(chatMessage);
                                that.io.emit("newChatId", result.insertId);
                            }
                        }).catch(function(err) {
                            console.error(err);
                            this.emit(err);
                        });
                    } else {
                        console.error("Chat not allowed! User is repeated.");
                    }
                }
            }
        }
    }
    
    resizeImage (avatarFile, chatHistoryItem, channelDirection) {
        if (avatarFile) {
            return resizeToIcon(avatarFile).then(function (base64String) {
                if (base64String) {
                    chatHistoryItem[channelDirection] = base64String;
                } else {
                    chatHistoryItem[channelDirection] = null;
                }       
            }).catch(function (err) {
                console.error(err);
                chatHistoryItem[channelDirection] = null;
            });
        } else {
            console.warn('Avatar image not found: ' + avatar);
            return Promise.resolve();
        }
    }

    parseProfileImages (chatHistory) {
        if (chatHistory) {
            let promiseList = []
            chatHistory.forEach(function(c, index, rSet) {
                let avatarFile = path.resolve('./ReadooRestProvider/uploads/userAvatars/' + c.userAvatarUrlFrom);
                promiseList.push(this.resizeImage(avatarFile, c, 'userAvatarUrlFrom'));
                avatarFile = path.resolve('./ReadooRestProvider/uploads/userAvatars/' + c.userAvatarUrlTo);
                promiseList.push(this.resizeImage(avatarFile, c, 'userAvatarUrlTo'));
            }.bind(this));
            return Promise.all(promiseList).then(function (promisesResult) {
                return chatHistory;
            }).catch(function (err) {
                console.error(err);
            });
        } else {
            return Promise.resolve(chatHistory);
        }
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
                    console.error(err);
                    let reqError = functions.getRequestError(err);
                    return res.status(reqError.code)
                        .send(reqError.text);
                }
            );
        });
    }

    getHistory(app) {
        const that = this;
        app.get('/chatHistory', middleware.verifyToken, function (req, res) {
            let userId = req.query.userId;
            if (+userId) {
                that.chatDao.getHistory(+userId).then(
                    function (result) {
                        that.parseProfileImages.bind(that)(result).then(function (resultOfParse) {
                            return res.header('Content-Type', 'application/json').status(200).json(result);
                        }); 
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


    getBunch(app) {
        const that = this;
        app.get('/chatMessages/', middleware.verifyToken, function (req, res) {
            let chatId = req.query.chatId;
            let userId = req.query.userId;
            if (+chatId, +userId) {
                that.chatDao.getChatById(+chatId, +userId).then(
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
        app.delete('/chat', function (req, res) {
            let chatId = req.body.chatId;
            let userId = req.body.userId;
            if (chatId, userId) {
                that.chatDao.getVisibility(+chatId).then(
                    function (result) {
                        let newVisibility;
                        if (result[0].chatVisible === 'B') {
                            newVisibility = (+result[0].userIdFrom === userId) ? 'T' : 'F';
                        } else {
                            newVisibility = 'N';
                        }
                        if (newVisibility !== result[0].chatVisible) {
                            that.chatDao.updateVisibility(+chatId, newVisibility).then(
                                function (result) {
                                    res.setHeader('Content-Type', 'application/json');
                                    return res.status(200).json(result.message);
                                });
                        } else {
                            res.setHeader('Content-Type', 'application/json');
                            return res.status(201).json(result.message);    // Acepted but not changed
                        }
                    }
                ).catch(
                    function (err) {
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
    };
    
}

module.exports = ChatProvider;
    