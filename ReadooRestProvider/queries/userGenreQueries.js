module.exports = {
    allUserGenre: "SELECT * FROM user_genre ;",
    oneUserGenre: "SELECT genreId FROM user_genre WHERE userId = ? ;",
    insertUserGenre: "INSERT IGNORE INTO user_genre (userId, genreId) VALUES ? ;",
    deleteNotUsedUserGenre: "DELETE FROM user_genre WHERE userId = ? AND genreId NOT IN (?) ;",
    deleteUsersGenres: "DELETE FROM user_genre WHERE userId = ? ;"
}