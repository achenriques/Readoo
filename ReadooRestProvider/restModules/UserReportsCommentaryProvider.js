const middleware = require('./middlewares');
const UserReportsCommentDao = require('../daos/UserReportsCommentaryDao');

class UserReportsCommentaryProvider {
    
    userReportsCommentDao = null

    constructor(app, db)
    {
        this.userReportsCommentDao = new UserReportsCommentDao(db);
        this.getAll(app);       //Get
        this.getOne(app);       //Get
        this.deleteOne(app);    //Delete
        this.insertOne(app);    // Post
    }

    getAll(app) {
        app.get('/userReportsCommentary', function (req, res) {
            let reports = this.userReportsCommentDao.getAllReports();
            if (Number.isNaN(reports)) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(reports));
                //res.json(reports);
            } else {
                // Sql Err
                let reqError = functions.getRequestError(reports);
                res.status(reqError.code)
                    .send(reqError.text);
            }
        });
    }

    getOne(app) {
        app.get('/userReportsCommentary/:id', function (req, res) {
            let reportId = req.params.id;
            console.log("Estoy getteando " + reportId);     
            if (reportId) {
                let report = this.userReportsCommentDao.getOneReport(+reportId);
                if (Number.isNaN(report)) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(report));
                    //res.json(report);
                } else {
                    // Sql Err
                    let reqError = functions.getRequestError(report);
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
        app.post('/userReportsCommentary', function (req, res) {
            let report = req.body.report;
            console.log("Estoy insertando reporte " + report);     
            if (report && report.userId && report.commentId && report.reportText) {   
                let newReportId = this.userReportsCommentDao.addOneReport(+report.userId, +report.commentId, report.reportText.trim());
                if (Number.isInteger(newReportId) && newReportId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(newReportId);
                } else {
                    let reqError = functions.getRequestError(newReportId);
                    res.status(reqError.code)        
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed data');
            }
        });
    }

    deleteOne(app) {
        app.delete('/userReportsCommentary', middleware.verifyToken, function (req, res) {
            let idToDeleteUser = req.body.userId;
            let idToDeleteCommentary = req.body.commentId;          
            console.log("Estoy deleteando " + idToDeleteUser + " - " + idToDeleteCommentary);
            if (idToDeleteUser && idToDeleteCommentary) {
                let oldReportId = this.userReportsCommentDao.deleteOneReport(+idToDeleteUser, +idToDeleteCommentary);
                if (Number.isInteger(oldReportId) && oldReportId > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(oldReportId);
                } else {
                    let reqError = functions.getRequestError(oldReportId);
                    res.status(reqError.code)        
                        .send(reqError.text);
                }
            } else {
                res.status(400)        // HTTP status 400: BadRequest
                    .send('Missed data');
            }
        });
    };
}

module.exports = UserReportsCommentaryProvider;
    