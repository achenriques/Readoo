const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userConfig = require('../util/serverOptions');
const functions = require('../util/functions');
const middleware = require('./middlewares');
const LoginDao = require('../daos/LoginDao');

class LoginProvider {

    loginDao = null;

    constructor(app, db) {
        this.loginDao = new LoginDao(db);
        this.login(app); // Post
        this.isMe(app); //Get
        this.newUser(app); // Post
    }

    login(app) {
        app.post('/login', function(req, res) {
            if (req.body.email && req.body.pass) {
                let userData = this.loginDao.logUser(req.body.email, req.body.pass);
                if (Number.isNaN(userData)) {
                    let token = jwt.sign(
                        { userId: userData.userId },
                        secretPassToken,
                        { expiresIn: '24h' } // expires in 24 hours 
                    );

                    // return the JWT token for the future API calls
                    res.json({
                        success: true,
                        message: 'Authentication successful!',
                        token: token
                    });
                } else {
                    let reqError = functions.getRequestError(userData);
                    res.status(reqError.code)        // HTTP status 204: NotContent
                        .send(reqError.text);
                }
            }
        });
    }

    // Check the actual token and returns user info
    isMe(app) {
        app.get('/login/isme', function (req, res) {
            let token = req.headers['x-access-token'];
            if (!token) {
                return res.status(401).send({ auth: false, message: 'No token provided!' });
            }
            
            jwt.verify(token, userConfig.users.readooUser, function(err, decoded) {
                if (err) {
                    return res.status(500).send({ auth: false, message: 'Failed to authenticate token!' });
                } 
            
                let userData = this.loginDao.isMeLogged(decoded.id);
                if (Number.isNaN(userData)) {
                    res.setHeader('Content-Type', 'application/json');
                        res.status(200).json(userData);
                } else {
                    let reqError = functions.getRequestError(userData);
                    res.status(reqError.code)        // HTTP status 204: NotContent
                        .send(reqError.text);
                }
            });
        });
    }
  
    newUser(app) {
        app.post('/login/new', function (req, res) {
            console.log("Estoy insertando " + req.body.apodo);     
            if (req.body.apodo && req.body.pass && req.body.email) {
                let hashedPassword = bcrypt.hashSync(req.body.pass, 8);
                let newUserId = this.loginDao.addUser(req.body.apodo.trim(), hashedPassword, req.body.email.trim())

                if (Number.isInteger(newUserId) && newUserId > 0) {
                    // create a token
                    let token = jwt.sign(
                        { id: result.insertId }, 
                        userConfig.users.readooUser, {
                        expiresIn: '24h' // expires in 24 hours
                    });
                    res.status(200).send({ auth: true, token: token });
                } else {
                    let reqError = functions.getRequestError(userData);
                    res.status(reqError.code)        // HTTP status 204: NotContent
                        .send(reqError.text);
                }
            }
        });
    }
}
  
module.exports = LoginProvider;
  