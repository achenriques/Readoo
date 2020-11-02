module.exports = {
    allUserLikes: "SELECT * FROM user_likes_book ;",
    oneUserLike: "SELECT * FROM user_likes_book WHERE userId = ? ;",
    oneUserBookLike: "SELECT * FROM user_likes_book WHERE userId = ? AND bookId = ? ;",
    insertUserLike: "INSERT IGNORE INTO user_likes_book (userId, bookId, likeBoolean) VALUES (?, ?, 1) ;",
    updateUserLike: "UPDATE user_likes_book SET likeBoolean = ? WHERE userId = ? AND bookId = ? ;",
    deleteUserLikes: "DELETE FROM user_likes_book WHERE userId = ? AND bookId = ? ;",
    updateBookCounter: "UPDATE book SET bookLikes = CASE WHEN ? > 0 THEN bookLikes + 1 WHEN ? < 0 AND bookLikes > 0 THEN bookLikes -1 ELSE bookLikes END WHERE bookId = ? ;",
    updateKarma: "UPDATE app_user SET userKarma = CASE WHEN ? > 0 THEN userKarma + 1 WHEN ? < 0 AND userKarma > 0 THEN userKarma -1 ELSE userKarma END WHERE userId = ? ;"
}