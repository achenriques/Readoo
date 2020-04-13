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

const checkNickIsUnique = (userNick) => axios.get(
    `${baseURL}/login/avaliable`, {
        params: {
            userNickEmail: userNick
        }
    }
)

const checkEmailIsUnique = (email) => axios.get(
    `${baseURL}/login/avaliableEmail`, {
        params: {
            email: email
        }
    }
)


const doLogOut = () => axios.get( 
    `${baseURL}/login/logout`
)

const checkToken = () => axios.get(
    `${baseURL}/login/isme`, { withCredentials: true }
)

const setTabSelector = (tabSelector) => axios.post(
    `${baseURL}/login/tabSelector`,
    {
        tabSelector: tabSelector
    }
)

export default {
    doLogin,
    doRegister,
    checkNickIsUnique,
    checkEmailIsUnique,
    doLogOut,
    checkToken,
    setTabSelector
}