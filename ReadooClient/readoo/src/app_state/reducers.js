import { combineReducers } from 'redux';
import * as constantes from '../constants/appConstants';
import noHayNada from '../resources/noHayNada.png';
import sinRed from '../resources/sinRed.png';
import { REST_DEFAULT, REST_SUCCESS, REST_FAILURE } from '../constants/appConstants';

import {
  // Las actions
  DO_LOGIN, TAB_CHANGE, MODAL_ADD_LIBRO, UPLOAD_LIBRO, UPLOAD_LIBRO_200, UPLOAD_COMENTARIO_200, UPLOAD_USER_200, FETCH_CATEGORIAS,
  PASAR_LIBRO, FETCH_LIBROS, FETCH_COMENTARIOS, ENVIAR_COMENTARIO, SET_ERROR_ENVIAR_COMENTARIO, ME_GUSTA_LIBRO,
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
  user: {
    id: '',
    nick: '',
    email: '',
    nombre: '',
    apellido: '',
    avatar: '',
    sobreMi: '',
    pass: '',
  },
  libros: {
    libroDefault: {
      idLibro: -1,
      titulo : 'Has explorados todos los libros de tus deseos.',
      autor: 'Prueba a cambiar tus filtos en tu perfil de usuario.',
      coverUrl: noHayNada,
      descripcion: '',
      review: '',
      likes: 0
    },
    libroFailure: {
      idLibro: -1,
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
  categorias: {
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

/**
 * El reducer de pestañas concierne a estas mismas de manera que se encarga entre otras cosas de recibir los datos de éstas desde backend
 * y de gestionar la navegación entre ellas
 */
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

const dialogs = (state = initialState.dialogs, { type, payload, data }) => {
  switch (type) {
    case MODAL_ADD_LIBRO:
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
      return state
  }
}

/**
 * Reducer para los libros a mostrar y operaciones de las mismas
 */
const libros = (state = initialState.libros, { type, payload, data }) => {
  switch (type) {
    case PASAR_LIBRO:
      console.log(PASAR_LIBRO + ': ' + state.libroActual + '- m:' + state.mostrados.length + '- c' + state.cargados.length);
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
        && state.mostrados.length === constantes.NUM_LIBROS) 
      {
        toRet = {
          ...state,
          mostrados: state.cargados.slice(0),
          libroActual: 0,
        }
      }

      if (state.libroActual + 1 === state.mostrados.length
        && state.mostrados.length < constantes.NUM_LIBROS) 
      {
        toRet = {
          ...state,
          mostrados: [ state.libroDefault ],
          libroActual: 0,
        }
      }
      return toRet;

    case successType(ME_GUSTA_LIBRO):
      console.log(ME_GUSTA_LIBRO);
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
    case successType(FETCH_COMENTARIOS):
      console.log(successType(FETCH_COMENTARIOS));
      return {
        ...state,
        comentariosLibro: data.data,
      }

    default:
      return state;
  }
}

/**
 * Reducer para las categorias a mostrar y operaciones de las mismas
 */
const categorias = (state = initialState.libros, { type, payload, data }) => {
  switch (type) {
    case successType(FETCH_CATEGORIAS):
      console.log(successType(FETCH_CATEGORIAS));
      return {
        ...state,
        todas: data.data,
      }

    case failureType(FETCH_CATEGORIAS):
      console.log(failureType(FETCH_CATEGORIAS));
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
    case successType(UPLOAD_LIBRO):
      console.log(successType(UPLOAD_LIBRO));
      return {
        ...state,
        uploadLibroSuccess: constantes.REST_SUCCESS,
      }

    case failureType(UPLOAD_LIBRO):
      console.log(failureType(UPLOAD_LIBRO));
      return {
        ...state,
        uploadLibroSuccess: constantes.REST_FAILURE,
      }

    case UPLOAD_LIBRO_200:
      console.log(UPLOAD_LIBRO_200);
      return {
        ...state,
        uploadLibroSuccess: constantes.REST_DEFAULT,
      }

    case successType(FETCH_COMENTARIOS):
      console.log(successType(FETCH_COMENTARIOS));
      return {
        ...state,
        fetchComentarioSuccess: REST_SUCCESS,
        comentariosError: false,
      }

  case failureType(FETCH_COMENTARIOS):
      console.log(failureType(FETCH_COMENTARIOS));
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

    case UPLOAD_COMENTARIO_200:
      console.log(UPLOAD_COMENTARIO_200);
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

    case loadingType(ME_GUSTA_LIBRO):
      return {
        ...state,
        enviandoMeGusta: true
      }
    
    case successType(ME_GUSTA_LIBRO):
      return {
        ...state,
        enviandoMeGusta: false
      }
      
    case failureType(ME_GUSTA_LIBRO):
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
  dialogs,
  libros,
  comentarios,
  categorias,
  controllerStatus
})

/**
 * A continuación se exportan fragmentos del estado para mantener ordenado el acceso al mismo.
 * Es de extrema importancia cercionarse de que aquellas funciones que fueran a retornar arrays u objetos cuyos atributos fueran a ser
 * accedidos devuelvan valores por defecto para evitar crashes que no vengan a cuento. Curémonos en salud
 */
export const getCurrentTabID = (state) => state.tabs.currentTabID;
export const getIsOpenModal = (state) => state.dialogs;
export const getUserId = (state) => state.user.id;
export const getUser = (state) => state.user;
export const libroSuccessUpload = (state) => state.controllerStatus.uploadLibroSuccess;
export const getComentarioEnviado = (state) => state.controllerStatus.comentarioEnviado;
export const allCategorias = (state) => state.categorias.todas;
export const usuarioCategorias = (state) => state.categorias.usuario_categorias;
export const getIndiceLibro = (state) => state.libros.libroActual;
export const getLibroSuccess = (state) => state.libros.success_fetch;
export const getLibros = (state) => state.libros.mostrados;
export const getComentarios = (state) => state.comentarios.comentariosLibro;
export const getfetchComentarioSuccess = (state) => state.controllerStatus.fetchComentarioSuccess;
export const getfetchUserDataSuccess = (state) => state.controllerStatus.fetchUserDataSuccess;
export const getsaveUserDataSuccess = (state) => state.controllerStatus.saveUserDataSuccess;
export const getEnviandoMeGusta = (state) => state.controllerStatus.enviandoMeGusta;