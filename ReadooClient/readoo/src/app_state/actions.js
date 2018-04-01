import axios from 'axios';
const baseURL = 'http://localhost:3030';

//ACTION TYPES
export const FETCH_TABS_INICIAL = 'FETCH_TABS_INICIAL';
export const TAB_CHANGE = 'TAB_CHANGE';
export const MODAL_ADD_LIBRO = 'MODAL_ADD_LIBRO';
export const UPLOAD_LIBRO = 'UPLOAD_LIBRO';
export const DO_LOGIN = 'DO_LOGIN';

// Default basic auth
//axios.defaults.headers.common['Authorization'] = bAuth.bUser;

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
  payload: {},
  promise: axios.post(
    `${baseURL}/newLibro`,
    datosLibro.form,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
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