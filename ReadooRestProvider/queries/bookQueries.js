module.exports = {
    allBooks: "SELECT * FROM book",
    getBunch: "SELECT b.*, COALESCE(u.likeBoolean, FALSE) AS userLikesBook, us.userAvatarUrl FROM book b " + 
            " LEFT JOIN userlikesbook u ON b.bookId = u.bookId AND u.userId = ? " +
            " LEFT JOIN lastuserbook l ON l.userId = ? AND b.genreId = l.genreId " +
            " INNER JOIN appUser us ON us.userId = b.userId " +
            " WHERE b.bookVisible = 1 AND (l.bookId IS NULL OR b.bookId > l.bookId) " +
            " ORDER BY b.bookDate ASC LIMIT ? ;",
    getBunchGenre: "SELECT b.*, COALESCE(u.likeBoolean, FALSE) AS userLikesBook, us.userAvatarUrl FROM book b " + 
            " LEFT JOIN userlikesbook u ON b.bookId = u.bookId AND u.userId = ? " + 
            " LEFT JOIN lastuserbook l ON l.userId = ? AND b.genreId = l.genreId " +
            " INNER JOIN appUser us ON us.userId = b.userId " +
            " WHERE b.genreID IN (?) AND b.bookVisible = 1 AND (l.bookId IS NULL OR b.bookId > l.bookId) " +
            " ORDER BY b.bookDate ASC LIMIT ? ;",
    getFavourites: "WITH fav AS ( SELECT ROW_NUMBER() OVER ( ORDER BY b.bookDate ASC ) AS row_num, b.*, u.userAvatarUrl " +
            " FROM book b INNER JOIN userLikesBook l " + 
            " ON l.userId = ? AND l.bookId = b.bookId AND b.bookVisible = 1 INNER JOIN appUser u ON u.userId = b.userId) " + 
            " SELECT bookId, bookTitle, bookAuthor, bookDescription, bookReview, bookLikes, bookDate, bookCoverUrl, " +
            " userId, genreId, userAvatarUrl FROM fav WHERE fav.row_num BETWEEN ? AND ? ; ",
    insertBook: "INSERT INTO book (bookId, bookTitle, bookAuthor, bookDescription, bookReview, " +
            " bookLikes, bookDate, bookCoverUrl, userId, genreId, bookVisible) " + 
            " VALUES (0, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP(), ?, ?, ?, 1) ;",
    dissableBook: "UPDATE book SET bookVisible = 0 WHERE bookId = ? ;",
    deleteBook: "DELETE FROM book WHERE bookId = ? ;",
}