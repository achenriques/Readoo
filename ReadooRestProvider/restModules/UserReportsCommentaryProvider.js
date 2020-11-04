const functions = require('../util/functions');
const middleware = require('./middlewares');
const UserReportsCommentDao = require('../daos/UserReportsCommentaryDao');

class UserReportsCommentaryProvider {
    
    // This module is under construction...
    // Not functional yet
    // Just for reference

    constructor(app, db)
    {
        this.userReportsCommentDao = new UserReportsCommentDao(db);
        this.getAll(app);       //Get
        this.getOne(app);       //Get
        this.deleteOne(app);    //Delete
        this.insertOne(app);    // Post
    }

    getAll(app) {
        const that = this;
        app.get('/userReportsCommentary', function (req, res) {
            let reports = this.userReportsCommentDao.getAllReports().then(function (result) {
                return res.setHeader('Content-Type', 'application/json')
                        .send(JSON.stringify(result));
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
        app.get('/userReportsCommentary/:id', function (req, res) {
            let reportId = req.params.id;
            if (reportId) {
                that.userReportsCommentDao.getOneReport(+reportId).then(function (result) {
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
                        .send('Missed Id');
            }
        });
    }

    insertOne(app) {
        const that = this;
        app.post('/userReportsCommentary', function (req, res) {
            let report = req.body.report;
            if (report && report.userId && report.commentId && report.reportText) {   
                that.userReportsCommentDao.addOneReport(+report.userId, +report.commentId, report.reportText.trim()).then(function (result) {
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
        app.delete('/userReportsCommentary', middleware.verifyToken, function (req, res) {
            let idToDeleteUser = req.body.userId;
            let idToDeleteCommentary = req.body.commentId;          
            if (idToDeleteUser && idToDeleteCommentary) {
                that.userReportsCommentDao.deleteOneReport(+idToDeleteUser, +idToDeleteCommentary).then(function (result) {
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
    };
}

module.exports = UserReportsCommentaryProvider;
    