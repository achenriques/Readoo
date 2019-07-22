import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../app_state/reducers';
import LS from './LanguageSelector';
import { pages, LANGUAGE_ENGLISH, LANGUAGE_SPANISH } from '../constants/appConstants';
import '../styles/Footer.css';

class Footer extends Component {

    initialState = {
        openSnackBar: false,
        snackBarMsg: ''
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if(nextProps.errorListener != null && nextProps.errorListener.length) {
            let errorMsg = "";
            nextProps.errorListener.forEach((err, index, array) => {
                if (index > 0) {
                    errorMsg += errorMsg + ' / ';
                }
                return errorMsg = errorMsg += err;
            }, this);
            return({
                ...prevState,
                snackBarMsg: errorMsg,
                openSnackBar: true,
            });
        }        
        return null;
    }

    handleSnakRequestClose = () => {
        this.props.resetErrLog();
        this.setState({
            ...this.state,
            openSnackBar: false,
        });
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
                <div className="Back-Color">
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
        errorListener: appState.getFailingStatus(state),
        appLanguage: appState.getAppLanguage(state)
    }),
    (dispatch) => ({})
)(Footer);

