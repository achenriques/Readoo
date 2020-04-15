const queries = require('../queries/userLikesBookQueries');
const DaoManager = require('./DaoManager');

class UserLikesBookDao extends DaoManager{
    
    constructor(db) {
        super(db);
    }

    getAllUsersLikes() {
        let statement = queries.allUserLikes;
        return this.executeStatment(statement);
    }

    oneUserLike(userId) {
        let statement = queries.oneUserLike;
        return this.executeStatment(statement, [userId]);
    }

    oneUserBookLike(userId, bookId) {
        let statement = queries.oneUserBookLike;
        return this.executeStatment(statement, [userId, bookId])
    }

    insertOrUpdateUserLike(userId, bookId) {
        let statementUserLikesBook = queries.insertUserLike;
        let statementBookLikesCounter = queries.updateBookCounter;
        let operationOfInsert = [statementUserLikesBook, [userId, bookId]];
        let operationOfUpdate = [statementBookLikesCounter, [+1, +1, bookId]];
        return this.executeStatmentOnSameTransaction([operationOfInsert, operationOfUpdate]);
    }
    
    updateUserBookLike(userId, bookId, likeBoolean) {
        let statement = queries.updateUserLike;
        return this.executeStatment(statement, [userId, bookId, likeBoolean]);
    }

    deleteUserLikes(userId, bookId) {
        let statementDeleteUserLikesBook = queries.deleteUserLikes;
        let statementBookLikesCounter = queries.updateBookCounter;
        let operationOfDelete = [statementDeleteUserLikesBook, [userId, bookId]];
        let operationOfUpdate = [statementBookLikesCounter, [-1, -1, bookId]];
        return this.executeStatmentOnSameTransaction([operationOfDelete, operationOfUpdate]);
    }        
}

module.exports = UserLikesBookDao;
