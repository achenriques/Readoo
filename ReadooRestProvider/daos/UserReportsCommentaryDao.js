const queries = require('../queries/userReportsCommentaryQueries');
const DaoManager = require('./DaoManager');

class UserReportsCommentaryDao extends DaoManager {
    
    constructor(db) {
        super(db);
    }

    getAllReports() {
        let statement = queries.allReports;
        return this.executeStatment(statement);
    }

    getOneReport(commentId) {
        let statement = queries.oneReport;
        return this.executeStatment(statement, [commentId]);
    }

    insertOneReport(userId, commentId, reportText) {
        let statement = queries.insertOneReport;
        return this.executeStatment(statement, [userId, commentId, reportText]);
    }

    deleteOneUser(userId, commentId) {
        let statement = queries.deleteOneReport;
        return this.executeStatment(statement, [userId, commentId]);
    }      
}

module.exports = UserReportsCommentaryDao;
