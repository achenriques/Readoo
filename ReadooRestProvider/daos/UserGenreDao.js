const queries = require('../queries/userGenreQueries');
const DaoManager = require('./DaoManager');

class UserGenreDao extends DaoManager {
    
    constructor(db) {
        super(db);
    }

    getAllUserGenre() {
        let statement = queries.allUserGenre;
        return this.executeStatment(statement);
    }

    getOneUserGenre(userId) {
        let statement = queries.oneUserGenre;
        return this.executeStatment(statement, [userId]);
    }

    updateGenres(userId, genreIds) {
        let statementDelete = queries.deleteNotUsedUserGenre;
        let statementInsertIfNotExists = queries.insertUserGenre;
        let valuesToInsert = genreIds.map(function (val) { return [userId, +val]; }, this);
        let operationOfDelete = [statementDelete, [userId, genreIds]];
        let operationOfUpdate = [statementInsertIfNotExists, [valuesToInsert]];
        let resultsArray = this.executeStatmentOnSameTransaction([operationOfDelete, operationOfUpdate]);
        return resultsArray[1];
    }

    deleteUserGenres(userId) {
        let statement = queries.deleteUsersGenres;
        return this.executeStatment(statement, [userId]);
    }
            
}

module.exports = UserGenreDao;
