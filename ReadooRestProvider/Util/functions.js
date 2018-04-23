const fs = require('fs');

// function to encode file data to base64 encoded string
const base64_encode = function (file) {
    var toRet = '';
    if (file) {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        toRet =  new Buffer(bitmap).toString('base64');
    }
    return toRet;
}

module.exports = base64_encode;