import { combineReducers } from 'redux';
import * as constantes from '../constants/appConstants';
import isEmpty from '../resources/isEmpty.png';
import noInternet from '../resources/noInternet.png';
import { LANGUAGE_ENGLISH, LANGUAGE_SPANISH } from '../constants/appConstants';

import actionTypes from './actions';
import { state } from 'fs';
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
    appLanguage: LANGUAGE_ENGLISH,
    userIsLogged : false,
    user: {
        id: '',
        nick: '',
        email: '',
        nombre: '',
        apellido: '',
        avatar: '',
        sobreMi: '',
        pass: '',
        preferedLanguage: null
    },
    libros: {
        libroDefault: {
            bookId: -1,
            titulo : 'Has explorados todos los libros de tus deseos.',
            autor: 'Prueba a cambiar tus filtos en tu perfil de usuario.',
            coverUrl: isEmpty,
            descripcion: '',
            review: '',
            likes: 0
        },
        libroFailure: {
            bookId: -1,
            titulo : 'Jope! Se ha producido un error de red...',
            autor: 'Prueba a refrescar la aplicación o espera a que el problema se resuelva.',
            coverUrl: noInternet,
            descripcion: '',
            review: '',
            likes: 0
        },
        libroActual: 0,
        mostrados: [],
        cargados: [],
        success_fetch: true,
    },
    comentarios: {
        comentariosLibro: [],
    },
    genres: {
        todas: [],
        usuario_categorias: []
    },
    controllerStatus: {
        loading: 0,
        failure: []
    },
    filtros: [],
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

const language = (state = initialState, { type, payload, data }) => {
    switch (type) {
        case actionTypes.CHANGE_LANGUAGE:
            console.log('CHANGE_LANGUAGE');
            return {
                ...state,
                appLanguage: payload.languageCode
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

const userLogged = (state = initialState, { type, payload, data }) => {
    if (type === successType(actionTypes.DO_LOGIN) || type === successType(actionTypes.DO_REGISTER)){
        return {
            ...state,
            userIsLogged: true
        }
    } else {
        return state;
    }
}

const user = (state = initialState.user, { type, payload, data }) => {
    let userData = data;
    userData.preferedLanguage = (payload.preferedLanguage) ? payload.preferedLanguage : 1
    switch (type) {
        case successType(actionTypes.DO_LOGIN):
            console.log(actionTypes.DO_LOGIN);
            return userData;

        case successType(actionTypes.DO_REGISTER):
            console.log(actionTypes.DO_REGISTER);
            return userData;

        case successType(actionTypes.FETCH_USER_DATA):
            console.log(actionTypes.FETCH_USER_DATA)
            return userData;

        default:
            return state;
    }
}

/**
 * Reducer para el usuario actual de la aplicación. Responde al login inicial y ofrece los datos del mismo para futuras peticiones y otras
 * secciones de la aplicacion
 **/
const user = (state = initialState.user, { type, payload, data }) => {
    let userData = data;
    userData.preferedLanguage = (payload.preferedLanguage) ? payload.preferedLanguage : 1
    switch (type) {
        case successType(actionTypes.DO_LOGIN):
            console.log(actionTypes.DO_LOGIN);
            return userData;

        case successType(actionTypes.DO_REGISTER):
            console.log(actionTypes.DO_REGISTER);
            return userData;

        case successType(actionTypes.FETCH_USER_DATA):
            console.log(actionTypes.FETCH_USER_DATA)
            return userData;

        default:
            return state;
    }
}

/**
 * Reducer para los libros a mostrar y operaciones de las mismas
 */
const libros = (state = initialState.libros, { type, payload, data }) => {
  switch (type) {
    case actionTypes.NEXT_BOOK:
        console.log(actionTypes.NEXT_BOOK + ': ' + state.libroActual + '- m:' + state.mostrados.length + '- c' + state.cargados.length);
        console.log(state.mostrados);
        console.log(state.cargados);

        let toRet = {};
        if (state.libroActual +1 < state.mostrados.length) {
            toRet = {
            ...state,
            libroActual: state.libroActual + 1,
            }
        }

        if (state.libroActual + 1 === state.mostrados.length
            && state.mostrados.length === constantes.NUM_OF_BOOKS) {
            toRet = {
                ...state,
                mostrados: state.cargados.slice(0),
                libroActual: 0,
            }
        }

        if (state.libroActual + 1 === state.mostrados.length
            && state.mostrados.length < constantes.NUM_OF_BOOKS) {
            toRet = {
                ...state,
                mostrados: [ state.libroDefault ],
                libroActual: 0,
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
                mostrados: data.data,
                cargados: data.data,
                success_fetch: true,
            }
        } else {
            return {
                ...state,
                cargados: data.data,
                success_fetch: true,
            }
        }

    case failureType(actionTypes.FETCH_LIBROS):
        console.log(failureType(actionTypes.FETCH_LIBROS));
        return {
            ...state,
            mostrados: [ state.libroFailure ],
            success_fetch: false,
        }

    default:
        return state;
  }
}

const comentarios = (state = initialState.comentarios, { type, payload, data }) => {
    switch (type) {
        case successType(actionTypes.FETCH_COMMENTARIES):
        console.log(successType(actionTypes.FETCH_COMMENTARIES));
        return {
            ...state,
            comentariosLibro: data.data,
        }

        default:
            return state;
    }
}

/**
 * Reducer para las genres a mostrar y operaciones de las mismas
 */
const genres = (state = initialState.libros, { type, payload, data }) => {
    switch (type) {
        case successType(actionTypes.FETCH_GENRES):
            console.log(successType(actionTypes.FETCH_GENRES));
            return {
                ...state,
                todas: data.data,
            }

        case failureType(actionTypes.FETCH_GENRES):
            console.log(failureType(actionTypes.FETCH_GENRES));
            return {
                ...state,
                todas: null,
            }

        default:
        return state;
    }
}

/**
 * Reducer para los estados inherentes a mostrar operaciones REST
 */
const controllerStatus = (state = initialState.controllerStatus, { type, payload, error }) => {
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
                return {
                    failure: state.failure.push(error.response),
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
 * El export por defecto se lo lleva redux para hacer su magia, usaremos exports concretos más abajo
 */
export default combineReducers({
    tabs,
    language,
    userLogged,
    user,
    dialogs,
    libros,
    comentarios,
    genres,
    controllerStatus
})

/**
 * A continuación se exportan fragmentos del estado para mantener ordenado el acceso al mismo.
 * Es de extrema importancia cercionarse de que aquellas funciones que fueran a retornar arrays u objetos cuyos atributos fueran a ser
 * accedidos devuelvan valores por defecto para evitar crashes que no vengan a cuento. Curémonos en salud
 */
export const getUserIsLogged = (state) => state.userIsLogged;
export const getAppLanguage = (state) => state.appLanguage;
export const getUserLanguage = (state) => state.user.preferedLanguage;
export const getCurrentTabID = (state) => state.tabs.currentTabID;
export const getIsOpenModal = (state) => state.dialogs;
export const getUserId = (state) => state.user.id;
export const getUser = (state) => state.user;
export const allCategorias = (state) => state.genres.todas;
export const usuarioCategorias = (state) => state.genres.usuario_categorias;
export const getIndiceLibro = (state) => state.libros.libroActual;
export const getLibroSuccess = (state) => state.libros.success_fetch;
export const getLibros = (state) => state.libros.mostrados;
export const getComentarios = (state) => state.comentarios.comentariosLibro;
export const getLoadingStatus = (state) => state.controllerStatus.loading;
export const getFailingStatus = (state) => state.controllerStatus.failure;