module.exports = {
    allUsers: "SELECT * FROM appUser ;",
    oneUser: "SELECT *, '' as userPass FROM appUser WHERE userId = ? ; ",
    oneUserPass: "SELECT userPass FROM appUser WHERE userId = ? ; ",
/*    
    updateUser: "UPDATE appUser SET userName = (case when ? IS NULL then userName else ? end), userSurname = (case when ? IS NULL then userSurname else ? end), " + 
        "userNick = (case when ? IS NULL then userNick else ? end) , userPass = (case when ? IS NULL then userPass else ? end) , " + 
        "userEmail = (case when ? IS NULL then userEmail else ? end) , userAboutMe = (case when ? IS NULL then userAboutMe else ? end) , " + 
        "userAvatarUrl = (case when ? IS NULL then userAvatarUrl else ? end) WHERE userId = ? ;",

    updateUser: "UPDATE appUser SET userName = ? , userSurname = ? , userNick = ? , " + 
        "userPass = ? , userEmail = ? , userAboutMe = ? , userAvatarUrl = ? WHERE userId = ? ;",
*/
    insertUser: "INSERT INTO appUser (userName, userSurname, userNick, userPass, userEmail, userAboutMe, userKarma, userAvatarUrl, userVisible)" + 
        "VALUES (?, ?, ?, ?, ?, ?, 0, ?, 1) ; ",
    dissableUser: "UPDATE appUser SET userVisible = 0 WHERE userId = ? ;",
    deleteUser: "DELETE FROM appUser WHERE userId = ? ;"
}