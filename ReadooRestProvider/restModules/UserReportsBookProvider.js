const functions = require('../util/functions');
const middleware = require('./middlewares');
const UserReportsBookDao = require('../daos/UserReportsBookDao');

class UserReportsBookProvider {
    
    // This module is under construction...
    // Not functional yet
    // Just for reference

    constructor(app, db)
    {
        this.userReportsBookDao = new UserReportsBookDao(db);
        this.getAll(app);       //Get
        this.getOne(app);       //Get
        this.deleteOne(app);    //Delete
        this.insertOne(app);    // Post
    }

    getAll(app) {
        const that = this;
        app.get('/userReportsBook', function (req, res) {
            that.userReportsBookDao.getAllReports().then(function (reports) {
                return res.setHeader('Content-Type', 'application/json')
                        .send(JSON.stringify(reports));
            }).catch(function (err) {
                // Sql Err
                console.error(err);
                let reqError = functions.getRequestError(err);
                return res.status(reqError.code)
                        .send(reqError.text);
            });
        });
    }

    getOne(app) {
        const that = this;
        app.get('/userReportsBook', function (req, res) {
            let reportId = req.params.id;
            if (reportId) {
                that.userReportsBookDao.getOneReport(+reportId).then(function (reports) {
                    return res.setHeader('Content-Type', 'application/json')
                            .send(JSON.stringify(reports));
                }).catch(function (err) {
                    // Sql Err
                    console.error(err);
                    let reqError = functions.getRequestError(err);
                    return res.status(reqError.code)
                            .send(reqError.text);
                });
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                        .send('Missed Id');
            }
        });
    }

    insertOne(app) {
        const that = this;
        app.post('/userReportsBook', middleware.verifyToken, function (req, res) {
            let report = req.body.report;
            if (report && report.userId && report.bookId && report.reportText) {   
                that.userReportsBookDao.addOneReport(+report.userId, +report.bookId, report.reportText.trim()).then(function (result) {
                    return res.setHeader('Content-Type', 'application/json')
                            .send(JSON.stringify(result.insertId));
                }).catch(function (err) {
                    // Sql Err
                    console.error(err);
                    let reqError = functions.getRequestError(err);
                    return res.status(reqError.code)
                            .send(reqError.text);
                });
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                        .send('Missed data');
            }
        });
    }

    deleteOne(app) {
        const that = this;
        app.delete('/userReportsBook', middleware.verifyToken, function (req, res) {
            let idToDeleteUser = req.body.userId;
            let idToDeleteBook = req.body.bookId;          
            if (idToDeleteUser && idToDeleteBook) {
                that.userReportsBookDao.deleteOneReport(+idToDeleteUser, +idToDeleteBook).then(function (result) {
                    return res.setHeader('Content-Type', 'application/json')
                            .send(JSON.stringify(result));
                }).catch(function (err) {
                    // Sql Err
                    console.error(err);
                    let reqError = functions.getRequestError(err);
                    return res.status(reqError.code)
                            .send(reqError.text);
                });
            } else {
                return res.status(400)        // HTTP status 400: BadRequest
                        .send('Missed data');
            }
        });
    }
}

module.exports = UserReportsBookProvider;