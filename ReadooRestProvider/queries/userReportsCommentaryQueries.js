module.exports = {
    allReports: "SELECT * FROM user_reports_comment ;",
    oneReport: "SELECT * FROM user_reports_comment WHERE commentId = ? ;",
    insertOneReport: "INSERT INTO user_reports_comment (userId, commentId, reportText) VALUES (?, ? , ?) ;",
    deleteOneReport: "DELETE FROM user_reports_comment WHERE userId = ? AND commentId = ? ;"
}