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
    getMyBooks: " SELECT @row_number as total, bookId, bookTitle, bookAuthor, bookDescription, bookReview, bookLikes, bookDate, bookCoverUrl, userId, genreId, userAvatarUrl " +
            " FROM ( SELECT (@row_number:=@row_number + 1) AS row_num, b.bookId, bookTitle, b.bookAuthor, " +
            "  b.bookDescription, b.bookReview, b.bookLikes, b.bookDate, b.bookCoverUrl, b.userId, b.genreId, u.userAvatarUrl  " +
            "  FROM book b INNER JOIN app_user u ON u.userId = ? AND u.userId = b.userId AND b.bookVisible = 1 " +
            " GROUP BY row_num, b.bookId, bookTitle, b.bookAuthor, b.bookDescription, b.bookReview, b.bookLikes, " + 
            "  b.bookDate, b.bookCoverUrl, b.userId, b.genreId, u.userAvatarUrl " +
            " ) AS fav, (SELECT @row_number:= 1) AS it WHERE fav.row_num BETWEEN ? AND ? OR (? = TRUE AND fav.row_num BETWEEN @row_number AND @row_number - ?) ;",
    getFavourites: " SELECT @row_number as total, bookId, bookTitle, bookAuthor, bookDescription, bookReview, bookLikes, bookDate, bookCoverUrl, userId, genreId, userAvatarUrl " +
            " FROM ( SELECT (@row_number:=@row_number + 1) AS row_num, b.bookId, bookTitle, b.bookAuthor, " +
            "  b.bookDescription, b.bookReview, b.bookLikes, b.bookDate, b.bookCoverUrl, b.userId, b.genreId, u.userAvatarUrl  " +
            "  FROM book b INNER JOIN user_likes_book l ON l.userId = ? AND l.bookId = b.bookId AND b.bookVisible = 1 " + 
            "  INNER JOIN app_user u ON u.userId = b.userId " +
            " GROUP BY row_num, b.bookId, bookTitle, b.bookAuthor, b.bookDescription, b.bookReview, b.bookLikes, " + 
            "  b.bookDate, b.bookCoverUrl, b.userId, b.genreId, u.userAvatarUrl " +
            " ) AS fav, (SELECT @row_number:= 1) AS it WHERE fav.row_num BETWEEN ? AND ? OR (? = TRUE AND fav.row_num BETWEEN @row_number AND @row_number - ?) ;",
    insertBook: "INSERT INTO book (bookId, bookTitle, bookAuthor, bookDescription, bookReview, " +
            " bookLikes, bookDate, bookCoverUrl, userId, genreId, bookVisible) " + 
            " VALUES (0, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP(), ?, ?, ?, 1) ;",
    dissableBook: "UPDATE book SET bookVisible = 0 WHERE bookId = ? AND userId = ? ;",
    deleteBookLikes: "DELETE FROM user_likes_book WHERE bookId = ? AND userId = ? ;",
    lessKarma: "UPDATE app_user u INNER JOIN book b ON b.bookId = ? AND b.userId = u.userId " + 
            "SET u.userKarma = (CASE WHEN userKarma - b.bookLikes < 0 THEN 0 ELSE userKarma - b.bookLikes END) ;",
    deleteBook: "DELETE FROM book WHERE bookId = ? ;"
}