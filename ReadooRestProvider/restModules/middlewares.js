const jwt = require('jsonwebtoken');
const userConfig = require('../util/serverOptions');
const constants = require('../util/constants');

const USER_CREDENTIAL = process.env.READOO_USER_CREDENTIAL;

module.exports = {
    verifyToken : function (req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token === undefined && req.headers.cookie !== undefined) {
            let stringFromCookie = req.headers.cookie;
            let cookieTokenValues = new RegExp('token' + "=([^;]+)").exec(stringFromCookie);
            if (cookieTokenValues.length) {
                token = cookieTokenValues[1];
            }
        }

        if (!token) {
            return res.status(403).send({ auth: false, info: 'no.token.provided', message: 'No token provided.' });
        }
        // No util info
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
      
        jwt.verify(token, USER_CREDENTIAL, function(err, decoded) {
            if (err) {
                // We send 403 to identify when the session has expired
                return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
            } else {
                // If tab selector is not null or undefined this selector will be saved on the cookie 
                let tabSelector = req.params.tabSelector || req.body.tabSelector;
                if (tabSelector != null) {
                    if (decoded.tabSelector != tabSelector) {
                        let tokenWithSelector = jwt.sign(
                            { userId: decoded.userId, tabSelector: tabSelector },
                            USER_CREDENTIAL,
                            { expiresIn: constants.TOKEN_TIME } // expires in 24 hours 
                        );
                        res.cookie('token', tokenWithSelector, { httpOnly: true });
                    }
                }
                // if everything was good, save to request for use in other routes
                next();
            }
        });
    }
}