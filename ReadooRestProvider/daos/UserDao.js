const queries = require('../queries/userQueries');
const DaoManager = require('./DaoManager');

class UserDao extends DaoManager {
    
    constructor(db) {
        super(db);
    }

    getAllUser() {
        let statement = queries.allUsers;
        return this.executeStatment(statement);
    }

    getOneUser(userId) {
        let statement = queries.oneUser;
        return this.executeStatment(statement, [userId], function (result) { return result[0] });
    }

    updateOneUser(userName, userSurname, userNick, userPass, userEmail, userAboutMe, userAvatarUrl, userId) {
        let statement = "UPDATE appUser SET ";
        let params = [];
        // It needs a compound query to update only the props that at this step are not null
        if(userName !== null) {
            statement = statement + "userName = ?, "
            params.push(userName);
        }
        if (userSurname !== null) {
            statement = statement + "userSurname = ?, "
            params.push(userSurname);
        }
        if (userNick !== null) {
            statement = statement + "userNick = ?, "
            params.push(userNick);
        }
        if (userPass !== null) {
            statement = statement + "userPass = ?, "
            params.push(userPass);
        }
        if (userEmail !== null) {
            statement = statement + "userEmail = ?, "
            params.push(userEmail);
        }
        if (userAboutMe !== null) {
            statement = statement + "userAboutMe = ?, "
            params.push(userAboutMe);
        }
        if (userAvatarUrl !== null) {
            statement = statement + "userAvatarUrl = ?, "
            params.push(userAvatarUrl);
        }
        statement = statement.slice(0, statement.length -2);    // Remove last 2 chars ', '
        statement = statement + " WHERE userId = ? ;";
        params.push(userId);
        return this.executeStatment(statement, params);
    }

    insertOneUser(userName, userSurname, userNick, userPass, userEmail, userAboutMe, userAvatarUrl) {
        let statement = queries.insertUser;
        return this.executeStatment(statement, [userName, userSurname, userNick, userPass, userEmail, userAboutMe, userAvatarUrl]);
    }

    dissableOneUser(userId) {
        let statement = queries.dissableUser;
        return this.executeStatment(statement, [userId]);
    }

    deleteOneUser(userId) {
        let statement = queries.deleteUser;
        return this.executeStatment(statement, [userId]);
    }      
}

module.exports = UserDao;
