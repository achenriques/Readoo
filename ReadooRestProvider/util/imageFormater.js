const fs = require('fs');
const jimp = require('jimp');

/*
 * Gets an imgage from a stream and resize it.
 * Returns a base64 image 
 */
const resizeImage = function (imagePath, width, height, keepRatio) {
    return new Promise(function(resolve, reject) {
        let nWidth = (width) ? +width : (height) ? +height : jimp.AUTO;
        let nHeight = (height) ? +height : (width) ? +width : jimp.AUTO;
        if (imagePath != null && nWidth && nHeight) {
            //let imageBuffer = fs.readFileSync(imagePath);
            let formatedJm;
            if (!keepRatio) {
                formatedJm = jimp.read(imagePath).then(image => {
                    image
                        .resize(nWidth, nHeight)
                        .quality(90)
                        .getBase64(jimp.MIME_PNG, function (err, src) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            resolve(src);
                        })
                    }).catch(err => reject(err));
            } else {
                formatedJm = jimp.read(imagePath).then(image => {
                    image
                        .resize(nWidth, jimp.AUTO)
                        .quality(90)
                        .getBase64(jimp.MIME_PNG, function (err, src) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            resolve(src);
                        })
                    }).catch(err => reject(err));
            }
        } else {
            reject('No resolved path for any image!');
        }
    });
}

const resizeToIcon = function (imagePath) {
    return resizeImage(imagePath, 40, 40, false);
}

const resizeToBook = function (imagePath) {
    return resizeImage(imagePath, jimp.AUTO, 500, false);
}

const resizeToProfile = function (imagePath) {
    return resizeImage(imagePath, 300, 300, false);
}

module.exports = { resizeToIcon, resizeToBook, resizeToProfile };