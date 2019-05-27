import axios from 'axios';
import {} from '../constants/appConstants';
const baseURL = 'http://localhost:3030';

const uploadBook = (bookData) => axios.post(
    `${baseURL}/book/new`,
    bookData.form,
    {
        headers: { 'Content-Type': 'multipart/form-data' }
    }
)

const fetchBooks = (userId, lastBookId, numberOfBooks) => axios.post(
    `${baseURL}/book`,
    {
        last: {
            userId: userId,
            lastBookId: lastBookId,
            numberOfBooks: numberOfBooks
        }
    }
)

const fetchMoreBooks = (userId, lastBookId, numberOfBooks) => axios.post(
    `${baseURL}/book`,
    {
        last: {
            userId,
            lastBookId,
            numberOfBooks
        }
    }
)

// ---- RELATED WITH BOOKS -----
const fetchGenres = () => axios.get(
    `${baseURL}/genre`,
    {}
)

const fetchCommentaries = (bookId, nCommentaries, lastDate) => axios.post(
    `${baseURL}/commentary/fetch`,
    {
        bookId,
        nCommentaries,
        lastDate
    }
)

const sendComment = (commentId, bookId, userId, comentText, commentFatherId) => axios.post(
    `${baseURL}/commentary/new`,
    {
        commentId,
        bookId,
        userId,
        comentText
    }
)

export default {
    uploadBook,
    fetchBooks,
    fetchMoreBooks,
    fetchGenres,
    fetchCommentaries,
    sendComment
}