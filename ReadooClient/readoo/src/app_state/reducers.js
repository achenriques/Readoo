import { combineReducers } from 'redux';
import * as constantes from '../constants/appConstants';
import noHayNada from '../resources/noHayNada.png';
import sinRed from '../resources/sinRed.png';
import { REST_DEFAULT, REST_SUCCESS, REST_FAILURE, LANGUAGE_ENGLISH, LANGUAGE_SPANISH } from '../constants/appConstants';

import {
  // Las actions
  DO_LOGIN, TAB_CHANGE, CHANGE_LANGUAGE, MODAL_ADD_BOOK, UPLOAD_BOOK, UPLOAD_BOOK_200, UPLOAD_COMMENT_200, UPLOAD_USER_200, FETCH_GENRES,
  NEXT_BOOK, FETCH_LIBROS, FETCH_COMMENTARIES, ENVIAR_COMENTARIO, SET_ERROR_ENVIAR_COMENTARIO, I_LIKE_BOOK,
  FETCH_USER_DATA, SAVE_USER_DATA
} from './actions';
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
        isOpenAddLibro: false,
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
            coverUrl: noHayNada,
            descripcion: '',
            review: '',
            likes: 0
        },
        libroFailure: {
            bookId: -1,
            titulo : 'Jope! Se ha producido un error de red...',
            autor: 'Prueba a refrescar la aplicación o espera a que el problema se resuelva.',
            coverUrl: sinRed,
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
        uploadLibroSuccess: REST_DEFAULT,
        cargandoComentarios: false,
        fetchComentarioSuccess: REST_DEFAULT,
        comentarioEnviado: false,
        enviandoMeGusta: false,
        fetchUserDataSuccess: REST_DEFAULT,
        saveUserDataSuccess: REST_DEFAULT
    },
    filtros: [],
}

