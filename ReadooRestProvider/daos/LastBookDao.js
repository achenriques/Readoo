const queries = require('../queries/lastBookQueries');
const DaoManager = require('./DaoManager');

class LastBookDao extends DaoManager {
    
    constructor(db) {
        super(db);
    }

    getAllLastBooks() {
        let statement = queries.allLastBooks;
        return this.executeStatment(statement);
    }

    getLastBook(userId, genreId) {
        let statement = queries.lastUsersBook;
        return this.executeStatment(statement, [userId, genreId]);
    }

    addOrUpdateBook(userId, bookId, genreId) {
        let statement = queries.insertUpdateLastBook;
        return this.executeStatment(statement, [userId, bookId, genreId, bookId])
    }

    deleteLastBook(bookId) {
        let statement = queries.deleteLastBook;
        return this.executeStatment(statement, [bookId]);
    }
            
}

module.exports = LastBookDao;
