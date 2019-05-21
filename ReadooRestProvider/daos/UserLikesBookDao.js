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
        let statement = queries.insertUserLike;
        return this.executeStatment(statement, [userId, bookId]);
    }
    
    updateUserBookLike(userId, bookId, likeBoolean) {
        let statement = queries.updateUserLike;
        return this.executeStatment(statement, [userId, bookId, likeBoolean]);
    }

    deleteUserLikes(userId, bookId) {
        let statement = queries.deleteUserLikes;
        return this.executeStatment(statement, [userId, bookId]);
    }        
}

module.exports = UserLikesBookDao;
