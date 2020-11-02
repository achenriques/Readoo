module.exports = {
    loginEmail: "SELECT * FROM app_user WHERE userEmail = ? and userVisible = TRUE ;",
    loginNick: "SELECT * FROM app_user WHERE userNick = ? and userVisible = TRUE ;",
    loginIsMe: "SELECT u.*, '' AS userPass, GROUP_CONCAT(g.genreId ORDER BY g.genreId ASC) AS userGenres " +
            "FROM app_user u LEFT JOIN user_genre g ON u.userId = g.userId WHERE u.userId = ? ;",
    avaliableEmail: "SELECT userId FROM app_user WHERE userEmail = ? ;",
    avaliableNick: "SELECT userId FROM app_user WHERE userNick = ? ;",
    addUser: "INSERT INTO app_user (userId, userNick, userPass, userEmail, userName, userSurname, " + 
        "userKarma, userLanguage, userAvatarUrl, userVisible) VALUES (0, ?, ?, ?, '', '', 0, ?, NULL, 1) ;",
    informLog: "INSERT INTO login_register (userId, loginRegisterDate) VALUES (?, CURRENT_TIMESTAMP()) ;",
    changeLanguage: "UPDATE app_user SET userLanguage = ? WHERE userId = ? ;"
}