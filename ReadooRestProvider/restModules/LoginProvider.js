const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userConfig = require('../util/serverOptions');
const functions = require('../util/functions');
const LoginDao = require('../daos/LoginDao');
const LANGUAGE_ENGLISH = require('../util/constants').LANGUAGE_ENGLISH;

class LoginProvider {

    constructor(app, db) {
        this.loginDao = new LoginDao(db);
        this.login(app); // Post
        this.isMe(app); //Get
        this.newUser(app); // Post
    }

    login(app) {
        let that = this;
        app.post('/login', function(req, res) {
            if (req.body.userNickEmail && req.body.userNickEmail.trim().length && req.body.pass) {
                let userNickEmail = req.body.userNickEmail.trim();
                let pass = req.body.pass;
                that.loginDao.logUser(userNickEmail, pass).then(
                    function (result) {
                        if (bcrypt.compareSync(pass, result.userPass)) {
                            let token = jwt.sign(
                                { userId: result.userId },
                                userConfig.serverCredentials.users.readooUser, // TODO: server credencials
                                { expiresIn: '24h' } // expires in 24 hours 
                            );
                            res.status(200).send({ id: result.userId, auth: true, token: token });
                            return;
                        } else {
                            res.status(401).send({ auth: false });
                        }
                    }
                ).catch(
                    function (err) {
                        let reqError = functions.getRequestError(err);
                        res.status(reqError.code)        // HTTP status 204: NotContent
                            .send(reqError.text);
                        return;
                    }
                );
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Data');
            }
        });
    }

    // Check the actual token and returns user info
    isMe(app) {
        let that = this;
        app.get('/login/isme', function (req, res) {
            let token = req.headers['x-access-token'];
            if (!token) {
                return res.status(401).send({ auth: false, message: 'No token provided!' });
            }
            
            jwt.verify(token, userConfig.users.readooUser, function(err, decoded) {
                if (err) {
                    return res.status(500).send({ auth: false, message: 'Failed to authenticate token!' });
                }
                that.loginDao.isMeLogged(decoded.id).then(
                    function (result) {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).json(result);
                        return;
                    }
                ).catch(
                    function (err) {
                        let reqError = functions.getRequestError(err);
                        res.status(reqError.code)        // HTTP status 204: NotContent
                            .send(reqError.text);
                        return;
                    }
                );
            });
        });
    }
  
    newUser(app) {
        let that = this;
        app.post('/login/new', function (req, res) {
            console.log("Estoy insertando " + req.body.userNickEmail);     
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
                                { id: result.insertId }, 
                                userConfig.serverCredentials.users.readooUser, {    // TODO: server credencials
                                expiresIn: '24h' // expires in 24 hours
                            });
                            res.status(200).send({ id:result.insertId, auth: true, token: token });
                            return;
                        }
                    }
                ).catch(
                    function (err) {
                        let reqError = functions.getRequestError(err);
                        res.status(reqError.code)        // HTTP status 204: NotContent
                            .send(reqError.text);
                        return;
                    }
                );
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Data');
            }
        });
    }
}
  
module.exports = LoginProvider;
  