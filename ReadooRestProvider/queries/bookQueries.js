module.exports = {
    allBooks: "SELECT * FROM book",
    getBunch: "SELECT b.*, COALESCE(u.likeBoolean, FALSE) AS userLikesBook FROM readoo_db.book b " + 
            " LEFT JOIN readoo_db.userlikesbook u ON b.bookId = u.bookId AND u.userId = ? " +
            " LEFT JOIN readoo_db.lastuserbook l ON l.userId = ? AND b.genreId = l.genreId" +
            " WHERE b.bookVisible = 1 AND (l.bookId IS NULL OR b.bookId > l.bookId) " +
            " ORDER BY b.bookDate ASC LIMIT ? ;",
    getBunchGenre: "SELECT b.*, COALESCE(u.likeBoolean, FALSE) AS userLikesBook FROM readoo_db.book b " + 
            " LEFT JOIN readoo_db.userlikesbook u ON b.bookId = u.bookId AND u.userId = ? " + 
            " LEFT JOIN readoo_db.lastuserbook l ON l.userId = ? AND b.genreId = l.genreId" +
            " WHERE b.genreID IN (?) AND b.bookVisible = 1 AND (l.bookId IS NULL OR b.bookId > l.bookId) " +
            " ORDER BY b.bookDate ASC LIMIT ? ;",
    insertBook: "INSERT INTO book (bookId, bookTitle, bookAuthor, bookDescription, bookReview, " +
            " bookLikes, bookDate, bookCoverUrl, userId, genreId, bookVisible) " + 
            " VALUES (0, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP(), ?, ?, ?, 1) ;",
    dissableBook: "UPDATE book SET bookVisible = 0 WHERE bookId = ? ;",
    deleteBook: "DELETE FROM book WHERE bookId = ? ;",
}