module.exports = {
    allReports: "SELECT * FROM userReportsComment ;",
    oneReport: "SELECT * FROM userReportsComment WHERE commentId = ? ;",
    insertOneReport: "INSERT INTO userReportsComment (userId, commentId, reportText) VALUES (?, ? , ?) ;",
    deleteOneReport: "DELETE FROM userReportsComment WHERE userId = ? AND commentId = ? ;"
}