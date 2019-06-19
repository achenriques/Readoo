import { combineReducers } from 'redux';
import * as constants from '../constants/appConstants';
import isEmpty from '../resources/isEmpty.png';
import noInternet from '../resources/noInternet.png';
import { actionTypes } from './actions';
// Asi puedo tener varios modulos

const failureType = (actionType) => `${actionType}_FAILURE`;
const loadingType = (actionType) => `${actionType}_LOADING`;
const successType = (actionType) => `${actionType}_SUCCESS`;

/**
 * Un state por defecto, con valores a tener en cuenta para saber si se han obrado modificaciones, y con valores necesarios para  evitar un
 * crasheo de frontend a falta de la respuesta asíncrona de backend
 */
const initialState = {
    tabs: {
        currentTabID: 0
    },
    dialogs: {
        isOpenAddBook: false,
    },
    common: {
        appLanguage: constants.LANGUAGE_ENGLISH,
        userIsLogged : constants.USER_NOT_IS_LOGGED,
        avaliableNick : null,
        avaliableEmail: null
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
        userVisible: true,
        preferedLanguage: null
    },
    books: {
        bookDefault: {
            bookId: -1,
            bookTitle : 'Has explorados todos los books de tus deseos.',
            bookAuthor: 'Prueba a cambiar tus filtos en tu perfil de usuario.',
            coverUrl: isEmpty,
            descripcion: '',
            review: '',
            bookLikes: 0
        },
        libroFailure: {
            bookId: -1,
            bookTitle : 'Jope! Se ha producido un error de red...',
            bookAuthor: 'Prueba a refrescar la aplicación o espera a que el problema se resuelva.',
            coverUrl: noInternet,
            descripcion: '',
            review: '',
            bookLikes: 0
        },
        currentBook: 0,
        shownBooks: [],
        loaded: [],
        success_fetch: true,
    },
    comentaries: {
        bookCommentaries: [],
    },
    genres: {
        all: [],
        userGenres: []
    },
    controllerStatus: {
        loading: 0,
        failure: []
    }
}

// This is a reducer that managers all reducers from the top level
const rootReducer = (state = initialState, { type, payload, data, err }) => {
    let expiredSessionState = initialState;
    // In this case if we recibe that a token has expired we reset the app.
    if (err && err.response && err.response.status === constants.ERROR_403) {
        expiredSessionState.common.userIsLogged = constants.USER_HAS_EXPIRED;
        return expiredSessionState;
    } else {
        if (type === successType(actionTypes.DO_LOG_OUT)) {
            return expiredSessionState;
        }
    }
    return state;
}

const tabs = (state = initialState.tabs, { type, payload, data }) => {
  switch (type) {
        case actionTypes.TAB_CHANGE:
        console.log('TAB_CHANGE');
        return {
            ...state,
            currentTabID: payload.newTabID
        };

        default:
        return state;
    }
}

const dialogs = (state = initialState.dialogs, { type, payload, data }) => {
    switch (type) {
        case actionTypes.MODAL_ADD_BOOK:
        console.log('abro modal: ' + payload.isOpen)
        return {
            ...state,
            isOpenAddBook: payload.isOpen,
        };

        default:
        return state;
    }
}

const common = (state = initialState.common, { type, payload, data }) => {
    let response = data !== undefined ? data.data : null;
    switch (type) {
        case actionTypes.CHANGE_LANGUAGE:
            console.log('CHANGE_LANGUAGE');
            return {
                ...state,
                appLanguage: payload.languageCode
            };

        case successType(actionTypes.CHECK_TOKEN):
            console.log(actionTypes.CHECK_TOKEN);
            return {
                ...state,
                userIsLogged: constants.USER_IS_LOGGED
            }
            
        case successType(actionTypes.DO_LOGIN):
            return {
                ...state,
                userIsLogged: constants.USER_IS_LOGGED
            }

        case successType(actionTypes.DO_LOG_OUT):
            return {
                ...state,
                userIsLogged: constants.USER_NOT_IS_LOGGED
            }

        case successType(actionTypes.DO_REGISTER):
            return {
                ...state,
                userIsLogged: constants.USER_FIRST_TIME_LOGGED
            }

        case actionTypes.DONE_REGISTER:
            return {
                ...state,
                userIsLogged: constants.USER_IS_LOGGED
            }

        case successType(actionTypes.CHECK_NICK):
            return {
                ...state,
                avaliableNick: (response === true),
            }
             
        case successType(actionTypes.CHECK_EMAIL):
                return {
                    ...state,
                    avaliableEmail: (response === true),
                }

        case actionTypes.CHECKED_NICK:
            return {
                ...state,
                avaliableNick: null
            }

        case actionTypes.CHECKED_EMAIL:
                return {
                    ...state,
                    avaliableEmail: null
                }

        default:
            return state;
    }
}

