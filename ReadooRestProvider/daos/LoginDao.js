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

    addUser(nick, email, pass) {
        let statement = queries.addUser;
        return this.executeStatment(statement, [nick, email, pass]);
    }
            
            
}

module.exports = LoginDao;