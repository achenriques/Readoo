module.exports = {
    loginEmail: "SELECT * FROM AppUser WHERE userEmail = ? and userVisible = TRUE ;",
    loginNick: "SELECT * FROM AppUser WHERE userNick = ? and userVisible = TRUE ;",
    loginIsMe: "SELECT u.*, '' AS userPass, GROUP_CONCAT(g.genreId ORDER BY g.genreId ASC) AS userGenres " +
            "FROM appUser u LEFT JOIN userGenre g ON u.userId = g.userId WHERE u.userId = ? ;",
    avaliableEmail: "SELECT userId FROM AppUser WHERE userEmail = ? ;",
    avaliableNick: "SELECT userId FROM AppUser WHERE userNick = ? ;",
    addUser: "INSERT INTO AppUser (userId, userNick, userPass, userEmail, userName, userSurname, " + 
        "userKarma, userLanguage, userAvatarUrl, userVisible) VALUES (0, ?, ?, ?, '', '', 0, ?, NULL, 1) ;",
    informLog: "INSERT INTO LoginRegister (userId, loginRegisterDate) VALUES (?, CURRENT_TIMESTAMP()) ;",
    changeLanguage: "UPDATE AppUser SET userLanguage = ? WHERE userId = ? ;"
}