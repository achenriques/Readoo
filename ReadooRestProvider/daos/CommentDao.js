const queries = require('../queries/commentQueries');
const DaoManager = require('./DaoManager');

class BookDao extends DaoManager{
    
    constructor(db) {
        super(db);
    }

    getAllCommentary() {
        let statement = queries.allCommentary;
        return this.executeStatment(statement);
    }

    getCommentaryById(bookId) {
        let statement = queries.oneCommentary;
        return this.executeStatment(statement, [bookId]);
    }

    getBunchOfCommentaries(bookId, commentDate, comentLimit) {
        let statement = "";
        let resultSet = null;
        if (commentDate) {
            statement = queries.buchOfCommentaries;
            resultSet = this.executeStatment(statement, [bookId, commentDate, comentLimit]);
        } else {
            statement = queries.buchOfCommentariesWithoutDate;
            resultSet = this.executeStatment(statement, [bookId, comentLimit]);
        }
        // Commentaries are prcessed to group their children
        let toRet = [];
        resultSet.forEach(function(c, index, rSet) {
            let commentaryToRet = toRet.find(function(comment) {
                return comment.commentId === c.commentId;
            });
            if (commentaryToRet !== undefined) {
                // If the commentary exits in toRet array thats means the
                //  id is unique so we only have to add the new subComments...
                commentaryToRet.subcommentaries.push({
                    commentId: c.commentId2, 
                    userId: c.userId2, 
                    bookId: c.bookId, 
                    date: c.commentDate2,
                    userAvatarUrl: c.userAvatarUrl2, 
                    commentFatherId: null,
                    subcommentaries: []
                });
            } else {
                toRet.push({
                    commentId: c.commentId, 
                    userId: c.userId, 
                    bookId: c.bookId, 
                    date: c.commentDate,
                    userAvatarUrl: c.userAvatarUrl, 
                    commentFatherId: c.commentFatherId,
                    subcommentaries: (c.commentId2 != null) ? [{
                        commentId: c.commentId2, 
                        userId: c.userId2, 
                        bookId: c.bookId, 
                        date: c.commentDate2,
                        userAvatarUrl: c.userAvatarUrl2, 
                        commentFatherId: null,
                        subcommentaries: null
                    }] : []
                });
            }
        });
       
        return toRet;
    }

    addCommentaryk(userId, bookId, commentary, commentFatherId) {
        let statement = queries.insertOne;
        return this.executeStatment(statement, [userId, bookId, commentary, commentFatherId]);
    }

    dissableCommentary(commentaryId) {
        let statement = queries.dissableBook;
        return this.executeStatment(statement, [commentaryId]);
    }

    deleteCommentary(commentaryId) {
        let statement = queries.dissableCommentary;
        return this.executeStatment(statement, [commentaryId]);
    }
            
}

module.exports = BookDao;
