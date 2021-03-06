import { NUM_OF_BOOKS } from '../constants/appConstants';
import loginApi from '../api/loginApi';
import bookApi from '../api/bookApi';
import userApi from '../api/userApi';
import chatApi from '../api/chatApi'

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
    FETCH_BOOKS: 'FETCH_BOOKS',
    FETCH_MORE_BOOKS: 'FETCH_MORE_BOOKS',
    FETCH_COMMENTARIES: 'FETCH_COMMENTARIES',
    FETCH_SUB_COMMENTARIES: 'FETCH_SUB_COMMENTARIES',
    FETCH_FAVOURITES: 'FETCH_FAVOURITES',
    FAVOURITE_PAGE_REQUEST: 'FAVOURITE_PAGE_REQUEST',
    SET_FAVOURITE_LOAD_PAGE: 'SET_FAVOURITE_LOAD_PAGE',
    FETCH_USER_DATA: 'FETCH_USER_DATA',
    FETCH_USER_PREVIEW_DATA: 'FETCH_USER_PREVIEW_DATA',
    FETCH_USER_AVATAR: 'FETCH_USER_AVATAR',
    SAVE_USER_DATA: 'SAVE_USER_DATA',
    DELETE_USER: 'DELETE_USER',
    WRITE_COMMENTARY: 'WRITE_COMMENTARY',
    SEND_COMMENTARY: 'SEND_COMMENTARY',
    GO_CHAT_WITH: 'GO_CHAT_WITH',
    RECIVED_GO_CHAT_WITH: 'RECIVED_GO_CHAT_WITH',
    FETCH_CHAT_HISTORY: 'FETCH_CHAT_HISTORY',
    FETCH_CHAT_MESSAGES: 'FETCH_CHAT_MESSAGES',
    CLOSE_CONVERSATION: 'CLOSE_CONVERSATION',
    DELETE_CHAT: 'DELETE_CHAT',
    DELETE_BOOK: 'DELETE_BOOK',
    RESET_LOADS: 'RESET_LOADS',
    RESET_ERRORS: 'RESET_ERRORS',
    RESET_PROCCESS: 'RESET_PROCCESS',
    REPORT_ERROR_MESSAGE: 'REPORT_ERROR_MESSAGE'
};

/* //ACTION CREATORS
fetchTabsInicial = (userId) => ({
  type: FETCH_TABS_INICIAL,
  promise: axios.post(
    `${baseURL}/tabs`,
    {
      id: userId
    }
  )
}); */

// Change TAB in web
const changeTab = (newTabID) => 
{
    // we do not need to wait a respose
    loginApi.setTabSelector(newTabID);

    return ({
        type: actionTypes.TAB_CHANGE,
        payload: {
            newTabID: newTabID
        }
    });
}


const resetErrLog = () => ({
    type: actionTypes.RESET_ERRORS,
    payload: {
        err: []
    }
});

const resetLoadLog = () => ({
    type: actionTypes.RESET_LOADS,
    payload: {
        load: []
    }
});

const resetProccess = (proccessName) => ({
    type: actionTypes.RESET_PROCCESS,
    payload: {
        nameOfProcess: proccessName
    }
});

const changeLanguage = (languageCode, userIsLogin) => {
     // we do not need to wait a respose
     if (userIsLogin) {
        loginApi.setLanguageSelected(languageCode);
     }

    return {
        type: actionTypes.CHANGE_LANGUAGE,
        payload: {
            languageCode: languageCode
        }
    }
};

// check user token using JWT
const checkToken = () => ({
    type: actionTypes.CHECK_TOKEN,
    promise: loginApi.checkToken()
});

// Open and close Modal Of Add Book
const setIsOpenAddBook = (isOpen) => ({
    type: actionTypes.MODAL_ADD_BOOK,
    payload: {
        isOpen: isOpen
    }
});

// Action of upload a new Book
const uploadBook = (bookData) => ({
    type: actionTypes.UPLOAD_BOOK,
    //payload: {},
    promise: bookApi.uploadBook(bookData)
});

const fetchGenres = () => ({
    type: actionTypes.FETCH_GENRES,
    promise: bookApi.fetchGenres()
});

const fetchUserGenres = () => ({
    type: actionTypes.FETCH_USER_GENRES,
    promise: userApi.fetchUserGenres()
});

const nextBook = (userId, bookId, genreId) => ({
    type: actionTypes.NEXT_BOOK,
    promise: bookApi.saveLastUserBook(userId, bookId, genreId)
});

const beforeBook = () => ({
    type: actionTypes.BEFORE_BOOK,
});

const doLikeBook = (bookId, userId) => ({
    type: actionTypes.I_LIKE_BOOK,
    payload: { bookId, like: true},
    promise: userApi.doLikeBook(bookId, userId)
});

const doDislikeBook = (bookId, userId) => ({
    type: actionTypes.I_LIKE_BOOK,
    payload: { bookId: bookId, like: false},
    promise: userApi.doDislikeBook(bookId, userId)
});

const fetchBooks = (userId, lastBookId, genres, firstTime) => ({
    type: actionTypes.FETCH_BOOKS,
    payload: { firstTime: firstTime },
    promise: bookApi.fetchBooks(+userId, +lastBookId, genres, NUM_OF_BOOKS)
});

const fetchMoreBooks = (lastBookId, genres) => ({
    type: actionTypes.FETCH_MORE_BOOKS,
    promise: bookApi.fetchMoreBooks(lastBookId,genres, NUM_OF_BOOKS)
});

