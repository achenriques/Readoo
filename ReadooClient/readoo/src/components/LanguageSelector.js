import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../app_state/reducers';
import { changeLanguage } from '../app_state/actions';
import stringResources from '../resources/stringResources';
import { LANGUAGE_ENGLISH } from '../constants/appConstants';

class LanguageSelector extends Component {

    initialState = {
        appLanguage: 0,
        userLanguage: 0
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.appLanguage) {
            return({
                ...prevState,
                appLanguage: +nextProps.appLanguage
            });
        } else {
            if (nextProps.userLanguage) {
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

    /* shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.appLanguage) {
            if (this.state.appLanguage !== nextProps.appLanguage) {
                this.changeLanguage(+nextProps.appLanguage)
            }
        } else {
            if (nextProps.userLanguage) {
                if (this.state.appLanguage != nextProps.userLanguage) {
                    this.changeLanguage(+nextProps.userLanguage)
                }
            }
        }
        return false;
    } */

    changeLanguage = (languageCode) => {
        this.props.changeAppLanguage(+languageCode);
    }

    getCurrentLanguageCode = () => {
        return this.state.appLanguage;
    }

    msg = (msgId, defaultMsg) => {
        let toRet = stringResources[this.state.appLanguage][msgId];
        if (!toRet) {
            toRet = (defaultMsg) ? defaultMsg : "";
        }
        return toRet;
    }

    render = () => {
        return (<span>{ this.msg(this.props.msgId, this.props.defaultMsg) }</span>);
    }
}

export default connect(
    (state) => ({
        appLanguage: appState.getAppLanguage(state),
        userLanguage: appState.getUserLanguage(state),
    }),
    (dispatch) => ({
        changeAppLanguage: (languageCode) => dispatch(changeLanguage(languageCode))
    })
)(LanguageSelector);