import { REST_FAILURE, REST_DEFAULT, REST_SUCCESS, 
    FILE_BYTE_LIMIT, LANGUAGE_ENGLISH, LANGUAGE_SPANISH } from '../constants/appConstants';

export const failureType = (actionType) => `${actionType}_FAILURE`;
export const loadingType = (actionType) => `${actionType}_LOADING`;
export const successType = (actionType) => `${actionType}_SUCCESS`;

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

// LIMITS the file size
export const excedsLimit = (file) => {
    return file.size > FILE_BYTE_LIMIT;
}

export const compareArrays = (array1, array2) => {
    return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
}

// Parse the date
export const parseDate = (date, language) => {
    try {
        if (date.getDate === undefined 
                && (typeof(date) === 'number'
                || typeof(date) === 'string')) {
            date = new Date(date);
        }
        let day = date.getDate();
        let month = date.getUTCMonth() + 1;
        let year = date.getUTCFullYear();
        let hour = date.getUTCHours();
        let min = date.getUTCMinutes();
        let sec = date.getUTCSeconds();
        switch(language) {
            case(LANGUAGE_SPANISH):
                return "" + ((day < 10) ? "0" + day : day) + 
                        "/" + ((month < 10) ? "0" + month : month) +
                        "/" + year + " " +
                        ((hour < 10) ? "0" + hour : hour) + ":" +
                        ((min < 10) ? "0" + min : min) + ":" +
                        ((sec < 10) ? "0" + sec : sec);
            default:    // equals to english.
                return "" + ((month < 10) ? "0" + month : month) + 
                        "/" + ((day < 10) ? "0" + day : day) +
                        "/" + year + " " +
                        ((hour < 10) ? "0" + hour : hour) + ":" +
                        ((min < 10) ? "0" + min : min) + ":" +
                        ((sec < 10) ? "0" + sec : sec);
        }
    } catch(error) {
        console.error(error);
        return date;
    }

}