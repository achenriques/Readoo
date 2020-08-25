const multer = require('multer');
const path = require('path');
const fs = require('fs');
const functions = require('../util/functions');
const middleware = require('./middlewares');
const BookDao = require('../daos/BookDao');
const LastBookDao = require('../daos/LastBookDao');
const { resizeToBook } = require('../util/imageFormater');

const MIN_DB_ID = 0;

const bookStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './ReadooRestProvider/uploads/coverPages')
    },
    filename: function (req, file, cb) {
        let fileType = file.mimetype.split('/');
        if (fileType && fileType[0] === 'image' &&
            (fileType[1] === 'jpg' || fileType[1] === 'jpeg' || fileType[1] === 'png' || fileType[1] === 'svg')) {
            let fileName = req.body.userId + '-' + Date.now() + '.' + fileType[1];
            cb(null, fileName)
            req.body.bookCoverUrl = fileName;
        } else {
            req.body.bookCoverUrl = '';
            cb('Image format error. Images only!');
        }
    }
})

const bookCoverUpload = multer(
    { 
        storage: bookStorage, 
        limits: {fileSize: 10000000} // in bytes == 10MB
    }
);

class BookProvider {

    constructor(app, db) {
        this.bookDao = new BookDao(db);
        this.lastBookDao = new LastBookDao(db);
        this.getBookCover(app); //Get
        this.getAll(app); //Get
        this.deleteOne(app);  //Delete
        this.getBunch(app); // Post
        this.insertOne(app); // Post
        this.dissableOne(app); // Post
    }

    getBookCover(app) {
        app.get('/book/cover/:cover', function (req, res) {
            let coverName = req.params.cover;
            console.log("Estoy getteando Portada" + nombrePortada);
            if (!coverName) {
            let coverFile = path.resolve('./ReadooRestProvider/uploads/coverPages/' + coverName);
            if (coverFile) {
                res.sendfile(coverFile);
            }
            else {
                console.log(error);
                res.status(500)        // HTTP status 500: InternalErrorNotDbConnection
                    .send('No archive found!');
            }
            } else {
            res.status(400)        // HTTP status 400: BadRequest
                .send('Missed Id!');
            }
        });
    }

    getAll(app) {
        const that = this;
        app.get('/book', function (req, res) {
            that.bookDao.getAllBook().then(
                function (result) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.send(JSON.stringify(books));
                }
            ).catch(
                function (err) { // Sql Err
                    let reqError = functions.getRequestError(books);
                    return res.status(reqError.code).send(reqError.text);
                }
            );
        });
    }

    parseBookCoverImages (coverArray) {
        if (coverArray) {
            return Promise.all(coverArray.map(function(b, index, rSet) {
                if (b.bookCoverUrl != null && b.bookCoverUrl.length !== 0) {
                    let coverFile = path.resolve('./ReadooRestProvider/uploads/coverPages/' + b.bookCoverUrl);
                    if (coverFile && fs.existsSync(coverFile)) {
                        return resizeToBook(coverFile).then(function (base64String) {
                            if (base64String) {
                                b.bookCoverUrl = base64String;
                            } else {
                                b.bookCoverUrl = null;
                            }
                        }).catch(function (err) {
                            console.log(err);
                            b.bookCoverUrl = null;
                        });
                    } else {
                        console.log('Book cover image not found: ' + b.bookCoverUrl);
                        b.bookCoverUrl = null;
                        return Promise.resolve();
                    }
                }
            })).then(function (promisesResult) {
                return coverArray;
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            return Promise.resolve(coverArray);
        }
    }

    getBunch(app) {
        const that = this;
        app.post('/book', middleware.verifyToken, function (req, res) {
            let lastOne = req.body.last;
            console.log("Deberia cojer n libros " + lastOne);
            if (lastOne && lastOne.userId && lastOne.lastBookId && lastOne.numberOfBooks) {
                let userId = lastOne.userId;
                let lastBookId = lastOne.lastBookId;
                let genres = lastOne.genres;
                let lastDate = lastOne.lastDate;
                let numberOfBooks = lastOne.numberOfBooks;

                if (genres == null) {
                    genres = [];
                }

                const getBunchOfBooks = function (userIdParam, lastBookIdParam, genresParam, lastDateParam, numberOfBooksParam) {
                    that.bookDao.getBunchOfBooks(userIdParam, lastBookIdParam, genresParam, lastDateParam, numberOfBooksParam).then(
                        function (result) {
                            that.parseBookCoverImages(result).then(function (resultOfParse) {
                                return res.header('Content-Type', 'application/json').status(200).json(resultOfParse);
                            });
                        }
                    ).catch(
                        function (err) {
                            let reqError = functions.getRequestError(err);
                            return res.status(reqError.code) 
                                .send(reqError.text);
                        }
                    );
                }

                if (lastBookId < MIN_DB_ID) {
                    that.lastBookDao.getLastBook(+userId).then(
                        function (resultOfLastBook) {
                            if (resultOfLastBook.length) {
                                if (resultOfLastBook && resultOfLastBook[0].bookId != null) {
                                    lastBookId = resultOfLastBook[0].bookId;
                                    return getBunchOfBooks(+userId, +lastBookId, genres, lastDate, numberOfBooks)
                                } else {
                                    // It could not get the last book of the user so must show err
                                    res.status(400)        // HTTP status 400: BadRequest
                                        .send('Missed Id or Data');
                                }
                            } else {
                                return getBunchOfBooks(+userId, 0, genres, lastDate, numberOfBooks)
                            }
                        }
                    ).catch(
                        function (err) {
                            let reqError = functions.getRequestError(err);
                            return res.status(reqError.code) 
                                .send(reqError.text);
                        }
                    )
                } else {
                    that.lastBookDao.addOrUpdateBook(+userId, +lastBookId).catch(
                        function (err) {
                            console.log('Error at saving last bookId ' + lastBookId + 'for the userId ' + userId);
                        }
                    );
                    return getBunchOfBooks(userId, lastBookId, genres, lastDate, numberOfBooks)
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id or Data');
            }
        });
    }

    insertOne(app) {
        const that = this;
        app.post('/book/new', [middleware.verifyToken, bookCoverUpload.single('bookCoverUrl')], function (req, res) { // TODO: have a look to multiple middleware
            console.log("Estoy insertando libro");
            let bookInfo = req.body;
            if (bookInfo && bookInfo.bookTitle != null && bookInfo.bookAuthor != null && bookInfo.bookDescription && bookInfo.bookReview != null
                    && bookInfo.bookCoverUrl != null && bookInfo.userId != null && bookInfo.genreId != null ) {
                that.bookDao.addBook(bookInfo.bookTitle.trim(), bookInfo.bookAuthor.trim(), bookInfo.bookDescription.trim(), bookInfo.bookReview.trim(),
                        bookInfo.bookCoverUrl.trim(), +bookInfo.userId, +bookInfo.genreId).then(
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
                    .send('Missed Id or Data');
            }
        });
    }

    dissableOne(app) {
        const that = this;
        app.post('/dissableBook', middleware.verifyToken, function (req, res) {
            console.log("Estoy deshabilitando libro");
            let bookId = req.body.id;
            if (bookId) {
                that.bookDao.dissableBook(bookId).then(
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
                return res.status(400)
                    .send('Missed Id');
            }
        });
    }

    deleteOne(app) {
        const that = this;
        app.delete('/commentary', function (req, res) {
            console.log("Estoy deleteando " + req.body.id);
            let bookId = req.body.id;
            if (bookId) {
                that.bookDao.deleteOne(bookId).then(
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
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    };
}

module.exports = BookProvider;
