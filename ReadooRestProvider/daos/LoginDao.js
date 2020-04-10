const queries = require('../queries/loginQueries');
const DaoManager = require('./DaoManager');

class LoginDao extends DaoManager{
    
    constructor(db) {
        super(db);
    }

    logUser(emailOrNick) {
        let statement = (emailOrNick.includes("@")) ? queries.loginEmail : queries.loginNick; 
        return this.executeStatment(statement, [emailOrNick], function (result) { return result[0] });
    }

    isMeLogged(userId) {
        let statement = queries.loginIsMe;
        return this.executeStatment(statement, [userId], function (result) { return result[0] });
    }

    getIsNickAvaliable(nick) {
        let statement = queries.avaliableNick;
        return this.executeStatment(statement, [nick]);
    }

    getIsEmailAvaliable(email) {
        let statement = queries.avaliableEmail;
        return this.executeStatment(statement, [email]);
    }

    addUser(nick, pass, email, preferedLanguage) {
        let statement = queries.addUser;
        return this.executeStatment(statement, [nick, pass, email, preferedLanguage]);
    }

    registerLog(userId) {
        let statement = queries.informLog;
        return this.executeStatment(statement, [userId]);
    }
            
}

module.exports = LoginDao;