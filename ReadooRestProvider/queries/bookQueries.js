module.exports = {
    allBooks: "SELECT * FROM book",
    getBunch: "SELECT b.*, COALESCE(u.likeBoolean, FALSE) AS userLikesBook FROM readoo_db.book b " + 
            " LEFT JOIN readoo_db.userlikesbook u ON b.bookId = u.bookId AND u.userId = ? " + 
            " WHERE b.bookId > ? AND b.bookVisible = 1 LIMIT ? ;",
    getBunchGenre: "SELECT b.*, COALESCE(u.likeBoolean, FALSE) AS userLikesBook FROM readoo_db.book b " + 
            " LEFT JOIN readoo_db.userlikesbook u ON b.bookId = u.bookId AND u.userId = ? " + 
            " WHERE b.bookId > ? AND b.genreID IN ? AND b.bookVisible = 1 LIMIT ? ;",
    insertBook: "INSERT INTO book (bookId, bookTitle, bookAuthor, bookDescription, bookReview, bookLikes, bookDate, bookCoverUrl, userId, genreId, bookVisible) " + 
        " VALUES (0, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP(), ?, ?, ?, 1) ;",
    dissableBook: "UPDATE book SET bookVisible = 0 WHERE bookId = ? ;",
    deleteBook: "DELETE FROM book WHERE bookId = ? ;",
}