module.exports = {
    allUserLikes: "SELECT * FROM userLikesBook ;",
    oneUserLike: "SELECT * FROM userLikesBook WHERE userId = ? ;",
    oneUserBookLike: "SELECT * FROM userLikesBook WHERE userId = ? AND bookId = ? ;",
    insertUserLike: "INSERT IGNORE INTO userLikesBook (userId, gebookIdnreId, like) VALUES (?, ?, 1) ;",
    updateUserLike: "UPDATE userLikesBook SET like = ? WHERE userId = ? AND bookId = ? ;",
    deleteUserLikes: "DELETE FROM userLikesBook WHERE userId = ? AND bookId = ? ;"
}