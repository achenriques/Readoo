import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../app_state/reducers/index';
import { changeLanguage } from '../app_state/actions';
import stringResources from '../resources/stringResources';
import { LANGUAGE_ENGLISH } from '../constants/appConstants';

/*
 * This class is a class that return strings depending of the selected language in the APP.
 * The messages are duplicated for each language existing in the APP.
 * Remember: This class is a component. The fomat is <LS msgId="the selected mesage from stringResources.js" defaultMsg="default mesage provider if the string does not exists" 
 *      params=["Array of strings, each position replaces {0} in the original string, where the 0 or others are the position in the params array"] />
*/
class LanguageSelector extends Component {

    initialState = {
        appLanguage: 0,
        userLanguage: 0
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
        LanguageSelector.staticLanguageId = LANGUAGE_ENGLISH;
    };

    static getStringMsg = (msgId, defaultMsg, params) => {
        let langId = (LanguageSelector.staticLanguageId !== undefined && stringResources[LanguageSelector.staticLanguageId] !== undefined)
                ? LanguageSelector.staticLanguageId
                : LANGUAGE_ENGLISH;
        let toRet = (stringResources[langId] !== undefined)
                ? stringResources[langId][msgId]
                : "";
        if (!toRet) {
            toRet = (defaultMsg) ? defaultMsg : "";
        }
        if(params != null && params.length > 0) {
            params.forEach((element, index, list) => {
                toRet = toRet.replace("{" + index + "}", element);
            });
        }
        return toRet;
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.appLanguage != null && prevState.appLanguage !== nextProps.appLanguage) {
            LanguageSelector.staticLanguageId = +nextProps.appLanguage;
            return({
                ...prevState,
                appLanguage: +nextProps.appLanguage
            });
        } else {
            if (nextProps.userLanguage != null) {
                LanguageSelector.staticLanguageId = +nextProps.userLanguage;
                return({
                    appLanguage: +nextProps.userLanguage,
                    userLanguage: +nextProps.userLanguage
                });
            }
        }
        return null;
    }

    componentDidMount = () => {
        let appLanguage = this.props.appLanguage;
        if (appLanguage) {
            this.setState({
                ...this.state,
                appLanguage: (appLanguage) ? appLanguage : LANGUAGE_ENGLISH
            })
        }
    }

    static returnPlainText = (msgId, defaultMsg, params) => {
        return this.msg(msgId, defaultMsg, params);
    }


    changeLanguage = (languageCode) => {
        this.props.changeAppLanguage(+languageCode);
    }

    getCurrentLanguageCode = () => {
        return this.state.appLanguage;
    }

    msg = (msgId, defaultMsg, params) => {
        let toRet = (stringResources[this.state.appLanguage] !== undefined)
                ? stringResources[this.state.appLanguage][msgId]
                : "";
        if (!toRet) {
            toRet = (defaultMsg) ? defaultMsg : "";
        }
        if(params != null && params.length > 0) {
            params.forEach((element, index, list) => {
                toRet = toRet.replace("{" + index + "}", element);
            });
        }

        return toRet;
    }

    render = () => {
        return (
            <span className="languageSelector">
                { this.msg(this.props.msgId, this.props.defaultMsg, this.props.params) }
            </span>
        );
    }
}

export const getStringMsg = LanguageSelector.getStringMsg;

export default connect(
    (state) => ({
        appLanguage: appState.getAppLanguage(state),
        userLanguage: appState.getUserLanguage(state),
    }),
    (dispatch) => ({
        changeAppLanguage: (languageCode) => dispatch(changeLanguage(languageCode))
    })
)(LanguageSelector);