/**
 * Reducer para el usuario actual de la aplicación. Responde al login inicial y ofrece los datos del mismo para futuras peticiones y otras
 * secciones de la aplicacion
 **/
const user = (state = initialState.user, { type, payload, data }) => {
    if (data) {
        let userData = data.data;
        if (userData && userData.userLanguage == null && payload && payload.preferedLanguage != null) {
            userData.preferedLanguage = (payload.preferedLanguage) ? payload.preferedLanguage : 1
        }
        switch (type) {
            case successType(actionTypes.CHECK_TOKEN):
                console.log(actionTypes.CHECK_TOKEN);
                return userData;

            case successType(actionTypes.DO_LOGIN):
                console.log(actionTypes.DO_LOGIN);
                return userData;

            case successType(actionTypes.DO_LOG_OUT):
                return initialState.user;

            case successType(actionTypes.DO_REGISTER):
                console.log(actionTypes.DO_REGISTER);
                return {
                    userId: userData.id,
                    userNick: payload.nickEmail,
                    userEmail: payload.email,
                    userName: '',
                    userSurname: '',
                    userAvatarUrl: '',
                    userAboutMe: '',
                    userPass: '',
                    userKarma: 0,
                    userVisible: true,
                    preferedLanguage: payload.preferedLanguage
                };

            case successType(actionTypes.FETCH_USER_DATA):
                console.log(actionTypes.FETCH_USER_DATA)
                return userData;

            default:
                return state;
        }
    } else {
        return state;
    }
    
}

/**
 * Reducer para los books a mostrar y operaciones de las mismas
 */
const books = (state = initialState.books, { type, payload, data }) => {
  switch (type) {
    case actionTypes.NEXT_BOOK:
        console.log(actionTypes.NEXT_BOOK + ': ' + state.currentBook + '- m:' + state.shownBooks.length + '- c' + state.loaded.length);
        console.log(state.shownBooks);
        console.log(state.loaded);

        let toRet = {};
        if (state.currentBook +1 < state.shownBooks.length) {
            toRet = {
            ...state,
            currentBook: state.currentBook + 1,
            }
        }

        if (state.currentBook + 1 === state.shownBooks.length
            && state.shownBooks.length === constants.NUM_OF_BOOKS) {
            toRet = {
                ...state,
                shownBooks: state.loaded.slice(0),
                currentBook: 0,
            }
        }

        if (state.currentBook + 1 === state.shownBooks.length
            && state.shownBooks.length < constants.NUM_OF_BOOKS) {
            toRet = {
                ...state,
                shownBooks: [ state.bookDefault ],
                currentBook: 0,
            }
        }
        return toRet;

    case successType(actionTypes.I_LIKE_BOOK):
        console.log(actionTypes.I_LIKE_BOOK);
        // No necesito hacer nada para mantener el estado visualmente
        // Si llega a base de datos bien y sino en la proxinma recarga se perderá
        // en olvido.
        break;
      

    case successType(actionTypes.FETCH_LIBROS):
      console.log(successType(actionTypes.FETCH_LIBROS));
        if (payload.primeraVez) {
            return {
                ...state,
                shownBooks: data.data,
                loaded: data.data,
                success_fetch: true,
            }
        } else {
            return {
                ...state,
                loaded: data.data,
                success_fetch: true,
            }
        }

    case failureType(actionTypes.FETCH_LIBROS):
        console.log(failureType(actionTypes.FETCH_LIBROS));
        return {
            ...state,
            shownBooks: [ state.libroFailure ],
            success_fetch: false,
        }

    default:
        return state;
  }
}

