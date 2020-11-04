module.exports = {
    allBooks: "SELECT * FROM book",
    getBunch: "SELECT b.*, COALESCE(u.likeBoolean, FALSE) AS user_likes_book, us.userAvatarUrl FROM book b " + 
            " LEFT JOIN user_likes_book u ON b.bookId = u.bookId AND u.userId = ? " +
            " LEFT JOIN last_user_book l ON l.userId = ? AND b.genreId = l.genreId " +
            " INNER JOIN app_user us ON us.userId = b.userId " +
            " WHERE b.bookVisible = 1 AND b.userId != ? AND (l.bookId IS NULL OR b.bookId > l.bookId) " +
            " ORDER BY b.bookDate ASC LIMIT ? ;",
    getBunchGenre: "SELECT b.*, COALESCE(u.likeBoolean, FALSE) AS user_likes_book, us.userAvatarUrl FROM book b " + 
            " LEFT JOIN user_likes_book u ON b.bookId = u.bookId AND u.userId = ? " + 
            " LEFT JOIN last_user_book l ON l.userId = ? AND b.genreId = l.genreId " +
            " INNER JOIN app_user us ON us.userId = b.userId " +
            " WHERE b.genreID IN (?) AND b.bookVisible = 1 AND b.userId != ? " +
            " AND (l.bookId IS NULL OR b.bookId > l.bookId) ORDER BY b.bookDate ASC LIMIT ? ;",
    getMyBooks: "WITH fav AS ( SELECT ROW_NUMBER() OVER ( ORDER BY b.bookDate DESC ) AS row_num, b.*, u.userAvatarUrl " +
            " FROM book b INNER JOIN app_user u ON u.userId = ? AND u.userId = b.userId AND b.bookVisible = 1 ), " +
            " total AS ( SELECT COUNT(*) AS total FROM fav ) " +
            " SELECT total, bookId, bookTitle, bookAuthor, bookDescription, bookReview, bookLikes, bookDate, bookCoverUrl, " +
            " userId, genreId, userAvatarUrl FROM fav CROSS JOIN total WHERE fav.row_num BETWEEN ? AND ? " + 
            " OR (? = TRUE AND fav.row_num BETWEEN TOTAL AND TOTAL - ?); ",
    getFavourites: "WITH fav AS ( SELECT ROW_NUMBER() OVER ( ORDER BY b.bookDate DESC ) AS row_num, b.*, u.userAvatarUrl " +
            " FROM book b INNER JOIN user_likes_book l " + 
            " ON l.userId = ? AND l.bookId = b.bookId AND b.bookVisible = 1 INNER JOIN app_user u ON u.userId = b.userId ), " +
            " total AS ( SELECT COUNT(*) AS total FROM fav ) " +
            " SELECT total, bookId, bookTitle, bookAuthor, bookDescription, bookReview, bookLikes, bookDate, bookCoverUrl, " +
            " userId, genreId, userAvatarUrl FROM fav CROSS JOIN total WHERE fav.row_num BETWEEN ? AND ? " +
            " OR (? = TRUE AND fav.row_num BETWEEN TOTAL AND TOTAL - ?) ; ",
    insertBook: "INSERT INTO book (bookId, bookTitle, bookAuthor, bookDescription, bookReview, " +
            " bookLikes, bookDate, bookCoverUrl, userId, genreId, bookVisible) " + 
            " VALUES (0, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP(), ?, ?, ?, 1) ;",
    dissableBook: "UPDATE book SET bookVisible = 0 WHERE bookId = ? AND userId = ? ;",
    deleteBookLikes: "DELETE FROM user_likes_book WHERE bookId = ? AND userId = ? ;",
    lessKarma: "UPDATE app_user u INNER JOIN book b ON b.bookId = ? AND b.userId = u.userId " + 
            "SET u.userKarma = (CASE WHEN userKarma - b.bookLikes < 0 THEN 0 ELSE userKarma - b.bookLikes END) ;",
    deleteBook: "DELETE FROM book WHERE bookId = ? ;"
}