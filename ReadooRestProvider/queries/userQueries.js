module.exports = {
    allUsers: "SELECT * FROM app_user ;",
    oneUser: "SELECT u.userId, u.userName, u.userSurname, u.userNick, '' AS userPass, u.userEmail, u.userAboutMe, " +
        "u.userKarma, u.userAvatarUrl, u.userVisible, GROUP_CONCAT(g.genreId ORDER BY g.genreId ASC) AS userGenres " +
        "FROM app_user u LEFT JOIN user_genre g ON u.userId = g.userId WHERE u.userId = ? ",
    oneUserPass: "SELECT userPass FROM app_user WHERE userId = ? ; ",
    oneUserPreview: "SELECT u.userId, u.userNick, u.userAboutMe, " +
        "u.userKarma, u.userAvatarUrl, GROUP_CONCAT(g.genreId ORDER BY g.genreId ASC) AS userGenres " +
        "FROM app_user u LEFT JOIN user_genre g ON u.userId = g.userId WHERE u.userId = ? AND u.userVisible = 1 ;",
/*    
    updateUser: "UPDATE app_user SET userName = (case when ? IS NULL then userName else ? end), userSurname = (case when ? IS NULL then userSurname else ? end), " + 
        "userNick = (case when ? IS NULL then userNick else ? end) , userPass = (case when ? IS NULL then userPass else ? end) , " + 
        "userEmail = (case when ? IS NULL then userEmail else ? end) , userAboutMe = (case when ? IS NULL then userAboutMe else ? end) , " + 
        "userAvatarUrl = (case when ? IS NULL then userAvatarUrl else ? end) WHERE userId = ? ;",

    updateUser: "UPDATE app_user SET userName = ? , userSurname = ? , userNick = ? , " + 
        "userPass = ? , userEmail = ? , userAboutMe = ? , userAvatarUrl = ? WHERE userId = ? ;",
*/
    insertUser: "INSERT INTO app_user (userName, userSurname, userNick, userPass, userEmail, userAboutMe, userKarma, userAvatarUrl, userVisible)" + 
        "VALUES (?, ?, ?, ?, ?, ?, 0, ?, 1) ; ",
    dissableUser: "UPDATE app_user SET userVisible = FALSE WHERE userId = ? ;",
    deleteUser: "DELETE FROM app_user WHERE userId = ? ;"
}