import { NUM_OF_BOOKS, NUM_OF_COMENTARIES, REST_DEFAULT } from '../constants/appConstants';
import loginApi from '../api/loginApi';
import bookApi from '../api/bookApi';
import userApi from '../api/userApi';

//ACTION TYPES
const actionTypes = {
    TAB_CHANGE: 'TAB_CHANGE',
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
    CHECK_TOKEN: 'CHECK_TOKEN',
    MODAL_ADD_BOOK: 'MODAL_ADD_BOOK',
    UPLOAD_BOOK: 'UPLOAD_BOOK',
    DO_LOGIN: 'DO_LOGIN',
    DO_LOG_OUT: 'DO_LOG_OUT',
    DO_REGISTER: 'DO_REGISTER',
    DONE_REGISTER: 'DONE_REGISTER',
    CHECK_NICK: 'CHECK_NICK',
    CHECK_EMAIL: 'CHECK_EMAIL',
    CHECKED_NICK: 'CHECKED_NICK',
    CHECKED_EMAIL: 'CHECKED_EMAIL',
    FETCH_GENRES: 'FETCH_GENRES',
    FETCH_USER_GENRES: 'FETCH_USER_GENRES',
    NEXT_BOOK: 'NEXT_BOOK',
    BEFORE_BOOK: 'BEFORE_BOOK',
    I_LIKE_BOOK: 'I_LIKE_BOOK',
    FETCH_LIBROS: 'FETCH_LIBROS',
    FETCH_MORE_BOOKS: 'FETCH_MORE_BOOKS',
    FETCH_COMMENTARIES: 'FETCH_COMMENTARIES',
    FETCH_USER_DATA: 'FETCH_USER_DATA',
    FETCH_USER_AVATAR: 'FETCH_USER_AVATAR',
    SAVE_USER_DATA: 'SAVE_USER_DATA',
    DELETE_USER: 'DELETE_USER',
    SEND_COMMENTARY: 'SEND_COMMENTARY',
    RESET_LOADS: 'RESET_LOADS',
    RESET_ERRORS: 'RESET_ERRORS',
    RESET_PROCCESS: 'RESET_PROCCESS',
    REPORT_ERROR_MESSAGE: 'REPORT_ERROR_MESSAGE'
}

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
    type: actionTypes.TAB_CHANGE,
    payload: {
        newTabID: newTabID
    }
})

const resetErrLog = () => ({
    type: actionTypes.RESET_ERRORS,
    payload: {
        err: []
    }
})

const resetLoadLog = () => ({
    type: actionTypes.RESET_LOADS,
    payload: {
        load: []
    }
})

const resetProccess = (proccessName) => ({
    type: actionTypes.RESET_PROCCESS,
    payload: {
        nameOfProcess: proccessName
    }
})

const changeLanguage = (languageCode) => ({
    type: actionTypes.CHANGE_LANGUAGE,
    payload: {
        languageCode: languageCode
    }
})

// check user token using JWT
const checkToken = () => ({
    type: actionTypes.CHECK_TOKEN,
    promise: loginApi.checkToken()
})

// Open and close Modal Of Add Book
const setIsOpenAddBook = (isOpen) => ({
    type: actionTypes.MODAL_ADD_BOOK,
    payload: {
        isOpen: isOpen
    }
})

// Action of upload a new Book
const uploadBook = (bookData) => ({
    type: actionTypes.UPLOAD_BOOK,
    //payload: {},
    promise: bookApi.uploadBook(bookData)
})

const fetchGenres = () => ({
    type: actionTypes.FETCH_GENRES,
    promise: bookApi.fetchGenres()
})

const fetchUserGenres = () => ({
    type: actionTypes.FETCH_USER_GENRES,
    promise: userApi.fetchUserGenres()
})

const nextBook = () => ({
    type: actionTypes.NEXT_BOOK,
})

const beforeBook = () => ({
    type: actionTypes.BEFORE_BOOK,
})

const doLikeBook = (bookId, userId) => ({
    type: actionTypes.I_LIKE_BOOK,
    payload: { like: true},
    promise: userApi.doLikeBook(bookId, userId)
})

