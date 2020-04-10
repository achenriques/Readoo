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
        // If we have new genres we delete those that we do not want to be in the DB and insert the new ones.
        if (genreIds.length) {
            let statementDelete = queries.deleteNotUsedUserGenre;
            let statementInsertIfNotExists = queries.insertUserGenre;
            let valuesToInsert = genreIds.map(function (val) { return [userId, +val]; }, this);
            let operationOfDelete = [statementDelete, [userId, genreIds]];
            let operationOfUpdate = [statementInsertIfNotExists, [valuesToInsert]];
            return this.executeStatmentOnSameTransaction([operationOfDelete, operationOfUpdate]);
        } else {
            // In other case we only have to delete all the relationships between users and genres
            let statementDelete = queries.deleteUsersGenres;
            return this.executeStatment(statementDelete, userId);
        }
    
    }

    deleteUserGenres(userId) {
        let statement = queries.deleteUsersGenres;
        return this.executeStatment(statement, [userId]);
    }
            
}

module.exports = UserGenreDao;
