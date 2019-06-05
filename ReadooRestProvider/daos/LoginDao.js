const queries = require('../queries/loginQueries');
const DaoManager = require('./DaoManager');

class LoginDao extends DaoManager{
    
    constructor(db) {
        super(db);
    }

    logUser(email, pass) {
        let statement = (email.includes("@")) ? queries.logginEmail : queries.logginNick; 
        return this.executeStatment(statement, [email, pass], function (result) { result[0] });
    }

    isMeLogged(userId) {
        let statement = queries.logginIsMe;
        return this.executeStatment(statement, [userId]);
    }

    addUser(nick, pass, email, preferedLanguage) {
        let statement = queries.addUser;
        return this.executeStatment(statement, [nick, pass, email, preferedLanguage]);
    }
            
            
}

module.exports = LoginDao;