module.exports = {
    loginEmail: "SELECT * FROM AppUser WHERE userEmail = ? and userVisible = TRUE ;",
    loginNick: "SELECT * FROM AppUser WHERE userNick = ? and userVisible = TRUE ;",
    loginIsMe: "SELECT *, '' AS userPass FROM AppUser WHERE userId = ? ;",
    avaliableEmail: "SELECT userId FROM AppUser WHERE userEmail = ? ;",
    avaliableNick: "SELECT userId FROM AppUser WHERE userNick = ? ;",
    addUser: "INSERT INTO AppUser (userId, userNick, userPass, userEmail, userName, userSurname, " + 
        "userKarma, userLanguage, userAvatarUrl, userVisible) VALUES (0, ?, ?, ?, '', '', 0, ?, NULL, 1) ;",
    informLog: "INSERT INTO LoginRegister (userId, loginRegisterDate) VALUES (?, CURRENT_TIMESTAMP()) ;"
}