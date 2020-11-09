import { initialState } from './index';
import { actionTypes } from '../actions';

/**
 * Reducer for show app dialogs
 */
export default (state = initialState.dialogs, { type, payload, data }) => {
    switch (type) {
        case actionTypes.MODAL_ADD_BOOK:
            return {
                ...state,
                isOpenAddBook: payload.isOpen,
            };

        default:
            return state;
    }
}