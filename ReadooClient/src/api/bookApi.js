import axios from 'axios';
const baseURL = 'http://localhost:3030';

// Setted for evict cross-sitting error
axios.defaults.withCredentials = true;

// Default basic auth
//axios.defaults.headers.common['Authorization'] = bAuth.bUser;

const uploadBook = (bookData) => axios.post(
    `${baseURL}/book/new`,
    bookData.form,
    {
        headers: { 'Content-Type': 'multipart/form-data' }
    }
)

const fetchBooks = (userId, lastBookId, genres, numberOfBooks) => axios.post(
    `${baseURL}/book`,
    {
        last: {
            userId: userId,
            lastBookId: lastBookId,
            genres: genres,
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

const fetchSubCommentaries = (bookId, fatherCommentaryId, nCommentaries, lastDate) => axios.post(
    `${baseURL}/commentary/fetchSubs`,
    {
        bookId,
        fatherCommentaryId,
        nCommentaries,
        lastDate
    }
)

const sendComment = (commentFatherId, bookId, userId, commentText) => axios.post(
    `${baseURL}/commentary/new`,
    {
        commentFatherId,
        bookId,
        userId,
        commentText
    }
)

export default {
    uploadBook,
    fetchBooks,
    fetchMoreBooks,
    fetchGenres,
    fetchCommentaries,
    fetchSubCommentaries,
    sendComment
}