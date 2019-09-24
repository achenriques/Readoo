import axios from 'axios';
import {} from '../constants/appConstants';
const baseURL = 'http://localhost:3030';

// Setted for evict cross-sitting error
axios.defaults.withCredentials = true;

// Default basic auth
//axios.defaults.headers.common['Authorization'] = bAuth.bUser;

const fetchUserData = (userId) => axios.get(
    `${baseURL}/user?id=${userId}`,{
    }
)

const fetchUserGenres = (userId) => axios.get(
    `${baseURL}/userGenre?id=${userId}`, {
    }
)

const saveUserData = (userData) => axios.put(
    `${baseURL}/user`,
    userData.form,
    {
        headers: { 'Content-Type': 'multipart/form-data' }
    }
)

const dissableUser = (userId) => axios.post(
    `${baseURL}/dissableUser`,
    {
        userId
    }
)

// ---- RELATED WITH USERS -----
const doLikeBook = (bookId, userId) => axios.post(
    `${baseURL}/userLikesBook`,
    {
        like: {
            bookId: bookId,
            userId: userId
        }
    }
)

const doDislikeBook = (bookId, userId) => axios.delete(
    `${baseURL}/userLikesBook`,
    {
        like: {
            bookId: bookId,
            userId: userId
        }
    }
)

export default {
    fetchUserData,
    fetchUserGenres,
    saveUserData,
    dissableUser,
    doLikeBook,
    doDislikeBook
}