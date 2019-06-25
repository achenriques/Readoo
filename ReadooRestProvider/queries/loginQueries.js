module.exports = {
    loginEmail: "SELECT * FROM AppUser WHERE userEmail = ? ;",
    loginNick: "SELECT * FROM AppUser WHERE userNick = ? ;",
    loginIsMe: "SELECT *, '' AS userPass FROM AppUser WHERE userId = ? ;",
    avaliableEmail: "SELECT userId FROM AppUser WHERE userEmail = ? ;",
    avaliableNick: "SELECT userId FROM AppUser WHERE userNick = ? ;",
    addUser: "INSERT INTO AppUser (userId, userNick, userPass, userEmail, userName, userSurname, " + 
        "userKarma, userLanguage, userAvatarUrl, userVisible) VALUES (0, ?, ?, ?, '', '', 0, ?, NULL, 1) ;"
}