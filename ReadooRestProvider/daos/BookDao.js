const queries = require('../queries/bookQueries');
const DaoManager = require('./DaoManager');

class BookDao extends DaoManager {
    
    constructor(db) {
        super(db);
    }

    getAllBook() {
        let statement = queries.allBooks;
        return this.executeStatment(statement);
    }

    getBunchOfBooks(userId, lastBookId, genres, lastDate, numberOfBooks) {
        let statement = "";
        let toRet = null;
        if (genres.length) {
            statement = queries.getBunchGenre;
            toRet = this.executeStatment(statement, [userId, lastBookId, genres, numberOfBooks]);
        } else {
            statement = queries.getBunch;
            toRet = this.executeStatment(statement, [userId, lastBookId, numberOfBooks]);
        }
        return toRet;
    }

    addBook(bookTitle, bookAuthor, bookDescription, bookReview, bookCoverUrl, userId, genreId) {
        let statement = queries.insertBook;
        return this.executeStatment(statement, [bookTitle, bookAuthor, bookDescription, bookReview, bookCoverUrl, userId, genreId])
    }

    dissableBook(bookId) {
        let statement = queries.dissableBook;
        return this.executeStatment(statement, [bookId]);
    }

    deleteBook(bookId) {
        let statement = queries.insertBook;
        return this.executeStatment(statement, [bookId]);
    }
            
}

module.exports = BookDao;
