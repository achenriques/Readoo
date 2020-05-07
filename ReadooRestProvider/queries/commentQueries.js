module.exports = {
    allCommentary: "SELECT * FROM userCommentsBook ;",
    oneBookCommentaries: "SELECT * FROM userCommentsBook WHERE bookId = ? ;",
    subcommentaries: "SELECT * FROM userCommentsBook WHERE libro_bookId = ? AND commentFatherId = ? ;",
    bunchOfCommentaries: "SELECT c.commentId, c.userId, u.userNick, u.userAvatarUrl, c.bookId, c.commentDate, " +
        " c.commentText, c.commentFatherId " +
        " FROM userCommentsBook c INNER JOIN appUser u ON c.userId = u.userId " +
        " WHERE c.bookId = ? AND c.commentFatherId IS NULL AND c.commentDate < ? AND c.commentVisible = TRUE " + 
        " ORDER BY c.commentDate DESC LIMIT ? ;",
    bunchOfCommentariesWithoutDate: "SELECT c.commentId, c.userId, u.userNick, u.userAvatarUrl, c.bookId, c.commentDate, " +
        " c.commentText, c.commentFatherId " +
        " FROM userCommentsBook c INNER JOIN appUser u ON c.userId = u.userId " +
        " WHERE c.bookId = ? AND c.commentFatherId IS NULL AND c.commentVisible = TRUE " + 
        " ORDER BY c.commentDate DESC LIMIT ? ;",
    bunchOfSubCommentaries: "SELECT c.commentId, c.userId, u.userNick, u.userAvatarUrl, c.bookId, c.commentDate, " +
        " c.commentText, c.commentFatherId " +
        " FROM userCommentsBook c INNER JOIN appUser u ON c.userId = u.userId " +
        " WHERE c.bookId = ? AND c.commentFatherId IN (?) AND c.commentVisible = TRUE " + 
        " ORDER BY c.commentDate DESC LIMIT ? ;",
    insertOne: "INSERT INTO userCommentsBook (commentId, userId, bookId, commentDate, commentText, commentFatherId, commentVisible) " + 
        "VALUES ( 0, ?, ?, CURRENT_TIMESTAMP(), ?, ?, 1) ; ",
    dissableCommentary: "UPDATE userCommentsBook SET commentVissible = 0 WHERE bookId = ? ; ",
    deleteCommentary: "DELETE FROM userCommentsBook WHERE commentId = ? ; ",
}