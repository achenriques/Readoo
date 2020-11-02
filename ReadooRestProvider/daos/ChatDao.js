const queries = require('../queries/chatQueries');
const DaoManager = require('./DaoManager');

class ChatDao extends DaoManager {
    
    constructor(db) {
        super(db);
    }

    getAll() {
        let statement = queries.allChats;
        return this.executeStatment(statement);
    }

    getHistory(userId) {
        let statement = queries.chatHistory;
        return this.executeStatment(statement, [userId, userId]);
    }

    getChatById(chatId) {
        let statement = queries.chatBunch;
        return this.executeStatment(statement, [chatId]);
    }

    insertOne(userIdFrom, userIdTo) {
        let statement = queries.insertInHistory;
        return this.executeStatment(statement, [userIdFrom, userIdTo]);
    }

    saveOne(chatId, userId, messageText) {
        let statement = queries.saveOne;
        return this.executeStatment(statement, [chatId, userId, messageText]);
    }

    getVisibility(chatId) {
        let statement = queries.getVisibility;
        return this.executeStatment(statement, [chatId]);
    }

    updateVisibility(chatId, chatVisibility) {
        let statement = queries.updateVisibility;
        return this.executeStatment(statement, [chatVisibility, chatId]);
    }
            
}

module.exports = ChatDao;