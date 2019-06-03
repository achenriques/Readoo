const middleware = require('./middlewares');
const UserReportsBookDao = require('../daos/UserReportsBookDao');

class UserReportsBookProvider {
    
    constructor(app, db)
    {
        this.userReportsBookDao = new UserReportsBookDao(db);
        this.getAll(app);        //Get
        this.getOne(app);       //Get
        this.deleteOne(app);    //Delete
        this.insertOne(app);    // Post
    }

    getAll(app) {
        app.get('/userReportsBook', function (req, res) {
            let reports = this.userReportsBookDao.getAllReports();
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
        app.get('/userReportsBook/:id', function (req, res) {
            let reportId = req.params.id;
            console.log("Estoy getteando " + reportId);     
            if (reportId) {
                let report = this.userReportsBookDao.getOneReport(+reportId);
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
        app.post('/userReportsBook', middleware.verifyToken, function (req, res) {
            let report = req.body.report;
            console.log("Estoy insertando reporte " + report);     
            if (report && report.userId && report.bookId && report.reportText) {   
                let newReportId = this.userReportsBookDao.addOneReport(+report.userId, +report.bookId, report.reportText.trim());
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
        app.delete('/userReportsBook', middleware.verifyToken, function (req, res) {
        let idToDeleteUser = req.body.userId;
        let idToDeleteBook = req.body.bookId;          
        console.log("Estoy deleteando " + idToDeleteUser + " - " + idToDeleteBook);
        if (idToDeleteUser && idToDeleteBook) {
            let oldReportId = this.userReportsBookDao.deleteOneReport(+idToDeleteUser, +idToDeleteBook);
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
    }
}

module.exports = UserReportsBookProvider;