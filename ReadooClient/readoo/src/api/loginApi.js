import axios from 'axios';
import {} from '../constants/appConstants';
const baseURL = 'http://localhost:3030';

const doLogin = (userNickEmail, pass) => axios.post(
    `${baseURL}/login`,
    {
        userNickEmail: user,
        pass: pass
    },
    {
        withCredentials: true,
    }
)

const doLogOut = () => axios.get( 
    `${baseURL}/logout`,
    {
        withCredentials: true,
    }
)

const checkToken = () => axios.get(
    `${baseURL}/login/isme`,
    {
        withCredentials: true,
    } 
)

export default {
    doLogin,
    doLogOut,
    checkToken
}