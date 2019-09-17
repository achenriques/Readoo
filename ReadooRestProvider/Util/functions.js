const fs = require('fs');

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

module.exports = {base64_encode, getRequestError};