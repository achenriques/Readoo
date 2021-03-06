const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { uploadAvatarDir } = require('../util/serverOptions');
const functions = require('../util/functions');
const LoginDao = require('../daos/LoginDao');
const path = require('path');
const UserGenreDao = require('../daos/UserGenreDao');
const resizeToIcon = require('../util/imageFormater').resizeToIcon;
const LANGUAGE_ENGLISH = require('../util/constants').LANGUAGE_ENGLISH;
const TOKEN_TIME = require('../util/constants').TOKEN_TIME;

const USER_CREDENTIAL = process.env.READOO_USER_CREDENTIAL;

class LoginProvider {

    constructor(app, db) {
        this.loginDao = new LoginDao(db);
        this.userGenreDao = new UserGenreDao(db);
        this.returnErrCode = functions.returnErrCode;
        this.login(app);                // Post
        this.isMe(app);                 // Get
        this.logOut(app);               // Get
        this.isAvaliable(app);          // Get
        this.isAvaliableEmail(app);     // Get
        this.newUser(app);              // Post
        this.selectTab(app);            // Post
        this.selectLanguage(app);       // Post
    }

    login(app) {
        const that = this;
        app.post('/login', function(req, res) {
            if (req.body.userNickEmail && req.body.userNickEmail.trim().length && req.body.pass) {
                let userNickEmail = req.body.userNickEmail.trim();
                let pass = req.body.pass;
                that.loginDao.logUser(userNickEmail).then(
                    function (result) {
                        if (result !== undefined) {
                            if (bcrypt.compareSync(pass, result.userPass)) {
                                let token = jwt.sign(
                                    { userId: result.userId },
                                    USER_CREDENTIAL,
                                    { expiresIn: TOKEN_TIME } // expires in 24 hours 
                                );
                                result.userPass = '';
                                // Get user genres
                                that.userGenreDao.getOneUserGenre(result.userId).then(function(genres) {
                                    // Set user genres
                                    result.userGenres = genres.map(function (g) { return +g.genreId });
                                    // Save date of login of all users.
                                    that.loginDao.registerLog(+result.userId).then(
                                        function (resultLog) {
                                            console.log("Registered user with ID: " + result.userId + " logged at " + new Date().toString());
                                        }
                                    ).catch(function (err) {
                                        console.warn("Error at saving log register: " + err);
                                    });
                                    // Convert image to icon
                                    if (result.userAvatarUrl) {
                                        let avatarFile = path.resolve(uploadAvatarDir + "/" + result.userAvatarUrl.trim());
                                        resizeToIcon(avatarFile).then(function (base64String) {
                                            if (base64String) {
                                                result.userAvatarUrl = base64String;
                                            } else {
                                                result.userAvatarUrl = null;
                                            }
                                            // return statement
                                            return res.cookie('token', token, { httpOnly: true }).status(200).json({
                                                success: true,
                                                message: 'Authentication successful!',
                                                userId: result.userId,
                                                userData: result
                                            });
                                        }).catch(function (err) {
                                            result.userAvatarUrl = null;
                                            console.error(err);
                                            // return statement
                                            return res.cookie('token', token, { httpOnly: true }).status(200).json({
                                                success: true,
                                                message: 'Authentication successful!',
                                                userId: result.userId,
                                                userData: result
                                            });
                                        });
                                    } else {
                                        // return statement
                                        return res.cookie('token', token, { httpOnly: true }).status(200).json({
                                            success: true,
                                            message: 'Authentication successful!',
                                            userId: result.userId,
                                            userData: result
                                        });
                                    }
                                }).catch(function(err) {
                                    console.error(err);
                                    return that.returnErrCode(err, res);
                                });
                            } else {
                                return res.status(401).send({ auth: false, info: 'wrong.pass'});
                            }
                        } else {
                            return res.status(401).send({ auth: false, info: 'no.user.exists'});
                        }
                    }
                ).catch(function(err) {
                    console.error(err);
                    return that.returnErrCode(err, res);
                });
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Data');
            }
        });
    }

