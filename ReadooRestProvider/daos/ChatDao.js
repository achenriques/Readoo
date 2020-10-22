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
        return this.executeStatment(statement, [userId]);
    }

    getBunch(chatId) {
        let statement = queries.chatBunch;
        return this.executeStatment(statement, [chatId]);
    }

    insertOne(chatId, userId, messageText) {
        let statement = queries.sendMessage;
        return this.executeStatment(statement, [chatId, userId, messageText]);
    }

    deleteOne(chatId) {
        let statement = queries.deleteConversation;
        return this.executeStatment(statement, [chatId]);
    }
            
}

module.exports = BookDao;