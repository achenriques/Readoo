module.exports = {
    logginEmail: "SELECT userId, userPass FROM AppUser WHERE userEmail = ? ;",
    logginNick: "SELECT userId, userPass FROM AppUser WHERE logginNick = ? ;",
    logginIsMe: "SELECT *, '' AS pass FROM AppUser WHERE userId = ? ;",
    addUser: "INSERT INTO AppUser (userId, userNick, userPass, userEmail, userName, userSurname, " + 
        "userKarma, userLanguage, userAvatarUrl, userVisible) VALUES (0, ?, ?, ?, '', '', 0, ?, NULL, 1) ;"
}