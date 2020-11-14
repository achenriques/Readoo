import { initialState } from './index';
import { actionTypes } from '../actions';
import * as constants from '../../constants/appConstants';
import LS from '../../components/LanguageSelector';

/**
 * Reducer to controller Rest operations and show err messages or warnings if necessary
 */
export default (state = initialState.controllerStatus, { type, payload, data, err }) => {
    // If the type listened from action is from a promise failed...
    let typeString = "" + type;
    // Save user request code to know when recharge userData if it was necessary
    let saveUserReqCode = state.saveUserReqCode; 
    switch (typeString) {
        case actionTypes.RESET_PROCCESS:
            let failed_processes1 = state.failed_processes.filter(element => element !== payload.nameOfProcess);
            let loading_processes1 = state.loading_processes.filter(element => element !== payload.nameOfProcess);
            let succeed_processes1 = state.succeed_processes.filter(element => element !== payload.nameOfProcess);
            return {
                ...state,
                failed_processes: failed_processes1,
                loading_processes: loading_processes1,
                succeed_processes: succeed_processes1
            };

        case actionTypes.RESET_LOADS:
            return {
                ...state,
                loading: 0
            };

        case actionTypes.RESET_ERRORS:
            return {
                ...state,
                failure: []
            };

        case actionTypes.REPORT_ERROR_MESSAGE:
            let newFailure = state.failure.slice();
            if (payload.errorMsg !== undefined && payload.errorMsg !== "") {
                newFailure.push(payload.errorMsg);
            }
            return {
                ...state,
                failure: newFailure
            };
            
        default:
            let petitionStatus = null;
            if (typeString.includes('_FAILURE')) {
                petitionStatus = constants.REST_FAILURE;
            } else if (typeString.includes('_LOADING')) {
                petitionStatus = constants.REST_DEFAULT;
            } else if (typeString.includes('_SUCCESS')) {
                petitionStatus = constants.REST_SUCCESS;
            } else {
                // If no coencidences must return the prev state
                return state;
            }
            
            let nameOfProcess = typeString.slice(0, typeString.length - constants.PROCCESS_STATUS_WORD_LENGTH);
            // The collection has to include the name of the process, so first of all it is neccessary to remove for avoid repeats
            let failed_processes2 = state.failed_processes.filter(element => element !== nameOfProcess);
            let loading_processes2 = state.loading_processes.filter(element => element !== nameOfProcess);
            let succeed_processes2 = state.succeed_processes.filter(element => element !== nameOfProcess);

            switch (petitionStatus) {
                case constants.REST_FAILURE:
                    let nextFailure = [];
                    failed_processes2.push(nameOfProcess);
                    // Its me failing... No user connected
                    if (err.response !== undefined) {
                            let info = (err.response.data !== undefined) ? err.response.data.info : "";
                        switch (err.response.status) {
                            case constants.ERROR_401:
                                if (info) {
                                    nextFailure.push(LS.getStringMsg(info, 'Error at log portal.'));
                                } else {
                                    nextFailure.push(LS.getStringMsg('no.user.logged', 'No user logged yet, Please Log or Register!'));
                                }
                                break;
                            case constants.ERROR_403:
                                nextFailure.push(LS.getStringMsg((info) ? info : 'no.token.provided', 'The sesson has expired. Please refresh the page and log in to continue!'));
                                break;
                            default:
                                nextFailure = (Array.isArray(state.failure)) ? state.failure.slice(0) : []; // Clone array to not modify original
                                if (info) {
                                    nextFailure.push(LS.getStringMsg(info, "" + err));
                                } else {
                                    nextFailure.push(err);
                                }
                                break;
                        }    
                    } else {
                        nextFailure = (Array.isArray(state.failure)) ? state.failure.slice(0) : []; // Clone array to not modify original
                        nextFailure.push(err);
                    }
                    return {
                        ...state,
                        loading_processes: loading_processes2,
                        succeed_processes: succeed_processes2,
                        failed_processes: failed_processes2,
                        failure: nextFailure,
                        loading: (state.loading < 0) ? 0 : state.loading - 1
                    };

                case constants.REST_DEFAULT:
                    loading_processes2.push(nameOfProcess);
                    return {
                        ...state,
                        loading_processes: loading_processes2,
                        succeed_processes: succeed_processes2,
                        failed_processes: failed_processes2,
                        loading: state.loading + 1
                    };

                case constants.REST_SUCCESS:
                    succeed_processes2.push(nameOfProcess);
                    return {
                        ...state,
                        loading_processes: loading_processes2,
                        failed_processes: failed_processes2,
                        succeed_processes: succeed_processes2,
                        loading: (state.loading < 0) ? 0 : state.loading - 1
                    };
            
                default:
                    // If no coencidences must return the prev state
                    return state;
            }
    }    
}
