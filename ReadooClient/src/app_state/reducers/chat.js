import { initialState } from './index';
import { actionTypes } from '../actions';
import { failureType, successType } from '../../utils/appUtils';

/**
 * Reducer for chat and its options
 */
export default (state = initialState.chat, { type, payload, data }) => {
    switch (type) {
        case (actionTypes.GO_CHAT_WITH):
            if (payload.otherUserId) {
                return {
                    ...state,
                    chatWith: payload.otherUserId
                };
            } else {
                return state;
            }

        case (actionTypes.RECIVED_GO_CHAT_WITH):
            return {
                ...state,
                chatWith: null
            };

        case successType(actionTypes.FETCH_CHAT_HISTORY):
            return {
                ...state,
                chatHistory: data.data
            };

        case failureType(actionTypes.FETCH_CHAT_HISTORY):
            return {
                ...state,
                chatHistory: null
            };

        case successType(actionTypes.FETCH_CHAT_MESSAGES):
            return {
                ...state,
                chatMessages: data.data
            };
  
        case successType(actionTypes.FETCH_CHAT_MESSAGES):
                return {
                    ...state,
                    chatMessages: null
                };

        case successType(actionTypes.DELETE_CHAT):
            let newChatHistory = state.chatHistory.filter(c => c.chatId !== payload.chatId);
            return {
                ...state,
                chatHistory: newChatHistory
            }
  
        default:
            return state;
    }
}