    // Check the actual token and returns user info
    isMe(app) {
        const that = this;
        app.get('/login/isme', function (req, res) {
            let token = functions.getTokenFromRequest(req);
            if (!token) {
                return res.status(401).send({ auth: false, message: 'No token provided!' });
            }

            jwt.verify(token, USER_CREDENTIAL, function(err, decoded) {
                if (err) {
                    return res.status(500).send({ auth: false, message: 'Failed to authenticate token!' });
                }
                that.loginDao.isMeLogged(decoded.userId).then(
                    function (result) {
                        // Parse genres
                        if (result.userGenres != null) {
                            // The genres of the user are cast to an array of numbers with the genre ids
                            result.userGenres = result.userGenres.split(",").map(function (x) {return +x});
                        } else {
                            result.userGenres = [];
                        }
                        // Parse avatar
                        if (result.userAvatarUrl) {
                            let avatarFile = path.resolve(uploadAvatarDir + "/" + result.userAvatarUrl.trim());
                            resizeToIcon(avatarFile).then(function (base64String) {
                                if (base64String) {
                                    result.userAvatarUrl = base64String;
                                } else {
                                    result.userAvatarUrl = null;
                                }
                                res.setHeader('Content-Type', 'application/json');
                                if (decoded.tabSelector != null) {
                                    result.tabSelector = +decoded.tabSelector;
                                }
                                if (decoded.languageCode != null) {
                                    result.languageCode = +decoded.languageCode;
                                }
                                return res.status(200).json(result);
                            }).catch(function (err) {
                                console.error(err);
                                return res.status(200).json(result);
                            });
                        } else {
                            res.setHeader('Content-Type', 'application/json');
                            return res.status(200).json(result);
                        }
                    }
                ).catch(function(err) {
                    console.error(err);
                    return that.returnErrCode(err, res);
                });
            });
        });
    }

    logOut(app) {
        const that = this;
        app.get('/login/logout', function (req, res) {
            let token = functions.getTokenFromRequest(req);
            if (!token) {
                return res.status(401).send({ auth: false, message: 'No token provided!' });
            }
            
            jwt.verify(token, USER_CREDENTIAL, function(err, decoded) {
                if (err) {
                    return res.status(500).send({ auth: false, message: 'Failed to authenticate token!' });
                }
                let token = jwt.sign(
                    { userId: decoded.userId },
                    USER_CREDENTIAL,
                    { expiresIn: '0s' }     // We set the cookie not valid
                );
                // We send an expired token...
                return res.cookie('token', token, { httpOnly: true }).status(200).json({
                            success: true,
                            message: 'Logged out successful!',
                            token: token
                        });
            });
        });
    }

    isAvaliable(app) {
        const that = this;
        app.get('/login/avaliable', function (req, res) {
            if (req.query.userNickEmail) {
                that.loginDao.getIsNickAvaliable("" + req.query.userNickEmail).then(
                    function (result) {
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(200).send(result.length === 0);
                    }
                ).catch(function(err) {
                    console.error(err);
                    return that.returnErrCode(err, res);
                });
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Data');
            }
        });
    }

    isAvaliableEmail(app) {
        const that = this;
        app.get('/login/avaliableEmail', function (req, res) {
            if (req.query.email) {
                that.loginDao.getIsEmailAvaliable("" + req.query.email.trim()).then(
                    function (result) {
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(200).send(result.length === 0);
                    }
                ).catch(function(err) {
                    console.error(err);
                    return that.returnErrCode(err, res);
                });
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Data');
            }
        });
    }
  
