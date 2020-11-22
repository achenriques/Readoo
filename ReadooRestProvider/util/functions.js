const fs = require('fs');

// prepare return error for a response
const returnErrCode = function(error, response) {
    let reqError = functions.getRequestError(error);
    return response.status(reqError.code)        // HTTP status 204: NotContent
        .send(reqError.text);
}

// function to encode file data to base64 encoded string
const base64_encode = function (file) {
    let toRet = '';
    if (file) {
        // read binary data
        try {
            let bitmap = fs.readFileSync(file);
            if (bitmap) {
                // convert binary data to base64 encoded string
                toRet =  new Buffer(bitmap).toString('base64');
            }
        } catch (err) {
            return null;
        }
    }
    return toRet;
}

// the following function returns info codes and text to be send to the FRONT as a part of an request error.
const getRequestError = function (code) {
    switch (code) {
        case -1:
            return { code: 204, text: 'Failed at consult!' };

        case -2:
            return { code: 500, text: 'Not DB connection!' };

        case -3:
            return {code: 206, text: 'Duplicated Entry' };
        
        default:
            return { code: 400, text: 'Error detected!' };
    }
}

// get the token from a request
const getTokenFromRequest = function (req) {
    if (!req) {
        return null;
    }
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token === undefined && req.headers.cookie !== undefined) {
        let stringFromCookie = req.headers.cookie;
        let cookieTokenValues = new RegExp('token' + "=([^;]+)").exec(stringFromCookie);
        if (cookieTokenValues.length) {
            token = cookieTokenValues[1];
        }
    }

    if (!token) {
        return null;
    }

    // No util info
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    return token;
}

module.exports = { returnErrCode, base64_encode, getRequestError, getTokenFromRequest };