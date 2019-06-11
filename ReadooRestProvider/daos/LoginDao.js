const queries = require('../queries/loginQueries');
const DaoManager = require('./DaoManager');

class LoginDao extends DaoManager{
    
    constructor(db) {
        super(db);
    }

    logUser(email, pass) {
        let statement = (email.includes("@")) ? queries.loginEmail : queries.loginNick; 
        return this.executeStatment(statement, [email, pass], function (result) { return result[0] });
    }

    isMeLogged(userId) {
        let statement = queries.loginIsMe;
        return this.executeStatment(statement, [userId]);
    }

    getIsNickAvaliable(nick) {
        let statement = queries.avaliableNick;
        return this.executeStatment(statement, [nick]);
    }

    addUser(nick, pass, email, preferedLanguage) {
        let statement = queries.addUser;
        return this.executeStatment(statement, [nick, pass, email, preferedLanguage]);
    }
            
            
}

module.exports = LoginDao;