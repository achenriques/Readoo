module.exports = {
    allLastBooks: "SELECT * FROM last_user_book ;",
    lastUsersBook: "SELECT * FROM last_user_book WHERE userId = ? AND genreId = ? ;",
    insertUpdateLastBook: "INSERT INTO last_user_book (userId, bookId, genreId, lastUserBookDate) " + 
        "VALUES (?, ?, ?, CURRENT_TIMESTAMP()) ON DUPLICATE KEY UPDATE bookId = ?, lastUserBookDate = CURRENT_TIMESTAMP() ;",
    deleteLastBook: "DELETE FROM last_user_book WHERE userId = ? ;"
}