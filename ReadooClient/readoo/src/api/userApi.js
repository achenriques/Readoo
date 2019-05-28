import axios from 'axios';
import {} from '../constants/appConstants';
const baseURL = 'http://localhost:3030';

// Setted for evict cross-sitting error
axios.defaults.withCredentials = true;

// Default basic auth
//axios.defaults.headers.common['Authorization'] = bAuth.bUser;

const fetchUserData = (userId) => axios.get(
    `${baseURL}/user`,
    {
        params: {
            id: userId
        }
    }
)

const saveUserData = (userData) => axios.post(
    `${baseURL}/user`,
    {
        userData
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
    saveUserData,
    doLikeBook,
    doDislikeBook
}