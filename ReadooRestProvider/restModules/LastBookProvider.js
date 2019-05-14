const middleware = require('./middlewares');
const LastBookDao = require('../daos/LastBookDao');

class LastBookProvider {
    
    lastBookDao = null;

    constructor(app, db)
    {
        this.lastBookDao = new LastBookDao(db);
        this.getAll(app);       //Get
        this.getOne(app);       //Get
        this.deleteOne(app);    //Delete
        this.insertOrUpdateOne(app);    // Post
    }
    
    getAll(app) {
        app.get('/lastBook', function (req, res) {
            let lastBooks = this.lastBookDao.getAllLastBooks();
            if (Number.isNaN(lastBooks)) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(lastBooks));
                //res.json(lastBooks);
            } else {
                // Sql Err
                let reqError = functions.getRequestError(lastBooks);
                res.status(reqError.code)
                    .send(reqError.text);
            }
        });
    }

    getOne(app) {
        app.get('/lastBook/:id', middleware.verifyToken, function (req, res) 
        {
            let userId = req.params.id;
            console.log("Estoy getteando " + userId);     
            if (userId)
            {
                let lastUsersBook = this.lastBookDao.getLastBook(+userId);
                if (Number.isNaN(lastUsersBook)) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(lastUsersBook));
                    //res.json(lastUsersBook);
                } else {
                    // Sql Err
                    let reqError = functions.getRequestError(lastUsersBook);
                    res.status(reqError.code)
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                .send('Missed Id');
            }
        });
    }

    insertOrUpdateOne(app) {
        app.post('/lastBook', middleware.verifyToken, function (req, res) {
            let lastBook = req.body.lastBook;
            console.log("Estoy insertando lastBook de usuario" + lastBook);     
            if (lastBook && lastBook.userId && lastBook.bookId) {
                let newlastBookId = this.lastBookDao.addOrUpdateBook(+lastBook.userId, +lastBook.bookId);
                if (Number.isInteger(newlastBookId) && newlastBookId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(newlastBookId);
                } else {
                    let reqError = functions.getRequestError(newlastBookId);
                    res.status(reqError.code)        
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Data');
            }
       });
    }
    
    deleteOne(app) {
        app.delete('/lastBook', function (req, res) {
            let lastBookId = req.body.id;
            console.log("Estoy deleteando " + lastBookId);
            if (lastBookId) {
                let oldLastBookId = this.bookDao.deleteLastBook(+lastBookId);
                if (Number.isInteger(oldLastBookId) && oldLastBookId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(oldLastBookId);
                } else {
                    let reqError = functions.getRequestError(oldLastBookId);
                    res.status(reqError.code)        // HTTP status 204: NotContent
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed Data');
            }
        });
    };
    
}
    
module.exports = LastBookProvider;
    