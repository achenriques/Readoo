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
);

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
);

const fetchMoreBooks = (userId, lastBookId, numberOfBooks) => axios.post(
    `${baseURL}/book`,
    {
        last: {
            userId,
            lastBookId,
            numberOfBooks
        }
    }
);

// ---- RELATED WITH BOOKS -----
const fetchGenres = () => axios.get(
    `${baseURL}/genre`,
    {}
);

const fetchCommentaries = (bookId, nCommentaries, lastDate) => axios.post(
    `${baseURL}/commentary/fetch`,
    {
        bookId,
        nCommentaries,
        lastDate
    }
);

const fetchSubCommentaries = (bookId, fatherCommentaryId, nCommentaries, lastDate) => axios.post(
    `${baseURL}/commentary/fetchSubs`,
    {
        bookId,
        fatherCommentaryId,
        nCommentaries,
        lastDate
    }
);

const sendComment = (commentFatherId, bookId, userId, commentText) => axios.post(
    `${baseURL}/commentary/new`,
    {
        commentFatherId,
        bookId,
        userId,
        commentText
    }
);

const saveLastUserBook = (userId, bookId, genreId) => axios.post(
    `${baseURL}/lastBook`,
    {
        lastBook: {
            userId,
            bookId,
            genreId
        }
    }
);

const fetchFavourites = (userId, page, booksPerPage, myUploads) => axios.post(
    `${baseURL}/bookFavourites`,
    {
        favourite: {
            userId,
            page,
            booksPerPage,
            myUploads
        }
    }
);

const unsubscribeBook = (bookId, userId) => axios.post(
    `${baseURL}/dissableBook`,
    {
        bookId,
        userId
    }
);

export default {
    uploadBook,
    fetchBooks,
    fetchMoreBooks,
    fetchGenres,
    fetchCommentaries,
    fetchSubCommentaries,
    sendComment,
    saveLastUserBook,
    fetchFavourites,
    unsubscribeBook
}