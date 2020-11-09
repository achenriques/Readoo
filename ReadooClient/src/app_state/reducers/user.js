import { initialState } from './index';
import { actionTypes } from '../actions';
import { successType } from '../../utils/appUtils';

/**
 * Reducer para el usuario actual de la aplicación. Responde al login inicial y ofrece los datos del mismo para futuras peticiones y otras
 * secciones de la aplicacion
 **/
export default (state = initialState.user, { type, payload, data }) => {
    if (data) {
        let userData = data.data;
        if (userData.userData !== undefined) {
            userData = userData.userData; // this case is when user logs in the APP. We recive more params than userData..
        }
        if (userData && userData.userLanguage == null && payload && payload.preferedLanguage != null) {
            userData.userLanguage = payload.preferedLanguage;
        }
        switch (type) {
            case successType(actionTypes.CHECK_TOKEN):
                return userData;

            case successType(actionTypes.DO_LOGIN):
                return userData;

            case successType(actionTypes.DO_LOG_OUT):
                return initialState.user;

            case successType(actionTypes.DO_REGISTER):
                return {
                    userId: userData.userId,
                    userNick: payload.nickEmail,
                    userEmail: payload.email,
                    userName: '',
                    userSurname: '',
                    userAvatarUrl: '',
                    userAboutMe: '',
                    userPass: '',
                    userKarma: 0,
                    userLanguage: userData.userLanguage,
                    userGenres: [],
                    userVisible: true
                };

            case successType(actionTypes.FETCH_USER_DATA):
                return userData;

            case successType(actionTypes.SAVE_USER_DATA):
                if (payload.newUserData) {
                    let nextUser = Object.assign({}, state);
                    Object.keys(payload.newUserData).forEach(
                        (key) => (payload.newUserData[key] == null || key === "userPass" || key === "oldUserPass") && delete payload.newUserData[key]
                    );
                    nextUser = Object.assign(nextUser, payload.newUserData);
                    return nextUser;
                }
                return state;

            default:
                return state;
        }
    } else {
        return state;
    }
}