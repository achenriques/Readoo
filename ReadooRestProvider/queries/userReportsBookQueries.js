module.exports = {
    allReports: "SELECT * FROM user_reports_book ;",
    oneReport: "SELECT * FROM user_reports_book WHERE bookId = ? ;",
    insertOneReport: "INSERT INTO user_reports_book (userId, bookId, reportText) VALUES (?, ? , ?) ;",
    deleteOneReport: "DELETE FROM user_reports_book WHERE userId = ? AND bookId = ? ;"
}