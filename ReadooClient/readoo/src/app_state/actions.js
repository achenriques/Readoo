import axios from 'axios';
import { NUM_OF_BOOKS, NUM_OF_COMENTARIES, REST_DEFAULT } from '../constants/appConstants';
import loginApi from '../api/loginApi';
import bookApi from '../api/bookApi';
import userApi from '../api/userApi';
const baseURL = 'http://localhost:3030';

//ACTION TYPES
const actionTypes = {
    TAB_CHANGE: 'TAB_CHANGE',
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
    CHECK_TOKEN: 'CHECK_TOKEN',
    MODAL_ADD_BOOK: 'MODAL_ADD_BOOK',
    UPLOAD_BOOK: 'UPLOAD_BOOK',
    DO_LOGIN: 'DO_LOGIN',
    UPLOAD_BOOK_200: 'UPLOAD_BOOK_200',
    UPLOAD_COMMENT_200: 'UPLOAD_COMMENT_200',
    UPLOAD_USER_200: 'UPLOAD_USER_200',
    FETCH_GENRES: 'FETCH_GENRES',
    NEXT_BOOK: 'NEXT_BOOK',
    BEFORE_BOOK: 'BEFORE_BOOK',
    I_LIKE_BOOK: 'I_LIKE_BOOK',
    FETCH_LIBROS: 'FETCH_LIBROS',
    FETCH_MORE_BOOKS: 'FETCH_MORE_BOOKS',
    FETCH_COMMENTARIES: 'FETCH_COMMENTARIES',
    FETCH_USER_DATA: 'FETCH_USER_DATA',
    SAVE_USER_DATA: 'SAVE_USER_DATA',
    ENVIAR_COMENTARIO: 'ENVIAR_COMENTARIO',
    SET_ERROR_ENVIAR_COMENTARIO: 'SET_ERROR_ENVIAR_COMENTARIO'
}

// Default basic auth
//axios.defaults.headers.common['Authorization'] = bAuth.bUser;

/* //ACTION CREATORS
fetchTabsInicial = (userId) => ({
  type: FETCH_TABS_INICIAL,
  promise: axios.post(
    `${baseURL}/tabs`,
    {
      id: userId
    }
  )
}) */

// Change TAB in web
const changeTab = (newTabID) => ({
    type: TAB_CHANGE,
    payload: {
        newTabID: newTabID
    }
})

const changeLanguage = (languageCode) => ({
    type: CHANGE_LANGUAGE,
    payload: {
        languageCode: languageCode
    }
})

// check user token using JWT
const checkToken = () => ({
    type: CHECK_TOKEN,
    promise: loginApi.checkToken()
})

// Open and close Modal Of Add Book
const setIsOpenAddBook = (isOpen) => ({
    type: MODAL_ADD_BOOK,
    payload: {
        isOpen: isOpen
    }
})

// Action of upload a new Book
const uploadBook = (bookData) => ({
    type: UPLOAD_BOOK,
    //payload: {},
    promise: bookApi.uploadBook(bookData)
})

// Sets a flag to send alert messages in case of Failure
const setBookControllerDefault = () => ({
    type: UPLOAD_BOOK_200,
    payload: {
        value: REST_DEFAULT
    },
})

// Sets a flag to send alert messages in case of Failure
const setControllerCommentDefault = () => ({
    type: UPLOAD_COMMENT_200,
    payload: {
        value: REST_DEFAULT
    },
})

// Setear la carga de datos para la subida de datos de usuario.
// Se utiliza para mostrar mensajes de alerta
const setControllerUserDefault = () => ({
    type: UPLOAD_USER_200,
    payload: {
        value: REST_DEFAULT
    },
})

const fetchGenres = () => ({
    type: FETCH_GENRES,
    promise: bookApi.fetchGenres
})

const nextBook = () => ({
    type: NEXT_BOOK,
})

const beforeBook = () => ({
    type: BEFORE_BOOK,
})

const doLikeBook = (bookId, userId) => ({
    type: I_LIKE_BOOK,
    payload: { like: true},
    promise: userApi.doLikeBook(bookId, userId)
})

const doDislikeBook = (bookId, userId) => ({
    type: I_LIKE_BOOK,
    payload: { bookId: bookId, like: false},
    promise: userApi.doDislikeBook(bookId, userId)
})

const fetchBooks = (lastBookId, genres, firstTime) => ({
    type: FETCH_LIBROS,
    payload: { firstTime: firstTime },
    promise: bookApi.fetchBooks(lastBookId, genres, NUM_OF_BOOKS)
})

const fetchMoreBooks = (lastBookId, genres) => ({
    type: FETCH_MORE_BOOKS,
    promise: bookApi.fetchMoreBooks(lastBookId,genres, NUM_OF_BOOKS)
})

const doLogin = () => ({
    type: DO_LOGIN,
    promise: loginApi.doLogin(nickEmail, pass)
})

const fetchCommentaries = (bookId, nCommentaries, lastDate) => ({
    type: FETCH_COMMENTARIES,
    promise: bookApi.fetchCommentaries(bookId, nCommentaries, lastDate)
})

const fetchUserData = (userId) => ({
    type: FETCH_USER_DATA,
    promise: userApi.fetchUserData(userId)
})

const saveUserData = (userData) => ({
    type: SAVE_USER_DATA,
    promise: userApi.saveUserData(userData)
})

const sendComment = (commentId, bookId, userId, comentText, commentFatherId) => ({
    type: ENVIAR_COMENTARIO,
    promise: bookApi.sendComment(commentId, bookId, userId, comentText, commentFatherId)
})

export default {
    changeTab,
    changeLanguage,
    checkToken,
    doLogin,
    setIsOpenAddBook,
    uploadBook,
    setBookControllerDefault,
    setControllerUserDefault,
    setControllerCommentDefault,
    fetchGenres,
    nextBook,
    beforeBook,
    doLikeBook,
    doDislikeBook,
    fetchBooks,
    fetchCommentaries,
    fetchGenres,
    fetchMoreBooks,
    fetchUserData,
    sendComment,
    saveUserData
}