const doDislikeBook = (bookId, userId) => ({
    type: actionTypes.I_LIKE_BOOK,
    payload: { bookId: bookId, like: false},
    promise: userApi.doDislikeBook(bookId, userId)
})

const fetchBooks = (lastBookId, genres, firstTime) => ({
    type: actionTypes.FETCH_LIBROS,
    payload: { firstTime: firstTime },
    promise: bookApi.fetchBooks(lastBookId, genres, NUM_OF_BOOKS)
})

const fetchMoreBooks = (lastBookId, genres) => ({
    type: actionTypes.FETCH_MORE_BOOKS,
    promise: bookApi.fetchMoreBooks(lastBookId,genres, NUM_OF_BOOKS)
})

const doLogin = (nickEmail, pass, language) => ({
    type: actionTypes.DO_LOGIN,
    payload: { preferedLanguage: language },
    promise: loginApi.doLogin(nickEmail, pass)
})

const doLogOut = () => ({
    type: actionTypes.DO_LOG_OUT,
    promise: loginApi.doLogOut()
})

const doRegister = (nickEmail, pass, email, language) => ({
    type: actionTypes.DO_REGISTER,
    payload: { nickEmail, pass, email, preferedLanguage: language },
    promise: loginApi.doRegister(nickEmail, pass, email, language)
})

const doneRegister = () => ({
    type: actionTypes.DONE_REGISTER
})

const checkNickIsUnique = (nick) => ({
    type: actionTypes.CHECK_NICK,
    payload: { nick },
    promise: loginApi.checkNickIsUnique(nick)
})

const checkEmailIsUnique = (email) => ({
    type: actionTypes.CHECK_EMAIL,
    payload: { email },
    promise: loginApi.checkEmailIsUnique(email)
})

const setNickIsUniqueFalse = () => ({
    type: actionTypes.CHECKED_NICK
})

const setEmailIsUniqueFalse = () => ({
    type: actionTypes.CHECKED_EMAIL
})

const fetchCommentaries = (bookId, nCommentaries, lastDate) => ({
    type: actionTypes.FETCH_COMMENTARIES,
    promise: bookApi.fetchCommentaries(bookId, nCommentaries, lastDate)
})

const fetchUserData = (userId) => ({
    type: actionTypes.FETCH_USER_DATA,
    promise: userApi.fetchUserData(userId)
})

const fetchUserAvatar = (avatarUrl) => ({
    type: actionTypes.FETCH_USER_AVATAR,
    promise: userApi.fetchUserAvatar(avatarUrl)
})


const saveUserData = (userData) => ({
    type: actionTypes.SAVE_USER_DATA,
    promise: userApi.saveUserData(userData)
})

const dissableUser = (userId) => ({
    type: actionTypes.DELETE_USER,
    promise: userApi.dissableUser(userId)
})

const sendComment = (commentId, bookId, userId, comentText, commentFatherId) => ({
    type: actionTypes.SEND_COMMENTARY,
    promise: bookApi.sendComment(commentId, bookId, userId, comentText, commentFatherId)
})

const reportErrorMessage = (errorMsg) => ({
    type: actionTypes.REPORT_ERROR_MESSAGE,
    payload: { errorMsg }
})

export {
    actionTypes,
    changeTab,
    resetErrLog,
    resetLoadLog,
    resetProccess,
    changeLanguage,
    checkToken,
    doLogin,
    doLogOut,
    doRegister,
    doneRegister,
    checkNickIsUnique,
    checkEmailIsUnique,
    setNickIsUniqueFalse,
    setEmailIsUniqueFalse,
    setIsOpenAddBook,
    uploadBook,
    fetchGenres,
    nextBook,
    beforeBook,
    doLikeBook,
    doDislikeBook,
    fetchBooks,
    fetchCommentaries,
    fetchMoreBooks,
    fetchUserData,
    fetchUserGenres,
    fetchUserAvatar,
    sendComment,
    saveUserData,
    dissableUser,
    reportErrorMessage
}