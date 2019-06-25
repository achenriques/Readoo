module.exports = {
    allUsers: "SELECT * FROM appUser ;",
    oneUser: "SELECT *, '' as userPass FROM appUser WHERE userId = ? ; ",
    updateUser: "UPDATE appUser SET userName = ? , userSurname = ? , userNick = ? , " + 
        "userPass = ? , userEmail = ? , userAboutMe = ? , userAvatarUrl = ? WHERE userId = ? ;",
    insertUser: "INSERT INTO appUser (userName, userSurname, userNick, userPass, userEmail, userAboutMe, userKarma, userAvatarUrl, userVisible)" + 
        "VALUES (?, ?, ?, ?, ?, ?, 0, ?, 1) ; ",
    dissableUser: "UPDATE appUser SET userVisible = 0 WHERE userId = ? ;",
    deleteUser: "DELETE FROM appUser WHERE userId = ? ;"
}