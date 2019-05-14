module.exports = {
    allLastBooks: "SELECT * FROM lastUserBook ;",
    lastUsersBook: "SELECT * FROM lastUserBook WHERE userId = ? ;",
    insertUpdateLastBook: "INSERT INTO lastUserBook (userId, bookId, lastUserBookDate) " + 
        "VALUES (?, ?, CURRENT_TIMESTAMP()) ON DUPLICATE KEY UPDATE bookId = ?, lastUserBookDate = CURRENT_TIMESTAMP() ;",
    deleteLastBook: "DELETE FROM lastUserBook WHERE userId = ? ;"
}