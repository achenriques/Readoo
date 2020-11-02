module.exports = {
    allCommentary: "SELECT * FROM user_comments_book ;",
    oneBookCommentaries: "SELECT * FROM user_comments_book WHERE bookId = ? ;",
    subcommentaries: "SELECT * FROM user_comments_book WHERE libro_bookId = ? AND commentFatherId = ? ;",
    bunchOfCommentaries: "SELECT c.commentId, c.userId, u.userNick, u.userAvatarUrl, c.bookId, c.commentDate, " +
        " c.commentText, c.commentFatherId " +
        " FROM user_comments_book c INNER JOIN app_user u ON c.userId = u.userId " +
        " WHERE c.bookId = ? AND c.commentFatherId IS NULL AND c.commentDate < ? AND c.commentVisible = TRUE " + 
        " ORDER BY c.commentDate DESC LIMIT ? ;",
    bunchOfCommentariesWithoutDate: "SELECT c.commentId, c.userId, u.userNick, u.userAvatarUrl, c.bookId, c.commentDate, " +
        " c.commentText, c.commentFatherId " +
        " FROM user_comments_book c INNER JOIN app_user u ON c.userId = u.userId " +
        " WHERE c.bookId = ? AND c.commentFatherId IS NULL AND c.commentVisible = TRUE " + 
        " ORDER BY c.commentDate DESC LIMIT ? ;",
    bunchOfSubCommentaries: "SELECT c.commentId, c.userId, u.userNick, u.userAvatarUrl, c.bookId, c.commentDate, " +
        " c.commentText, c.commentFatherId " +
        " FROM user_comments_book c INNER JOIN app_user u ON c.userId = u.userId " +
        " WHERE c.bookId = ? AND c.commentFatherId IN (?) AND c.commentVisible = TRUE " + 
        " ORDER BY c.commentDate DESC LIMIT ? ;",
    getNumberOfSubCommentaries: 'SELECT commentFatherId, count(commentFatherId) AS nAnswers FROM user_comments_book WHERE commentFatherId IN (?) GROUP BY commentFatherId ; ',
    insertOne: "INSERT INTO user_comments_book (commentId, userId, bookId, commentDate, commentText, commentFatherId, commentVisible) " + 
        "VALUES ( 0, ?, ?, CURRENT_TIMESTAMP(), ?, ?, 1) ; ",
    dissableCommentary: "UPDATE user_comments_book SET commentVissible = 0 WHERE bookId = ? ; ",
    deleteCommentary: "DELETE FROM user_comments_book WHERE commentId = ? ; ",
}