    newUser(app) {
        const that = this;
        app.post('/login/new', function (req, res) {
            if (req.body.userNickEmail && req.body.pass && req.body.email) {
                let userEmail = req.body.email.trim();
                let userLanguage = req.body.language;
                if (userLanguage === undefined) {
                    userLanguage = LANGUAGE_ENGLISH;
                }
                let hashedPassword = bcrypt.hashSync(req.body.pass, 8);
                that.loginDao.addUser(req.body.userNickEmail.trim(), hashedPassword, userEmail, userLanguage).then(
                    function (result) {
                        if (result.insertId) {
                            // create a token
                            let token = jwt.sign(
                                { userId: result.insertId }, 
                                USER_CREDENTIAL, 
                                { expiresIn: TOKEN_TIME } // expires in 24 hours}
                            );
                            // Save date of login of all users.
                            that.loginDao.registerLog(+result.insertId).then(
                                function (resultLog) {
                                    console.log("Registered user with ID: " + result.insertId + " logged at " + new Date().toString());
                                }
                            ).catch(function (err) {
                                console.warn("WARN: Error at saving log register: " + err);
                            });
                            // return ...
                            return res.cookie('token', token, { httpOnly: true }).status(200).json({
                                success: true,
                                message: 'Authentication successful!',
                                userId: result.insertId
                            });
                        } else {
                            console.warn("Not user saved. Something did not work!");
                        }
                    }
                ).catch(function(err) {
                    return that.returnErrCode(err, res);
                });
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Data');
            }
        });
    }

    selectTab(app) {
        const that = this;
        app.post('/login/tabSelector', function (req, res) {
            let tabSelector = req.body.tabSelector;   
            if (tabSelector != null) {
                // Save on the token the current tab ID
                let token = functions.getTokenFromRequest(req);
                if (!token) {
                    return res.status(403).send({ auth: false, info: 'no.token.provided', message: 'No token provided.' });
                }
              
                jwt.verify(token, USER_CREDENTIAL, function(err, decoded) {
                    if (err) {
                        // We send 403 to identify when the session has expired
                        return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
                    } else {
                        // If tab selector is not null or undefined this selector will be saved on the cookie 
                        if (decoded.tabSelector != tabSelector) {
                            let tokenWithSelector = jwt.sign(
                                { userId: decoded.userId, tabSelector: +tabSelector },
                                USER_CREDENTIAL,
                                { expiresIn: TOKEN_TIME } // expires in 24 hours 
                            );
                            return res.cookie('token', tokenWithSelector, { httpOnly: true }).status(200).json('success');
                        }
                    }
                });
            } else {
                return res.status(200).send("");
            }
        });   
    }

    selectLanguage(app) {
        const that = this;
        app.post('/login/languageSelector', function (req, res) {
            let languageCode = req.body.languageCode;   
            if (languageCode != null) {
                // Save on the token the current tab ID
                let token = functions.getTokenFromRequest(req);
                if (!token) {
                    return res.status(403).send({ auth: false, info: 'no.token.provided', message: 'No token provided.' });
                }
              
                jwt.verify(token, USER_CREDENTIAL, function(err, decoded) {
                    if (err) {
                        // We send 403 to identify when the session has expired
                        return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
                    } else {
                        // If language selector is not null or undefined this selector will be saved on the cookie
                        that.loginDao.changeUserLanguage(+decoded.userId, +languageCode).then(
                            function (resultLog) {}
                        ).catch(function (err) {
                            console.error("Error at changing user language");
                            console.error(err);
                        });
                        if (decoded.languageCode != +languageCode) {
                            let tokenWithSelector = jwt.sign(
                                { userId: decoded.userId, tabSelector: (decoded.tabSelector) ? decoded.tabSelector : 0, languageCode: +languageCode },
                                USER_CREDENTIAL,
                                { expiresIn: TOKEN_TIME } // expires in 24 hours 
                            );
                            return res.cookie('token', tokenWithSelector, { httpOnly: true }).status(200).json('success');
                        }
                    }
                });
            } else {
                return res.status(200).send("");
            }
        });   
    }
}
  
module.exports = LoginProvider;
  