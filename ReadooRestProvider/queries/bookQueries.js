module.exports = {
    allBooks: "SELECT * FROM book",
    getBunch: "SELECT * FROM libro WHERE idLibro > ? AND bookVisible = 1 LIMIT ? ;",
    getBunchGenre: "SELECT * FROM libro WHERE bookId > ? AND genreId IN ? AND bookVisible = 1 LIMIT ? ;",
    insertBook: "INSERT INTO book (bookId, bookTitle, bookAuthor, bookDescription, bookReview, bookLikes, bookDate, bookCoverUrl, userId, genreId, bookVisible) " + 
        " VALUES (0, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP(), ?, ?, ?, 1) ;",
    dissableBook: "UPDATE book SET bookVisible = 0 WHERE bookId = ? ;",
    deleteBook: "DELETE FROM book WHERE bookId = ? ;",
}