const multer = require('multer');
const path = require('path');
const encoder64 = require('../Util/functions');
const functions = require('../util/functions');
const middleware = require('./middlewares');
const BookDao = require('../daos/BookDao');

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
            let coverFile = path.resolve('./ReadooRestProvider/Uploads/coverPages/' + coverName);
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

    getBunch(app) {
        const that = this;
        app.post('/book', middleware.verifyToken, function (req, res) {
            let lastOne = req.body.last;
            console.log("Deberia cojer n libros " + lastOne);
            if (lastOne && lastOne.userId && lastOne.lastBookId && lastOne.genres
                    && lastOne.lastDate && lastOne.nBooks) {
                let userId = lastOne.userId;
                let lastBookId = lastOne.lastBookId;
                let genres = lastOne.genres;
                let lastDate = lastOne.lastDate;
                let numberOfBooks = lastOne.nBooks;

                if (genres == null) {
                    genres = [];
                }
                
                that.bookDao.getBunchOfBooks(userId, lastBookId, genres, lastDate, numberOfBooks).then(
                    function (result) {
                        result.map(function (bookOfBucnh) {
                            if (bookOfBucnh.coverUrl.length != 0) {
                                let file = path.resolve('./ReadooRestProvider/Uploads/coverPages/' + bookOfBucnh.coverUrl);
                                if (file) {
                                    bookOfBucnh.coverUrl = encoder64(file);
                                }
                            }
                            return bookOfBucnh;
                        });
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(200).json(toReturn);
                    }
                ).catch(
                    function (err) {
                        let reqError = functions.getRequestError(err);
                        return res.status(reqError.code) 
                            .send(reqError.text);
                    }
                );
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
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
                        return res.status(200).json(result.insertedId);
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
