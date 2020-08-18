import { REST_FAILURE, REST_DEFAULT, REST_SUCCESS } from '../constants/appConstants';

/*
 *  Remove a proccess from the proccesses list and at the end returns where the proccess was if it was found in other cases returns null.
 * If the actionsReference is avoided the process will not be removed yet
*/
export const getProccessStatus = (processName, loadingProccesses, failureProcessess, succeedProcesses, actionCallback) => {
    if (processName == null || processName.length === 0 || !Array.isArray(loadingProccesses) 
            || !Array.isArray(failureProcessess) || !Array.isArray(succeedProcesses)) {
        return null;
    }

    let toRet = null;
    if (succeedProcesses.includes(processName)) {
        toRet = REST_SUCCESS;
    } else if (failureProcessess.includes(processName)) {
        toRet = REST_FAILURE;
    } else if (loadingProccesses.includes(processName)) {
        toRet = REST_DEFAULT;
    }

    (toRet !== null && actionCallback != null) && actionCallback(processName);
    return toRet;
}

// Delete unnecesary spaces
export const parseInputText = (inputText) => inputText.trim().replace(/(\r\n|\r|\n){2,}/g, '$1\n');