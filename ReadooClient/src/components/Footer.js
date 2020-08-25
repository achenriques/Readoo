import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../app_state/reducers';
import LS from './LanguageSelector';
import { pages, LANGUAGE_ENGLISH, LANGUAGE_SPANISH } from '../constants/appConstants';
import '../styles/Footer.css';

class Footer extends Component {

    initialState = {};

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    getCurrentStatus(status) {
        switch (status) {
            case pages.LOGIN:
                return <LS msgId="login" defaultMsg="Log In"/>
            
            case pages.EXPLORE:
                return <LS msgId="exploring.books" defaultMsg="Explore"/>
    
            case pages.FAVOURITES:
                return <LS msgId="refreshing.my.mind" defaultMsg="Favourites"/>
    
            case pages.CHAT:
                return <LS msgId="chatting" defaultMsg="Chat"/>
    
            case pages.PROFILE:
                return <LS msgId="who.am.i" defaultMsg="Me"/>
    
            default:
                return <LS msgId="Readoo" defaultMsg="Readoo"/>
        }
    }

    getCurrentLanguage = (languageId) => {
        switch (languageId) {
            case LANGUAGE_ENGLISH:
                return <LS msgId="English" defaultMsg="English"/>
            case LANGUAGE_SPANISH:
                return <LS msgId="Spanish" defaultMsg="Español"/>
            default:
                return "";
        }
    }

    render() {
        return (
            <div>
                <div className="footerColor">
                    <div className="displayed-left">
                        <LS msgId="status" defaultMsg=""/> {this.getCurrentStatus(this.props.selectedIndex)}
                    </div>
                    <div className="displayed-right">
                        <LS msgId="language" defaultMsg="Language"/>{this.getCurrentLanguage(this.props.appLanguage)}
                    </div>
                </div>
            </div>
            
        );
    }
}

export default connect(
    (state) => ({
        selectedIndex: appState.getCurrentTabID(state),
        appLanguage: appState.getAppLanguage(state)
    }),
    (dispatch) => ({})
)(Footer);

