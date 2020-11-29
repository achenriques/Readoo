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

    getOneChatId(userIdFrom, userIdTo) {
        let statement = queries.getOneChatId;
        return this.executeStatment(statement, [userIdFrom, userIdTo, userIdTo, userIdFrom]);
    }

    insertOne(userIdFrom, userIdTo) {
        let statement = queries.insertInHistory;
        return this.executeStatment(statement, [userIdFrom, userIdTo, userIdFrom, userIdTo, userIdTo, userIdFrom]);
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

    updateVisibility2(userIdFrom, userIdTo) {
        let statement = queries.updateVisibility2;
        return this.executeStatment(statement, [userIdFrom, userIdTo, userIdTo, userIdFrom]);
    }
            
}

module.exports = ChatDao;