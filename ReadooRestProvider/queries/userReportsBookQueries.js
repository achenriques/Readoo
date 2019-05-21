module.exports = {
    allReports: "SELECT * FROM userReportsBook ;",
    oneReport: "SELECT * FROM userReportsBook WHERE bookId = ? ;",
    insertOneReport: "INSERT INTO userReportsBook (userId, bookId, reportText) VALUES (?, ? , ?) ;",
    deleteOneReport: "DELETE FROM userReportsBook WHERE userId = ? AND bookId = ? ;"
}