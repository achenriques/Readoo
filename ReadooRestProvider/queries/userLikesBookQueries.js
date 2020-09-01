module.exports = {
    allUserLikes: "SELECT * FROM userLikesBook ;",
    oneUserLike: "SELECT * FROM userLikesBook WHERE userId = ? ;",
    oneUserBookLike: "SELECT * FROM userLikesBook WHERE userId = ? AND bookId = ? ;",
    insertUserLike: "INSERT IGNORE INTO userLikesBook (userId, bookId, likeBoolean) VALUES (?, ?, 1) ;",
    updateUserLike: "UPDATE userLikesBook SET likeBoolean = ? WHERE userId = ? AND bookId = ? ;",
    deleteUserLikes: "DELETE FROM userLikesBook WHERE userId = ? AND bookId = ? ;",
    updateBookCounter: "UPDATE book SET bookLikes = CASE WHEN ? > 0 THEN bookLikes + 1 WHEN ? < 0 AND bookLikes > 0 THEN bookLikes -1 ELSE bookLikes END WHERE bookId = ? ;",
    updateKarma: "UPDATE appUser SET userKarma = CASE WHEN ? > 0 THEN userKarma + 1 WHEN ? < 0 AND userKarma > 0 THEN userKarma -1 ELSE userKarma END WHERE userId = ? ;"
}