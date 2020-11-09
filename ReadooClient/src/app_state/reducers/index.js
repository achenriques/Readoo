import { combineReducers } from 'redux';
import * as constants from '../../constants/appConstants';
import books from './books';
import chat from './chat';
import commentaries from './commentaries';
import common from './common';
import controllerStatus from './controllerStatus';
import dialogs from './dialogs';
import genres from './genres';
import rootReducer from './root';
import tabs from './tabs';
import user from './user';

/**
 * A default state. If its values are different from the previous state, it is possible to identify modifications.
 */
export const initialState = {
    tabs: {
        currentTabID: 0
    },
    dialogs: {
        isOpenAddBook: false,
        isOpenProfilePreview: false
    },
    common: {
        appLanguage: constants.LANGUAGE_ENGLISH,
        userIsLogged : constants.USER_NOT_IS_LOGGED,
        avaliableNick : null,
        avaliableEmail: null,
        userPreview: {
            userId: '',
            userNick: '',
            userAvatarUrl: '',
            userAboutMe: '',
            userKarma: null,
            userGenres: [],
            userVisible: true
        }
    },
    user: {
        userId: '',
        userNick: '',
        userEmail: '',
        userName: '',
        userSurname: '',
        userAvatarUrl: '',
        userAboutMe: '',
        userPass: '',
        userKarma: null,
        userGenres: [],
        userVisible: true,
        preferedLanguage: null
    },
    books: {
        bookDefault: {
            bookId: constants.DEFAULT_BOOK_ID,
            bookTitle : 'no.books.explore',
            bookAuthor: 'change.perfil.data',
            bookCoverUrl: null,
            descripcion: '',
            review: '',
            bookLikes: 0,
            userLikesBook: false
        },
        bookFailure: {
            bookId: constants.FAILURE_BOOK_ID,
            bookTitle : 'network.error',
            bookAuthor: 'error.refresh.app',
            bookCoverUrl: null,
            descripcion: '',
            review: '',
            bookLikes: 0,
            userLikesBook: false
        },
        currentBook: 0,
        shownBooks: [],
        loaded: [],
        favourites: {
            firstPage: [],
            beforePage: [],
            currentPage: [],
            nextPage: [],
            lastPage: []
        },
        favouritesTotal: 0,
        success_fetch: true,
        favourites_success_fetch: true
    },
    commentaries: {
        bookCommentaries: [],
        bookSubCommentaries: []
    },
    genres: {
        all: []
    },
    chat: {
        chatWith: null,
        chatHistory: [],
        chatMessages: constants.CHAT_MESSAGES_EMPTY
    },
    controllerStatus: {
        loading: 0,
        loading_processes: [],
        failed_processes: [],
        succeed_processes: [],
        failure: []
    }
}

/**
 * This will create and export the main reducer of react-redux. It means
 * that an enteire state will be avaliable and accessed for the whole application
 */
export default combineReducers({
    rootReducer,
    tabs,
    common,
    user,
    dialogs,
    books,
    commentaries,
    genres,
    chat,
    controllerStatus
});

/**
 * Next, there are multiple exportatios of state fragments. So they can be accessed cleaned and in oreder.
 * Its very important having in account that every functions that return arrays or objects, 
 * must return a default value in case of empty or a fetch error. Try to prevent erros.
 */
export const getUserIsLogged = (state) => state.common.userIsLogged;
export const getAppLanguage = (state) => state.common.appLanguage;
export const getUserLanguage = (state) => state.user.preferedLanguage;
export const getCurrentTabID = (state) => state.tabs.currentTabID;
export const getAvaliableNick = (state) => state.common.avaliableNick;
export const getAvaliableEmail = (state) => state.common.avaliableEmail;
export const getIsOpenModal = (state) => state.dialogs;
export const getUserId = (state) => state.user.userId;
export const getUser = (state) => state.user;
export const getUserPreview = (state) => state.common.userPreview;
export const getGenres = (state) => state.genres.all;
export const getUserGenres = (state) => state.user.userGenres;
export const getBookIndex = (state) => state.books.currentBook;
export const getBooks = (state) => state.books.shownBooks;
export const getTotalOfFavourites = (state) => state.books.favouritesTotal;
export const getFavourites = (state) => state.books.favourites.currentPage;
export const getCommentaries = (state) => state.commentaries.bookCommentaries;
export const getSubCommentaries = (state) => state.commentaries.bookSubCommentaries;
export const getChatHistory = (state) => state.chat.chatHistory;
export const getChatMessages = (state) => state.chat.chatMessages;
export const getChatWith = (state) => state.chat.chatWith;
export const getLoadingStatus = (state) => state.controllerStatus.loading;
export const getFailingStatus = (state) => state.controllerStatus.failure;
export const getFailedProcesses = (state) => state.controllerStatus.failed_processes;
export const getLoadingProcesses = (state) => state.controllerStatus.loading_processes;
export const getSucceedProcesses = (state) => state.controllerStatus.succeed_processes;