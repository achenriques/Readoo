const bcrypt = require('bcryptjs');
const middleware = require('./middlewares');
const multer = require('multer');
const path = require('path');
const encoder64 = require('../util/functions').base64_encode;
const UserDao = require('../daos/UserDao');

const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './ReadooRestProvider/uploads/userAvatars');
    },
    filename: function (req, file, cb) {
        let fileType = file.mimetype.split('/');
        if (fileType && fileType[0] === 'image' &&
                (fileType[1] === 'jpg' || fileType[1] === 'jpeg' || fileType[1] === 'png' 
                || fileType[1] === 'svg' || fileType[1] === 'gif')) {
            let fileName = req.body.userId + '-' + Date.now() + '.' + fileType[1];
            req.body.userAvatarUrl = fileName;
            return cb(null, fileName);
        } else {
            req.body.userAvatarUrl = null;
            cb('Image format error. Images only!');
        }
    }
})

const userAvatarUpload = multer(
    { 
        storage: userStorage, 
        limits: {fileSize: 10000000} // in bytes == 10MB
    }
);

class UserProvider {
    
    constructor(app, db)
    {
        this.userDao = new UserDao(db);
        this.getUserAvatar(app);    //Get
        this.getAll(app);           //Get
        this.getOne(app);           //Get
        this.modifyOne(app);        //Put
        this.deleteOne(app);        //Delete
        this.insertOne(app);        //Post
        this.dissableOne(app);      //Post
    }
    
    getUserAvatar(app) {
        app.get('/user/avatar/:avatarUrl', function (req, res) {
            let avatarUrl = req.params.avatarUrl;
            console.log("Estoy getteando Avatar" + avatarUrl);
            if (avatarUrl) {
                let avatarFile = path.resolve('./ReadooRestProvider/Uploads/coverPages/' + avatarUrl.trim());
                if (avatarFile) {
                    return res.status(200).sendfile(avatarFile);
                }
                else {
                    console.log(error);
                    return res.status(404)        // HTTP status 404: Image not found
                        .send({ auth: false, info: 'image.not.found'});
                }
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id!');
                }
        });
    }

    getAll(app) {
        const that = this;
        app.get('/user/all', function (req, res) {
            that.userDao.getAllUser().then(
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
        app.get('/user', middleware.verifyToken, function (req, res) {
            let userId = req.query.id;
            console.log("Estoy getteando " + userId);
            if (userId) {
                that.userDao.getOneUser(+userId).then(
                    function (result) {
                        if (result.userAvatarUrl) {
                            let avatarFile = path.resolve('./ReadooRestProvider/uploads/userAvatars/' + result.userAvatarUrl.trim());
                            let base64String = encoder64(avatarFile);
                            if (base64String) {
                                result.userAvatarUrl = 'data:image/png;base64,' + base64String;
                            } else {
                                result.userAvatarUrl = null;
                            }
                        }
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

    modifyOne(app) {
        const that = this;
        app.put('/user', [middleware.verifyToken, userAvatarUpload.single('userAvatarUrl')], function (req, res) {
            let userToUpdate = req.body;
            let oldUserPass = (userToUpdate.oldUserPass != null) ? "" + userToUpdate.oldUserPass.trim() : null;
            console.log("Estoy modificando " + userToUpdate.userId);     
            if (userToUpdate && userToUpdate.userId != null && (userToUpdate.userName !== undefined || userToUpdate.userSurname !== undefined 
                    || userToUpdate.userNick !== undefined || userToUpdate.userPass !== undefined || userToUpdate.userEmail !== undefined 
                    || userToUpdate.userAboutMe  !== undefined || userToUpdate.userAvatarUrl !== undefined)) {
                let hashedPassword = (userToUpdate.userPass !== undefined) ? bcrypt.hashSync(userToUpdate.userPass, 8) : null;
                that.userDao.getOneUserPass(+userToUpdate.userId).then(
                    function (result) {
                        if (result !== undefined) {
                            if (oldUserPass == null || bcrypt.compareSync(oldUserPass, result.userPass)) {
                                that.userDao.updateOneUser((userToUpdate.userName !== undefined) ? userToUpdate.userName.trim() : null, 
                                        (userToUpdate.userSurname !== undefined) ? userToUpdate.userSurname.trim() : null, 
                                        (userToUpdate.userNick !== undefined) ? userToUpdate.userNick.trim() : null, hashedPassword, 
                                        (userToUpdate.userEmail !== undefined) ? userToUpdate.userEmail.trim() : null, 
                                        (userToUpdate.userAboutMe !== undefined) ? userToUpdate.userAboutMe.trim() : null, 
                                        userToUpdate.userAvatarUrl, +userToUpdate.userId).then(
                                    function (result) {
                                        res.setHeader('Content-Type', 'application/json');
                                        if (result.changedRows > 0) {
                                            return res.status(200).json(result);
                                        } else {
                                            // Acepted but no changes commited
                                            return res.status(202).json(result);
                                        }
                                    }
                                ).catch(
                                    function (err) {
                                        let reqError = functions.getRequestError(err);
                                        return res.status(reqError.code)        
                                            .send(reqError.text);
                                    }
                                );
                            } else {
                                return res.status(401).send({ auth: false, info: 'no.pass.coincidence'});
                            }
                        } else {
                            return res.status(401).send({ auth: false, info: 'no.user.exists'});
                        }
                    }
                ).catch(
                    function (err) {
                        let reqError = functions.getRequestError(err);
                        return res.status(reqError.code)        // HTTP status 204: NotContent
                            .send(reqError.text);
                    }
                );
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Data');
            }
        });
    }
    
    insertOne(app) {
        const that = this;
        app.post('/user', middleware.verifyToken, function (req, res) {
            let userToInsert = req.body.user;
            console.log("Estoy insertando " + userToInsert);     
            if (userToInsert && userToInsert.userName && userToInsert.userSurname && userToInsert.userNick && userToInsert.userPass && userToInsert.userEmail && 
                userToInsert.userAboutMe && userToInsert.userAvatarUrl) {
                that.userDao.insertOne(userToInsert.userName.trim(), userToInsert.userSurname.trim(), userToInsert.userNick.trim(), userToInsert.userPass, userToInsert.userEmail.trim(), 
                        userToInsert.userAboutMe.trim(), userToInsert.userAvatarUrl).then(
                    function (result) {
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(200).json(result.insertId);
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
    }
    
    dissableOne(app) {
        const that = this;
        app.post('/dissableUser', middleware.verifyToken, function (req, res) {
            console.log("Estoy deshabilitando usuario");
            let userId = req.body.userId;
            if (userId) {
                that.userDao.dissableOneUser(+userId).then(
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
                res.status(400)
                    .send('Missed Id');
            }
        });
    }

    deleteOne(app) {
        const that = this;
        app.delete('/user', function (req, res) {
            console.log("Estoy deleteando " + req.body.id);
            let userId = req.body.id;
            if (userId) {
                that.userDao.deleteOneUser(+userId).then(
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
                )
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    };
    
}
    
module.exports = UserProvider;
    