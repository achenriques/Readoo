import { initialState } from './index';
import { actionTypes } from '../actions';
import { successType } from '../../utils/appUtils';
import * as constants from '../../constants/appConstants';

/**
 * Reducer for commons options of all views
 */
export default (state = initialState.common, { type, payload, data }) => {
    let response = data !== undefined ? data.data : null;
    switch (type) {
        case actionTypes.CHANGE_LANGUAGE:
            return {
                ...state,
                appLanguage: payload.languageCode
            };

        case successType(actionTypes.CHECK_TOKEN):
            let nextState = {
                ...state,
                userIsLogged: constants.USER_IS_LOGGED
            };
            if (data.data && data.data.languageCode != null) {
                nextState.appLanguage = +data.data.languageCode;
            }
            return nextState;
            
        case successType(actionTypes.DO_LOGIN):
            return {
                ...state,
                userIsLogged: constants.USER_IS_LOGGED
            }

        case successType(actionTypes.DO_LOG_OUT):
            return {
                ...state,
                userIsLogged: constants.USER_NOT_IS_LOGGED
            }

        case successType(actionTypes.DO_REGISTER):
            return {
                ...state,
                userIsLogged: constants.USER_FIRST_TIME_LOGGED
            }

        case actionTypes.DONE_REGISTER:
            return {
                ...state,
                userIsLogged: constants.USER_IS_LOGGED
            }

        case successType(actionTypes.FETCH_USER_PREVIEW_DATA): {
            if (data.data !== undefined) {
                return {
                    ...state,
                    userPreview: data.data
                }
            } else {
                return {
                    ...state,
                    userPreview: null
                };
            }
        }

        case successType(actionTypes.CHECK_NICK):
            return {
                ...state,
                avaliableNick: (response === true),
            }
             
        case successType(actionTypes.CHECK_EMAIL):
                return {
                    ...state,
                    avaliableEmail: (response === true),
                }

        case actionTypes.CHECKED_NICK:
            return {
                ...state,
                avaliableNick: null
            }

        case actionTypes.CHECKED_EMAIL:
                return {
                    ...state,
                    avaliableEmail: null
                }

        default:
            return state;
    }
}