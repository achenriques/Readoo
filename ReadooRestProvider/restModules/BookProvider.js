const multer = require('multer');
const path = require('path');
const fs = require('fs');
const functions = require('../util/functions');
const middleware = require('./middlewares');
const BookDao = require('../daos/BookDao');
const LastBookDao = require('../daos/LastBookDao');
const { resizeToBook, resizeToIcon } = require('../util/imageFormater');

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
        this.returnErrCode = functions.returnErrCode;
        this.getBookCover(app);     //Get
        this.getAll(app);           //Get
        this.deleteOne(app);        //Delete
        this.getBunch(app);         // Post
        this.getBunchOfFavourites(app);  // Post
        this.insertOne(app);        // Post
        this.dissableOne(app);      // Post
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

    parseBookCoverImages (bookArray) {
        const parseCover = function (coverPath, currentBook) {
            return resizeToBook(coverPath).then(function (base64String) {
                if (base64String) {
                    currentBook.bookCoverUrl = base64String;
                } else {
                    currentBook.bookCoverUrl = null;
                }
            }).catch(function (err) {
                console.log(err);
                currentBook.bookCoverUrl = null;
            });
        }

        const parseAvatar = function (avatarPath, currentBook) {
            return resizeToIcon(avatarPath).then(function (base64String) {
                if (base64String) {
                    currentBook.userAvatarUrl = base64String;
                } else {
                    currentBook.userAvatarUrl = null;
                }
            }).catch(function (err) {
                console.log(err);
                currentBook.userAvatarUrl = null;
            });
        }

        if (bookArray) {
            return Promise.all(bookArray.map(function(b, index, rSet) {
                let arrayOfPromises = [];
                // in case of favourites...
                delete b.total;
                // Parse book covers
                if (b.bookCoverUrl != null && b.bookCoverUrl.length !== 0) {
                    let coverFile = path.resolve('./ReadooRestProvider/uploads/coverPages/' + b.bookCoverUrl);
                    if (coverFile && fs.existsSync(coverFile)) {
                        arrayOfPromises.push(parseCover(coverFile, b));
                    } else {
                        console.log('Book cover image not found: ' + b.bookCoverUrl);
                        b.bookCoverUrl = null;
                        arrayOfPromises.push(Promise.resolve());
                    }
                } else {
                    console.log('Book cover was undefinde: ' + b.bookId);
                    b.bookCoverUrl = null;
                    arrayOfPromises.push(Promise.resolve());
                }
                // Parse user icons
                if (b.userAvatarUrl != null && b.userAvatarUrl.length !== 0) {
                    let avatarFile = path.resolve('./ReadooRestProvider/uploads/userAvatars/' + b.userAvatarUrl);
                    if (avatarFile && fs.existsSync(avatarFile)) {
                        arrayOfPromises.push(parseAvatar(avatarFile, b));
                    } else {
                        console.log('Book cover image not found: ' + b.bookCoverUrl);
                        b.userAvatarUrl = null;
                        arrayOfPromises.push(Promise.resolve());
                    }
                } else {
                    console.log('User avatar was undefined: ' + b.userId);
                    b.userAvatarUrl = null;
                    arrayOfPromises.push(Promise.resolve());
                }
                return Promise.all(arrayOfPromises);
            })).then(function (promisesResult) {
                return bookArray;
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            return Promise.resolve(bookArray);
        }
    }

    getBunch(app) {
        const that = this;
        app.post('/book', middleware.verifyToken, function (req, res) {
            let lastOne = req.body.last;
            console.log("Deberia cojer n libros " + lastOne);
            if (lastOne && lastOne.userId && lastOne.numberOfBooks) {
                let userId = lastOne.userId;
                let genres = lastOne.genres;
                let lastDate = lastOne.lastDate;
                let numberOfBooks = lastOne.numberOfBooks;

                if (genres == null) {
                    genres = [];
                }

                that.bookDao.getBunchOfBooks(+userId, genres, lastDate, numberOfBooks).then(
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
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id or Data');
            }
        });
    }

    getBunchOfFavourites(app) {
        const that = this;
        app.post('/bookFavourites', middleware.verifyToken, function (req, res) {
            let favourite = req.body.favourite;
            console.log("Deberia cojer favoritos " + favourite.booksPerPage);
            if (favourite && favourite.userId, favourite.page != null && favourite.booksPerPage != null) {
                let userId = favourite.userId;
                let betweenA = (favourite.page * favourite.booksPerPage) + 1;
                let betweenB = (favourite.page === 0) ? 2 * favourite.booksPerPage : ((favourite.page + 1) * favourite.booksPerPage) + 1;
                let myUploads = favourite.myUploads == true;
                
                that.bookDao.getBunchOfFavourites(+userId, betweenA, betweenB, myUploads, +favourite.page === 0, +favourite.booksPerPage).then(
                    function (result) {
                        let toRet = {
                            total: (result.length > 0) ? result[0].total : 0
                        };
                        that.parseBookCoverImages(result).then(function (resultOfParse) {
                            toRet.data = resultOfParse;
                            return res.header('Content-Type', 'application/json').status(200).json(toRet);
                        });
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
                return res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Id or Data');
            }
        });
    }

    dissableOne(app) {
        const that = this;
        app.post('/dissableBook', middleware.verifyToken, function (req, res) {
            console.log("Estoy deshabilitando libro");
            let bookId = req.body.bookId;
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
        app.delete('/book', function (req, res) {
            console.log("Estoy deleteando " + req.body.id);
            let bookId = req.body.id;
            if (bookId) {
                that.bookDao.deleteBook(bookId).then(
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
