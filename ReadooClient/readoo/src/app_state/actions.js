import axios from 'axios';
import { NUM_LIBROS, NUM_COMENTARIOS, REST_DEFAULT } from '../constants/appConstants';
const baseURL = 'http://localhost:3030';

//ACTION TYPES
export const TAB_CHANGE = 'TAB_CHANGE';
export const MODAL_ADD_LIBRO = 'MODAL_ADD_LIBRO';
export const UPLOAD_LIBRO = 'UPLOAD_LIBRO';
export const DO_LOGIN = 'DO_LOGIN';
export const UPLOAD_LIBRO_200 = 'UPLOAD_LIBRO_200';
export const UPLOAD_COMENTARIO_200 = 'UPLOAD_COMENTARIO_200';
export const FETCH_CATEGORIAS = 'FETCH_CATEGORIAS';
export const PASAR_LIBRO = 'PASAR_LIBRO';
export const ATRAS_LIBRO = 'ATRAS_LIBRO';
export const ME_GUSTA_LIBRO = 'ME_GUSTA_LIBRO';
export const FETCH_LIBROS = 'FETCH_LIBROS';
export const FETCH_MORE_LIBROS = 'FETCH_MORE_LIBROS';
export const FETCH_COMENTARIOS = 'FETCH_COMENTARIOS';
export const ENVIAR_COMENTARIO = 'ENVIAR_COMENTARIO';
export const SET_ERROR_ENVIAR_COMENTARIO = 'SET_ERROR_ENVIAR_COMENTARIO';

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
    value: REST_DEFAULT
  },
})

// Setear la carga de datos para la subida de comentarios.
// Se utiliza para mostrar mensajes de alerta
export const controllerComentarioDefault = () => ({
  type: UPLOAD_COMENTARIO_200,
  payload: {
    value: REST_DEFAULT
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

export const atrasLibro = () => ({
  type: ATRAS_LIBRO,
  payload: {},
})

export const enviarMeGusta = (idLibro, idUsuario) => ({
  type: ME_GUSTA_LIBRO,
  payload: { meGusta: true},
  promise: axios.post(
    `${baseURL}/usuariolikelibro`,
    {
      like: {
        idLibro: idLibro,
        idUsuario: 2,  // TODO
      }
    }
  )
})

export const enviarNoMeGusta = (idLibro, idUsuario) => ({
  type: ME_GUSTA_LIBRO,
  payload: { idLibro: idLibro, meGusta: false},
  promise: axios.delete(
    `${baseURL}/usuariolikelibro`,
    {
      data: {
        like: {
          idLibro: idLibro,
          idUsuario: 2,  // TODO
        }
      }
    }
  )
})

export const fetchLibros = (idUltimo, categorias, primeraVez) => ({
  type: FETCH_LIBROS,
  payload: { primeraVez: primeraVez },
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

export const fetchComentarios = (idLibro, numComentarios, fechaUltimo) => ({
  type: FETCH_COMENTARIOS,
  promise: axios.post(
    `${baseURL}/comentario/fetch`,
    {
      idLibro,
      numComentarios,
      fechaUltimo
    }
  )
})

export const enviarComentario = (idComentario, idLibro, idUsuario, comentario) => ({
  type: ENVIAR_COMENTARIO,
  promise: axios.post(
    `${baseURL}/comentario/nuevo`,
    {
      idComentario,
      idLibro,
      idUsuario,
      idComentario
    }
  )
})