const tabs = (state = initialState.tabs, { type, payload, data }) => {
  switch (type) {
    case TAB_CHANGE:
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
        case CHANGE_LANGUAGE:
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
        case MODAL_ADD_BOOK:
        console.log('abro modal: ' + payload.isOpen)
        return {
            ...state,
            isOpenAddLibro: payload.isOpen,
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
    switch (type) {
        case successType(DO_LOGIN):
            console.log(DO_LOGIN);
            return {
                ...state,
                id: data._id,
                nick: data.nick
            }

        case successType(FETCH_USER_DATA):
            console.log(FETCH_USER_DATA)
            return {
                ...state,
                nick: data.nick,
                email: data.email,
                nombre: data.nombre,
                apellido: data.apellido,
                avatar: data.avatar,
                sobreMi: data.sobreMi,
                pass: data.pass
            }

        default:
            return state;
    }
}

/**
 * Reducer para los libros a mostrar y operaciones de las mismas
 */
const libros = (state = initialState.libros, { type, payload, data }) => {
  switch (type) {
    case NEXT_BOOK:
      console.log(NEXT_BOOK + ': ' + state.libroActual + '- m:' + state.mostrados.length + '- c' + state.cargados.length);
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
        && state.mostrados.length === constantes.NUM_OF_BOOKS) 
      {
        toRet = {
          ...state,
          mostrados: state.cargados.slice(0),
          libroActual: 0,
        }
      }

      if (state.libroActual + 1 === state.mostrados.length
        && state.mostrados.length < constantes.NUM_OF_BOOKS) 
      {
        toRet = {
          ...state,
          mostrados: [ state.libroDefault ],
          libroActual: 0,
        }
      }
      return toRet;

    case successType(I_LIKE_BOOK):
      console.log(I_LIKE_BOOK);
      // No necesito hacer nada para mantener el estado visualmente
      // Si llega a base de datos bien y sino en la proxinma recarga se perderá
      // en olvido.
      break;
      

    case successType(FETCH_LIBROS):
      console.log(successType(FETCH_LIBROS));
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

    case failureType(FETCH_LIBROS):
      console.log(failureType(FETCH_LIBROS));
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
    case successType(FETCH_COMMENTARIES):
      console.log(successType(FETCH_COMMENTARIES));
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
    case successType(FETCH_GENRES):
      console.log(successType(FETCH_GENRES));
      return {
        ...state,
        todas: data.data,
      }

    case failureType(FETCH_GENRES):
      console.log(failureType(FETCH_GENRES));
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
const controllerStatus = (state = initialState.controllerStatus, { type, payload, data }) => {
  switch (type) {
    case successType(UPLOAD_BOOK):
      console.log(successType(UPLOAD_BOOK));
      return {
        ...state,
        uploadLibroSuccess: constantes.REST_SUCCESS,
      }

    case failureType(UPLOAD_BOOK):
      console.log(failureType(UPLOAD_BOOK));
      return {
        ...state,
        uploadLibroSuccess: constantes.REST_FAILURE,
      }

    case UPLOAD_BOOK_200:
      console.log(UPLOAD_BOOK_200);
      return {
        ...state,
        uploadLibroSuccess: constantes.REST_DEFAULT,
      }

    case successType(FETCH_COMMENTARIES):
      console.log(successType(FETCH_COMMENTARIES));
      return {
        ...state,
        fetchComentarioSuccess: REST_SUCCESS,
        comentariosError: false,
      }

  case failureType(FETCH_COMMENTARIES):
      console.log(failureType(FETCH_COMMENTARIES));
      return {
        ...state,
        fetchComentarioSuccess: REST_FAILURE
      }

  case failureType(ENVIAR_COMENTARIO):
      console.log(failureType(ENVIAR_COMENTARIO));
      return {
        ...state,
        comentarioEnviado: constantes.REST_FAILURE,
      }

    case UPLOAD_COMMENT_200:
      console.log(UPLOAD_COMMENT_200);
      return {
        ...state,
        comentarioEnviado: constantes.REST_DEFAULT,
        fetchComentarioSuccess: constantes.REST_DEFAULT
      }

    case UPLOAD_USER_200:
      console.log(UPLOAD_USER_200);
      return {
        ...state,
        fetchUserDataSuccess: REST_DEFAULT,
        saveUserDataSuccess: REST_DEFAULT
      }
    
    case failureType(FETCH_USER_DATA):
      console.log(failureType(FETCH_USER_DATA));
      return {
        ...state,
        fetchUserDataSuccess: REST_FAILURE
      }
    
    case successType(SAVE_USER_DATA):
      console.log(successType(SAVE_USER_DATA));
      return {
        ...state,
        fetchUserDataSuccess: REST_SUCCESS
      }

    case failureType(SAVE_USER_DATA):
      console.log(failureType(SAVE_USER_DATA));
      return {
        ...state,
        fetchUserDataSuccess: REST_FAILURE
      }

    case loadingType(I_LIKE_BOOK):
      return {
        ...state,
        enviandoMeGusta: true
      }
    
    case successType(I_LIKE_BOOK):
      return {
        ...state,
        enviandoMeGusta: false
      }
      
    case failureType(I_LIKE_BOOK):
      return {
        ...state,
        enviandoMeGusta: false
      }
      
    default:
      return state;
  }
}

/**
 * El export por defecto se lo lleva redux para hacer su magia, usaremos exports concretos más abajo
 */
export default combineReducers({
  tabs,
  language,
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
export const libroSuccessUpload = (state) => state.controllerStatus.uploadLibroSuccess;
export const getComentarioEnviado = (state) => state.controllerStatus.comentarioEnviado;
export const allCategorias = (state) => state.genres.todas;
export const usuarioCategorias = (state) => state.genres.usuario_categorias;
export const getIndiceLibro = (state) => state.libros.libroActual;
export const getLibroSuccess = (state) => state.libros.success_fetch;
export const getLibros = (state) => state.libros.mostrados;
export const getComentarios = (state) => state.comentarios.comentariosLibro;
export const getfetchComentarioSuccess = (state) => state.controllerStatus.fetchComentarioSuccess;
export const getfetchUserDataSuccess = (state) => state.controllerStatus.fetchUserDataSuccess;
export const getsaveUserDataSuccess = (state) => state.controllerStatus.saveUserDataSuccess;
export const getEnviandoMeGusta = (state) => state.controllerStatus.enviandoMeGusta;