const comentaries = (state = initialState.comentaries, { type, payload, data }) => {
    switch (type) {
        case successType(actionTypes.FETCH_COMMENTARIES):
        console.log(successType(actionTypes.FETCH_COMMENTARIES));
        return {
            ...state,
            bookCommentaries: data.data,
        }

        default:
            return state;
    }
}

/**
 * Reducer para las genres a mostrar y operaciones de las mismas
 */
const genres = (state = initialState.books, { type, payload, data }) => {
    switch (type) {
        case successType(actionTypes.FETCH_GENRES):
            console.log(successType(actionTypes.FETCH_GENRES));
            return {
                ...state,
                all: data.data,
            }

        case failureType(actionTypes.FETCH_GENRES):
            console.log(failureType(actionTypes.FETCH_GENRES));
            return {
                ...state,
                all: null,
            }

        default:
        return state;
    }
}

/**
 * Reducer para los estados inherentes a mostrar operaciones REST
 */
const controllerStatus = (state = initialState.controllerStatus, { type, payload, data, err }) => {
    // If the type listened from action is from a promise failed...
    let typeString = new String(type);
    switch (typeString) {
        case actionTypes.RESET_LOADING:
            return {
                ...state,
                loading: 0
            }

        case actionTypes.RESET_FAILURE:
            return {
                ...state,
                failure: []
            }

        default:
            // currentCount is used in case of SUCCESS or FAILURE to avoid concurrence errors
            let currentCount = state.loading  - 1;
            if (typeString.includes('_FAILURE')) {
                let nextFailure = (Array.isArray(state.failure)) ? state.failure.push(err) : [err];
                return {
                    failure: nextFailure,
                    loading: (currentCount < 0) ? 0 : currentCount
                }
            } else {
                // Loading is a counter of rest petitions. If they are solver or they failed the counter goes down.
                if (typeString.includes('_SUCCESS')) {
                    
                    return {
                        ...state,
                        loading: (currentCount < 0) ? 0 : currentCount
                    }
                } else {
                    if (typeString.includes('_LOADING')) {
                        return {
                            ...state,
                            loading: state.loading + 1
                        }
                    }
                }
            }
            return state;
    }    
}

/**
 * El export por defecto es para redux para que sea aceptado correctamente por index.js
 */
export default combineReducers({
    rootReducer,
    tabs,
    common,
    user,
    dialogs,
    books,
    comentaries,
    genres,
    controllerStatus
});

/**
 * A continuación se exportan fragmentos del estado para mantener ordenado el acceso al mismo.
 * Es de extrema importancia cercionarse de que aquellas funciones que fueran a retornar arrays u objetos cuyos atributos fueran a ser
 * accedidos devuelvan valores por defecto para evitar crashes que no vengan a cuento. Curémonos en salud
 */
export const getUserIsLogged = (state) => state.common.userIsLogged;
export const getAppLanguage = (state) => state.common.appLanguage;
export const getUserLanguage = (state) => state.user.preferedLanguage;
export const getCurrentTabID = (state) => state.tabs.currentTabID;
export const getAvaliableNick = (state) => state.common.avaliableNick;
export const getAvaliableEmail = (state) => state.common.avaliableEmail;
export const getIsOpenModal = (state) => state.dialogs;
export const getUserId = (state) => state.user.id;
export const getUser = (state) => state.user;
export const getGenres = (state) => state.genres.all;
export const getUserGenres = (state) => state.genres.userGenres;
export const getBookIndex = (state) => state.books.currentBook;
export const getBooks = (state) => state.books.shownBooks;
export const getCommentaries = (state) => state.comentaries.bookCommentaries;
export const getLoadingStatus = (state) => state.controllerStatus.loading;
export const getFailingStatus = (state) => state.controllerStatus.failure;