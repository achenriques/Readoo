import axios from 'axios';
import { isLocalhost } from '../registerServiceWorker';
import { LOCAL_ENDPOINT } from '../constants/appConstants';

const baseURL = (isLocalhost ? LOCAL_ENDPOINT : "");

// Setted for evict cross-sitting error
axios.defaults.withCredentials = true;

// Default basic auth
//axios.defaults.headers.common['Authorization'] = bAuth.bUser;

const fetchChatHistory = (userId) => axios.get(
    `${baseURL}/chatHistory?userId=${userId}`,{}
);

const deleteChat = (chatId, userId) => axios.delete(
    `${baseURL}/chat`,
    {
        data: {
            chatId,
            userId
        }
    }
);

const fetchChatMessages = (chatId, userId) => axios.get(
    `${baseURL}/chatMessages?chatId=${chatId}&userId=${userId}`,{}
);

export default {
    fetchChatHistory,
    deleteChat,
    fetchChatMessages
}