import { initialState } from './index';
import { actionTypes } from '../actions';
import {successType } from '../../utils/appUtils';

// This is a reducer that managers all reducers from the top level
export default (state = initialState, { type, payload, data, err }) => {
    let expiredSessionState = initialState;
    // In this case if we recibe that a token has expired we reset the app.
    if (err && err.response && err.response.status === constants.ERROR_403) {
        expiredSessionState.common.userIsLogged = constants.USER_HAS_EXPIRED;
        return expiredSessionState;
    } else {
        if (type === successType(actionTypes.DO_LOG_OUT)) {
            return expiredSessionState;
        }
    }
    return state;
}