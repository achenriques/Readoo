import axios from 'axios';
import { NUM_LIBROS } from '../constants/appConstants';
const baseURL = 'http://localhost:3030';

//ACTION TYPES
export const TAB_CHANGE = 'TAB_CHANGE';
export const MODAL_ADD_LIBRO = 'MODAL_ADD_LIBRO';
export const UPLOAD_LIBRO = 'UPLOAD_LIBRO';
export const DO_LOGIN = 'DO_LOGIN';
export const UPLOAD_LIBRO_200 = 'UPLOAD_LIBRO_200';
export const FETCH_CATEGORIAS = 'FETCH_CATEGORIAS';
export const PASAR_LIBRO = 'PASAR_LIBRO';
export const FETCH_LIBROS = 'FETCH_LIBROS';
export const FETCH_MORE_LIBROS = 'FETCH_MORE_LIBROS';

// Default basic auth
//axios.defaults.headers.common['Authorization'] = bAuth.bUser;

/* //ACTION CREATORS
export const fetchTabsInicial = (idUsuario) => ({
  type: FETCH_TABS_INICIAL,
  promise: axios.post(
    `${baseURL}/tabs`,
    {
      id: idUsuario
    }
  )
}) */

// Cambio de pestana en la APP
export const changeTab = (newTabID) => ({
  type: TAB_CHANGE,
  payload: {
    newTabID: newTabID
  }
})

// Abrir / Cerrar modal de anadir libro
export const setIsOpenAddLibro = (isOpen) => ({
  type: MODAL_ADD_LIBRO,
  payload: {
    isOpen: isOpen
  }
})

// Accion de subir un libro a BD
export const uploadLibro = (datosLibro) => ({
  type: UPLOAD_LIBRO,
  //payload: {},
  promise: axios.post(
    `${baseURL}/newLibro`,
    datosLibro.form,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  )
})

// Setear la carga de datos para la subida de libros.
// Se utiliza para mostrar mensajes de alerta
export const controllerLibroDefault = () => ({
  type: UPLOAD_LIBRO_200,
  payload: {
    value: 0
  },
})

export const fetchCategorias = () => ({
  type: FETCH_CATEGORIAS,
  promise: axios.get(
    `${baseURL}/categoria`,
    {}
  )
})

export const pasarLibro = () => ({
  type: PASAR_LIBRO,
  payload: {},
})

export const fetchLibros = (idUltimo, categorias) => ({
  type: FETCH_LIBROS,
  promise: axios.post(
    `${baseURL}/libro`,
    {
      ultimo: {
        idUsuario: 2,  // TODO
        idUltimoLibro: idUltimo,
        numeroLibros: NUM_LIBROS
      }
    }
  )
})

export const fetchMoreLibros = (idUltimo, categorias) => ({
  type: FETCH_MORE_LIBROS,
  promise: axios.post(
    `${baseURL}/libro`,
    {
      ultimo: {
        idUsuario: 2,  // TODO
        idUltimoLibro: idUltimo,
        numeroLibros: NUM_LIBROS
      }
    }
  )
})

export const doLogin = () => ({
  type: DO_LOGIN,
  promise: axios.post(
    `${baseURL}/login`,
    {
      email: 'admin',
      pass: 'admin'
    }
  )
})