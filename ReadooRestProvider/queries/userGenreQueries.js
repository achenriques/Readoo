module.exports = {
    allUserGenre: "SELECT * FROM userGenre ;",
    oneUserGenre: "SELECT genre FROM userGenre WHERE userId = ? ;",
    insertUserGenre: "INSERT IGNORE INTO userGenre (userId, genreId) VALUES ? ;",
    deleteNotUsedUserGenre: "DELETE FROM userGenre WHERE userId = ? AND genreId NOT IN (?) ;",
    deleteUsersGenres: "DELETE FROM userGenre WHERE userId = ? ;"
}