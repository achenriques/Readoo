const queries = require('../queries/userReportsBookQueries');
const DaoManager = require('./DaoManager');

class UserReportsBookDao extends DaoManager {
    
    constructor(db) {
        super(db);
    }

    getAllReports() {
        let statement = queries.allReports;
        return this.executeStatment(statement);
    }

    getOneReport(bookId) {
        let statement = queries.oneReport;
        return this.executeStatment(statement, [bookId]);
    }

    insertOneReport(userId, bookId, reportText) {
        let statement = queries.insertOneReport;
        return this.executeStatment(statement, [userId, bookId, reportText]);
    }

    deleteOneUser(userId, bookId) {
        let statement = queries.deleteOneReport;
        return this.executeStatment(statement, [userId, bookId]);
    }      
}

module.exports = UserReportsBookDao;
