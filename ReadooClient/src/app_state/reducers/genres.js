import { initialState } from './index';
import { actionTypes } from '../actions';
import { successType } from '../../utils/appUtils';

/**
 * Reducer for genres and its options
 */
export default (state = initialState.genres, { type, payload, data }) => {
    switch (type) {
        case successType(actionTypes.FETCH_GENRES):
            return {
                ...state,
                all: data.data,
            };

        case successType(actionTypes.FETCH_USER_GENRES):
            return {
                ...state,
                userGenres: data.data,
            };

        default:
            return state;
    }
}