module.exports = {
    allUserLikes: "SELECT * FROM user_likes_book ;",
    oneUserLike: "SELECT * FROM user_likes_book WHERE userId = ? ;",
    oneUserBookLike: "SELECT * FROM user_likes_book WHERE userId = ? AND bookId = ? ;",
    insertUserLike: "INSERT IGNORE INTO user_likes_book (userId, bookId, likeBoolean) VALUES (?, ?, 1) ;",
    updateUserLike: "UPDATE user_likes_book SET likeBoolean = ? WHERE userId = ? AND bookId = ? ;",
    deleteUserLikes: "DELETE FROM user_likes_book WHERE userId = ? AND bookId = ? ;",
    updateBookCounter: "UPDATE book SET bookLikes = CASE WHEN ? > 0 THEN bookLikes + 1 WHEN ? < 0 AND bookLikes > 0 THEN bookLikes -1 ELSE bookLikes END WHERE bookId = ? ;",
    updateKarma: "UPDATE app_user u INNER JOIN book b ON b.bookId = ? AND b.userId = u.userId SET u.userKarma = CASE " + 
            "WHEN ? > 0 THEN u.userKarma + 1 WHEN ? < 0 AND u.userKarma > 0 THEN u.userKarma -1 ELSE u.userKarma END ;"
}