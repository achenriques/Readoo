module.exports = {
    allCommentary: "SELECT * FROM userCommentsBook ;",
    oneBookCommentaries: "SELECT * FROM userCommentsBook WHERE bookId = ? ;",
    subCommentaries: "SELECT * FROM userCommentsBook WHERE libro_idLibro = ? AND commentFatherId = ? ;",
    buchOfCommentaries: "SELECT c.commentId, c.userId, c.bookId, c.commentDate, c.commentText, " +
        " c.commentFatherId, c2.commentId AS commentId2, c2.userId AS userId2, c2.commentDate AS commentDate2, " + 
        " c2.commentText AS commentText2, u.userAvatarUrl, u2.userAvatarUrl AS userAvatarUrl2" + 
        " FROM userCommentsBook c INNER JOIN appUser u ON c.userId = u.userId " +
        " LEFT JOIN userCommentsBook c2 ON c.commentFatherId IS NOT NULL AND c.commentFatherId = c2.commentId " +
        " LEFT JOIN appUser u2 ON c2.userId = u2.userId " +
        " WHERE c.bookId = ? AND c.commentDate < ? " + 
        " ORDER BY c.commentDate DESC LIMIT ? ;",
    buchOfCommentariesWithoutDate: "SELECT c.commentId, c.userId, c.bookId, c.commentDate, c.commentText, " +
        " c.commentFatherId, c2.commentId AS commentId2, c2.userId AS userId2, c2.commentDate AS commentDate2, " + 
        " c2.commentText AS commentText2, u.userAvatarUrl, u2.userAvatarUrl AS userAvatarUrl2" + 
        " FROM userCommentsBook c INNER JOIN appUser u ON c.userId = u.userId " +
        " LEFT JOIN userCommentsBook c2 ON c.commentFatherId IS NOT NULL AND c.commentFatherId = c2.commentId " +
        " LEFT JOIN appUser u2 ON c2.userId = u2.userId " +
        " WHERE c.bookId = ? " + 
        " GROUP BY c.commentId, c.userId, c.bookId, c.commentDate, c.commentText, u.userAvatarUrl, c.commentFatherId, u.userAvatarUrl " +
        " ORDER BY c.commentDate DESC LIMIT ? ;",
    insertOne: "INSERT INTO userCommentsBook (commentId, userId, bookId, commentDate, commentText, commentFatherId, commentVisible) " + 
        "VALUES ( 0, ?, ?, CURRENT_TIMESTAMP(), ?, ?, 1) ; ",
    dissableCommentary: "UPDATE userCommentsBook SET commentVissible = 0 WHERE bookId = ? ; ",
    deleteCommentary: "DELETE FROM userCommentsBook WHERE commentId = ? ; ",
}