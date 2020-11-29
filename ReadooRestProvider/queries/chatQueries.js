module.exports = {
    allChats: "SELECT * FROM chat_history ;",
    getOneChatId: "SELECT chatId FROM chat_history WHERE (userIdFrom = ? AND userIdTo = ?) "+ 
            " OR (userIdFrom = ? AND userIdTo = ?) ;",
    chatHistory: "SELECT c.chatId, c.userIdFrom, c.userIdTo, c.chatDateTime, " + 
            "u1.userNick as userNickFrom, u1.userAvatarUrl as userAvatarUrlFrom, " + 
            "u2.userNick AS userNickTo, u2.userAvatarUrl as userAvatarUrlTo " + 
            "FROM chat_history c INNER JOIN app_user u1 ON c.userIdFrom = u1.userId " + 
            "INNER JOIN app_user u2 ON c.userIdTo = u2.userId " +
            "WHERE (userIdFrom = ? AND (chatVisible = 'B' OR chatVisible = 'F')) " + 
            "OR (userIdTo = ? AND (chatVisible = 'B' OR chatVisible = 'T')) ORDER BY chatDateTime DESC ; ",
            // Chat visible contains a char = 'B' for both, 'F' from, 'T' to and 'N' none
    chatBunch: "SELECT * FROM chat_message WHERE chatId = ? ORDER BY messageDateTime ASC ; ",
    insertInHistory: "INSERT INTO chat_history (userIdFrom, userIdTo, chatDateTime, chatVisible) " +
            " SELECT ? AS userIdFrom, ? AS userIdTo, CURRENT_TIMESTAMP() AS chatDateTime, 'B' AS chatVisible FROM dual " + 
            " WHERE NOT EXISTS ( SELECT 1 FROM chat_history WHERE (userIdFrom = ? AND userIdTo = ?) " + 
            " OR (userIdFrom = ? AND userIdTo = ?)) ;",
    saveOne: "INSERT INTO chat_message (chatId, userId, message, messageDateTime) VALUES (?, ?, ?, CURRENT_TIMESTAMP()) ; ",
    getVisibility: "SELECT userIdFrom, userIdTo, chatVisible FROM chat_history WHERE chatId = ? ;",
    updateVisibility: "UPDATE chat_history SET chatVisible = ? WHERE chatId = ? ;",
    updateVisibility2: "UPDATE chat_history SET chatVisible = 'B' WHERE (userIdFrom = ? AND userIdTo = ?) "+ 
            " OR (userIdFrom = ? AND userIdTo = ?) ;"
}