const doLogin = (nickEmail, pass, language) => ({
    type: actionTypes.DO_LOGIN,
    payload: { preferedLanguage: language },
    promise: loginApi.doLogin(nickEmail, pass)
});

const doLogOut = () => ({
    type: actionTypes.DO_LOG_OUT,
    promise: loginApi.doLogOut()
});

const doRegister = (nickEmail, pass, email, language) => ({
    type: actionTypes.DO_REGISTER,
    payload: { nickEmail, pass, email, preferedLanguage: language },
    promise: loginApi.doRegister(nickEmail, pass, email, language)
});

const doneRegister = () => ({
    type: actionTypes.DONE_REGISTER
});

const checkNickIsUnique = (nick) => ({
    type: actionTypes.CHECK_NICK,
    payload: { nick },
    promise: loginApi.checkNickIsUnique(nick)
});

const checkEmailIsUnique = (email) => ({
    type: actionTypes.CHECK_EMAIL,
    payload: { email },
    promise: loginApi.checkEmailIsUnique(email)
});

const setNickIsUniqueFalse = () => ({
    type: actionTypes.CHECKED_NICK
});

const setEmailIsUniqueFalse = () => ({
    type: actionTypes.CHECKED_EMAIL
});

const fetchCommentaries = (bookId, nCommentaries, lastDate, fetchMore) => ({
    type: actionTypes.FETCH_COMMENTARIES,
    payload: { fetchMore },
    promise: bookApi.fetchCommentaries(bookId, nCommentaries, lastDate)
});

const fetchSubCommentaries = (bookId, fatherCommentaryId, nCommentaries, lastDate, fetchMore) => ({
    type: actionTypes.FETCH_SUB_COMMENTARIES,
    payload: { fetchMore },
    promise: bookApi.fetchSubCommentaries(bookId, fatherCommentaryId, nCommentaries, lastDate)
});

const fetchUserData = (userId, isPreview) => ({
    type: (!isPreview) ? actionTypes.FETCH_USER_DATA : actionTypes.FETCH_USER_PREVIEW_DATA,
    promise: userApi.fetchUserData(userId, isPreview)
});

const fetchUserAvatar = (avatarUrl) => ({
    type: actionTypes.FETCH_USER_AVATAR,
    promise: userApi.fetchUserAvatar(avatarUrl)
});


const saveUserData = (newUserData, userDataForm) => ({
    type: actionTypes.SAVE_USER_DATA,
    payload: { newUserData },
    promise: userApi.saveUserData(userDataForm)
});

const dissableUser = (userId) => ({
    type: actionTypes.DELETE_USER,
    promise: userApi.dissableUser(userId)
});

const writeComment = (newComment) => ({
    type: actionTypes.WRITE_COMMENTARY,
    payload: { newComment },
});

const sendComment = (newComment) => ({
    type: actionTypes.SEND_COMMENTARY,
    payload: { newComment },
    promise: bookApi.sendComment(newComment.commentFatherId, newComment.bookId, newComment.userId, newComment.commentText)
});

const favouritePageRequest = (buttonCode, fetchData, loadingPage) => ({
    type: actionTypes.FAVOURITE_PAGE_REQUEST,
    payload: { buttonCode, fetchData, loadingPage }
});

const setLoadingPage = (nPage) => ({
    type: actionTypes.SET_FAVOURITE_LOAD_PAGE,
    payload: { nPage }
});

const fetchFavourites = (userId, page, booksPerPage, myUploads, buttonCode) => ({
    type: actionTypes.FETCH_FAVOURITES,
    payload: { page, booksPerPage, myUploads, buttonCode },
    promise: bookApi.fetchFavourites(userId, page, booksPerPage, myUploads)
});

const unsubscribeBook = (bookId, userId) => ({
    type: actionTypes.DELETE_BOOK,
    payload: {bookId, userId},
    promise: bookApi.unsubscribeBook(bookId, userId)
});

const fetchChatHistory = (userId) => ({
    type: actionTypes.FETCH_CHAT_HISTORY,
    payload: {userId},
    promise: chatApi.fetchChatHistory(userId)
});

const fetchChatMessages = (chatId, userId) => ({
    type: actionTypes.FETCH_CHAT_MESSAGES,
    payload: {chatId, userId},
    promise: chatApi.fetchChatMessages(chatId, userId)
});

const deleteChat = (chatId, userId) => ({
    type: actionTypes.DELETE_CHAT,
    payload: {chatId, userId},
    promise: chatApi.deleteChat(chatId, userId)
});

const goChatWith = (otherUserId) => ({
    type: actionTypes.GO_CHAT_WITH,
    payload: { otherUserId }
});

const recivedChatWith = () => ({
    type: actionTypes.RECIVED_GO_CHAT_WITH
});

const closeConversation = () => ({
    type: actionTypes.CLOSE_CONVERSATION
})

const reportErrorMessage = (errorMsg) => ({
    type: actionTypes.REPORT_ERROR_MESSAGE,
    payload: { errorMsg }
});

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
    fetchSubCommentaries,
    fetchMoreBooks,
    fetchFavourites,
    setLoadingPage,
    favouritePageRequest,
    fetchUserData,
    fetchUserGenres,
    fetchUserAvatar,
    writeComment,
    sendComment,
    saveUserData,
    dissableUser,
    unsubscribeBook,
    fetchChatHistory,
    fetchChatMessages,
    deleteChat,
    goChatWith,
    recivedChatWith,
    closeConversation,
    reportErrorMessage
};