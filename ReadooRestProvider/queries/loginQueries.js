module.exports = {
    loginEmail: "SELECT userId, userPass FROM AppUser WHERE userEmail = ? ;",
    loginNick: "SELECT userId, userPass FROM AppUser WHERE userNick = ? ;",
    loginIsMe: "SELECT *, '' AS pass FROM AppUser WHERE userId = ? ;",
    avaliableNick: "SELECT userId FROM AppUser WHERE userNick = ? ;",
    addUser: "INSERT INTO AppUser (userId, userNick, userPass, userEmail, userName, userSurname, " + 
        "userKarma, userLanguage, userAvatarUrl, userVisible) VALUES (0, ?, ?, ?, '', '', 0, ?, NULL, 1) ;"
}