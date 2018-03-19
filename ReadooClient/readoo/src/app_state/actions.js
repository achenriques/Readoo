import axios from 'axios';
import { bAuth } from '../constants/server_configs';
const baseURL = 'http://localhost:3030';

//ACTION TYPES
export const FETCH_TABS_INICIAL = 'FETCH_TABS_INICIAL';
export const TAB_CHANGE = 'TAB_CHANGE';
export const MODAL_ADD_LIBRO = 'MODAL_ADD_LIBRO';
export const UPLOAD_LIBRO = 'UPLOAD_LIBRO';
export const DO_LOGIN = 'DO_LOGIN';

// Default basic auth
axios.defaults.headers.common['Authorization'] = bAuth.bUser;

//ACTION CREATORS
export const fetchTabsInicial = (idUsuario) => ({
  type: FETCH_TABS_INICIAL,
  promise: axios.post(
    `${baseURL}/tabs`,
    {
      id: idUsuario
    }
  )
})

export const changeTab = (newTabID) => ({
  type: TAB_CHANGE,
  payload: {
    newTabID: newTabID
  }
})

export const setIsOpenAddLibro = (isOpen) => ({
  type: MODAL_ADD_LIBRO,
  payload: {
    isOpen: isOpen
  }
})

export const uploadLibro = (datosLibro) => ({
  type: UPLOAD_LIBRO,
  promise: axios.post(
    `${baseURL}/libro`,
    {
      idLibro: 0,
      titulo: datosLibro.titulo,
      autor: datosLibro.autor,
      descripcion: datosLibro.historia,
      review: datosLibro.opinion,
      likes: 0,
      fecha: "",
      coverUrl: datosLibro.img,
      Usuario_idUsuario: 2,
      Categoria_idCategoria: 13,
      visible: "S"
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