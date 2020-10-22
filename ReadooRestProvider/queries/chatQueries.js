module.exports = {
    allChats: "SELECT * FROM chat_history ;",
    chatHistory: "SELECT * FROM chat_history WHERE userIdFrom = ? OR userIdTo = ? ORDER BY chatDateTime DESC ; ",
    chatBunch: "SELECT * FROM chat_message WHERE chatHistoryId = ? ORDER BY chatDateTime DESC ; ",
    sendMessage: "INSERT INTO chat_message (chatHistoryId, userId, message) VALUES (?, ?, ?) ; ",
    deleteConversation: "DELETE FROM chat_history WHERE chatHistoryId = ? ;"
}