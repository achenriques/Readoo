import { combineReducers } from 'redux';
import * as constantes from '../constants/appConstants';

import {
  // Las actions
  TAB_CHANGE, MODAL_ADD_LIBRO, UPLOAD_LIBRO, UPLOAD_LIBRO_200, FETCH_CATEGORIAS,
  PASAR_LIBRO, FETCH_LIBROS, FETCH_MORE_LIBROS
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
  },
  libros: {
    libro_actual: 0,
    mostrados: [],
    cargados: [],
    success_fetch: true
  },
  categorias: {
    todas: [],
    usuario_categorias: []
  },
  controllerStatus: {
    uploadLibroSuccess: 0
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
 * Reducer para los libros a mostrar y operaciones de las mismas
 */
const libros = (state = initialState.libros, { type, payload, data }) => {
  switch (type) {
    case PASAR_LIBRO:
      console.log(successType(PASAR_LIBRO));
      let toRet = {};
      if (state.libro_actual +1 < state.mostrados.length -1) {
        toRet = {
          ...state,
          libro_actual: state.libro_actual + 1,
        }
      }

      if (state.libro_actual + 1 === state.mostrados.length -1) 
      {
        toRet = {
          ...state,
          mostrados: state.cargados.slice(0),
          libro_actual: 0,
        }
      }

      return toRet;

    case successType(FETCH_LIBROS):
      console.log(successType(FETCH_LIBROS));
      return {
        ...state,
        mostrados: data.data,
        cargados: data.data,
        success_fetch: true,
      }

    case failureType(FETCH_LIBROS):
      console.log(failureType(FETCH_LIBROS));
      return {
        ...state,
        success_fetch: false,
      }

    case successType(FETCH_MORE_LIBROS):
      console.log(successType(FETCH_MORE_LIBROS));
      return {
        ...state,
        cargados: data.data,
        success_fetch: true,
      }

    case failureType(FETCH_MORE_LIBROS):
      console.log(failureType(FETCH_MORE_LIBROS));
      return {
        ...state,
        success_fetch: false,
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
      console.log('UPLOAD_LIBRO_200');
      return {
        ...state,
        uploadLibroSuccess: constantes.REST_DEFAULT,
      }

    default:
      return state;
  }
}

/**
 * Reducer para el usuario actual de la aplicación. Responde al login inicial y ofrece los datos del mismo para futuras peticiones y otras
 * secciones de la aplicacion
 
const user = (state = initialState.user, { type, payload, data }) => {
  switch (type) {
    case successType(DO_LOGIN):
      console.log(DO_LOGIN);
      return {
        ...state,
        id: data._id,
        nick: data.nick
      }
 
    default:
      return state
  }
}
 
/**
 * El export por defecto se lo lleva redux para hacer su magia, usaremos exports concretos más abajo
 */
export default combineReducers({
  tabs,
  dialogs,
  libros,
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
export const libroSuccessUpload = (state) => state.controllerStatus.uploadLibroSuccess;
export const allCategorias = (state) => state.categorias.todas;
export const usuarioCategorias = (state) => state.categorias.usuario_categorias;
export const getIndiceLibro = (state) => state.libros.libro_actual;
export const getLibroSuccess = (state) => state.libros.success_fetch;
export const getLibros = (state) => state.libros.mostrados;