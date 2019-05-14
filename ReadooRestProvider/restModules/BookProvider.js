const multer = require('multer');
const path = require('path');
const encoder64 = require('../Util/functions');
const functions = require('../util/functions');
const middleware = require('./middlewares');
const BookDao = require('../daos/LoginDao');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './ReadooRestProvider/Uploads/Portadas')
    },
    filename: function (req, file, cb) {
        var fileType = file.mimetype.split('/');
        if (fileType && fileType[0] === 'image' &&
            (fileType[1] === 'jpg' || fileType[1] === 'jpeg' || fileType[1] === 'png' || fileType[1] === 'svg')) {
            var fileName = 'User' + '-' + Date.now() + '.' + fileType[1];
            cb(null, fileName) //TODO: cambiar por usuario actual
            req.body.coverUrl = fileName;
        } else {
            req.body.coverUrl = '';
            cb(null, 'cover' + '-' + 'any')
        }
    }
})

var upload = multer({ storage: storage });

class LibroProvider {

    bookDao = null;

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
        app.get('/book', function (req, res) {
            let books = this.bookDao.getAllBook();
            if (Number.isNaN(books)) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(books));
                //res.json(books);
            } else {
                // Sql Err
                let reqError = functions.getRequestError(books);
                res.status(reqError.code)
                    .send(reqError.text);
            }
        });
    }

    getBunch(app) {
        app.post('/book', middleware.verifyToken, function (req, res) {
            let lastOne = req.body.last;
            console.log("Deberia cojer n libros " + ultlastOneimo);
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
            
            let bunch = this.bookDao.getBunchOfBooks(userId, lastBookId, genres, lastDate, numberOfBooks);
            if (Number.isNaN(bunch)) {
                let toRet = bunch.map(function (lib) {
                    if (lib.coverUrl.length != 0) {
                        var archivo = path.resolve('./ReadooRestProvider/Uploads/coverPages/' + lib.coverUrl);
                        if (archivo) {
                            lib.coverUrl = encoder64(archivo);
                        }
                    }
                    return lib;
                });
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(toReturn);
            } else {
                let reqError = functions.getRequestError(bunch);
                res.status(reqError.code) 
                    .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }

    insertOne(app) {
        app.post('/newBook', [middleware.verifyToken, upload.single('portada')], function (req, res) { // TODO: have a look to multiple middleware
            console.log("Estoy insertando libro");
            let bookInfo = req.body;
            if (bookInfo && bookInfo.bookTitle && bookInfo.bookAuthor && bookInfo.bookDescription && bookInfo.bookReview
                    && bookInfo.bookCoverUrl && bookInfo.userId && bookInfo.genreId) {
                let newBookId = this.bookDao.addBook(bookInfo.bookTitle, bookInfo.bookAuthor, bookInfo.bookDescription, bookInfo.bookReview,
                    bookInfo.bookCoverUrl, bookInfo.userId, bookInfo.genreId);

                if (Number.isInteger(newBookId) && newBookId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(newBookId);
                } else {
                    let reqError = functions.getRequestError(newBookId);
                    res.status(reqError.code)        
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    }

    dissableOne(app) {
        app.post('/dissableBook', middleware.verifyToken, function (req, res) {
        console.log("Estoy deshabilitando libro");

        let bookId = req.body.id;
        if (bookId) {
            let oldBookId = this.bookDao.dissableBook(bookId);
            if (Number.isInteger(oldBookId) && oldBookId > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(oldBookId);
            } else {
                let reqError = functions.getRequestError(oldBookId);
                res.status(reqError.code) 
                    .send(reqError.text);
                }
            } else {
                res.status(400)
                    .send('Missed Id');
            }
        });
    }

    deleteOne(app) {
        app.delete('/commentary', function (req, res) {
            console.log("Estoy deleteando " + req.body.id);
            let bookId = req.body.id;
            if (bookId) {
                let oldBookId = this.bookDao.deleteOne(bookId);
                if (Number.isInteger(oldBookId) && oldBookId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(oldBookId);
                } else {
                    let reqError = functions.getRequestError(oldBookId);
                    res.status(reqError.code)
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id');
            }
        });
    };
}

module.exports = LibroProvider;
