import axios from 'axios';
import {} from '../constants/appConstants';
const baseURL = 'http://localhost:3030';

// Setted for evict cross-sitting error
axios.defaults.withCredentials = true;

// Default basic auth
//axios.defaults.headers.common['Authorization'] = bAuth.bUser;

const doLogin = (userNickEmail, pass) => axios.post(
    `${baseURL}/login`,
    {
        userNickEmail: userNickEmail,
        pass: pass
    }
)

const doRegister = (userNickEmail, pass, email, language) => axios.post(
    `${baseURL}/login/new`,
    {
        userNickEmail: userNickEmail,
        pass: pass,
        email: email,
        language: language
    }
)

const doLogOut = () => axios.get( 
    `${baseURL}/logout`
)

const checkToken = () => axios.get(
    `${baseURL}/login/isme`
)

export default {
    doLogin,
    doRegister,
    doLogOut,
    checkToken
}