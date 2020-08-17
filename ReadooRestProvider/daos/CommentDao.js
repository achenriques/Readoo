const queries = require('../queries/commentQueries');
const DaoManager = require('./DaoManager');

class BookDao extends DaoManager{
    
    constructor(db) {
        super(db);
    }

    getAllCommentary() {
        let statement = queries.allCommentary;
        return this.executeStatment(statement);
    }

    getCommentaryById(bookId) {
        let statement = queries.oneCommentary;
        return this.executeStatment(statement, [bookId]);
    }

    getBunchOfCommentaries(bookId, commentDate, commentLimit) {
        let statement = "";
        if (commentDate) {
            statement = queries.bunchOfCommentaries;
            return this.executeStatment(statement, [bookId, commentDate, commentLimit]);
        } else {
            statement = queries.bunchOfCommentariesWithoutDate;
            return this.executeStatment(statement, [bookId, commentLimit]);
        }
    }

    getNumberOfSubCommentaries(commentaryIdsList) {
        let statement = "";
        statement = queries.getNumberOfSubCommentaries;
        return this.executeStatment(statement, [commentaryIdsList]);
    }

    getBunchOfSubCommentaries(bookId, commentaryIds, commentLimit) {
        let statement = queries.bunchOfSubCommentaries;;
        return this.executeStatment(statement, [bookId, commentaryIds, commentLimit]);        
    }

    addCommentary(userId, bookId, commentary, commentFatherId) {
        let statement = queries.insertOne;
        return this.executeStatment(statement, [userId, bookId, commentary, commentFatherId]);
    }

    dissableCommentary(commentaryId) {
        let statement = queries.dissableBook;
        return this.executeStatment(statement, [commentaryId]);
    }

    deleteCommentary(commentaryId) {
        let statement = queries.dissableCommentary;
        return this.executeStatment(statement, [commentaryId]);
    }
            
}

module.exports = BookDao;
