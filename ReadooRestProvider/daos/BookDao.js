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

    getBunchOfBooks(userId, genres, lastDate, numberOfBooks) {
        let statement = "";
        let toRet = null;
        if (genres.length) {
            statement = queries.getBunchGenre;
            toRet = this.executeStatment(statement, [userId, userId, genres, numberOfBooks]);
        } else {
            statement = queries.getBunch;
            toRet = this.executeStatment(statement, [userId, userId, numberOfBooks]);
        }
        return toRet;
    }

    getBunchOfFavourites(userId, betweenA, betweenB, myUploads, isPage0, booksPerPage) {
        let statement = (myUploads) ? queries.getMyBooks : queries.getFavourites;
        return this.executeStatment(statement, [userId, betweenA, betweenB, isPage0, booksPerPage]);
    }

    addBook(bookTitle, bookAuthor, bookDescription, bookReview, bookCoverUrl, userId, genreId) {
        let statement = queries.insertBook;
        return this.executeStatment(statement, [bookTitle, bookAuthor, bookDescription, bookReview, bookCoverUrl, userId, genreId]);
    }

    dissableBook(bookId) {
        let disableStatement = queries.dissableBook;
        let deleteLikesStatement = queries.deleteBookLikes;
        let lessKarmaStatement = queries.lessKarma;
        let operationOfDisable = [disableStatement, [bookId]];
        let operationOfDeleteLikes = [deleteLikesStatement, [bookId, userId]];
        let operationOfLessKarma = [lessKarmaStatement, [bookId]];
        return this.executeStatmentOnSameTransaction([operationOfDisable, operationOfDeleteLikes, operationOfLessKarma]);
    }

    deleteBook(bookId) {
        let statement = queries.insertBook;
        return this.executeStatment(statement, [bookId]);
    }
            
}

module.exports = BookDao;
