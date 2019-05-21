const queries = require('../queries/userQueries');
const DaoManager = require('./DaoManager');

class UserDao extends DaoManager {
    
    constructor(db) {
        super(db);
    }

    getAllUser() {
        let statement = queries.allUser;
        return this.executeStatment(statement);
    }

    getOneUser(userId) {
        let statement = queries.oneUser;
        return this.executeStatment(statement, [userId]);
    }

    updateOneUser(userName, userSurname, userNick, userPass, userEmail, userAboutMe, userAvatarUrl, userId) {
        let statement = queries.updateUser;
        return this.executeStatment(statement, [userName, userSurname, userNick, userPass, userEmail, userAboutMe, userAvatarUrl, userId]);
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
