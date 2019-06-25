import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'bootstrap';
import { checkToken, changeTab } from './app_state/actions';
import * as appState from './app_state/reducers';
import Login from './components/login/Login';
import ShortcutBar from './components/ShortcutBar';
import BodyContainer from './components/BodyContainer';
import Footer from './components/Footer';
import { USER_FIRST_TIME_LOGGED, pages } from './constants/appConstants';

class App extends Component {

    initialState = {
        USER_FIRST_TIME_LOGGED: USER_FIRST_TIME_LOGGED
    }

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.props.checkToken();
    };

    /* static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.userIsLogged != null && prevState.USER_FIRST_TIME_LOGGED === nextProps.userIsLogged) {
            this.props.changeTab(pages.PROFILE); 
        }
        return null;
    } */

    render() {
        return (
            <div>
                <ShortcutBar/>
                {(this.props.userIsLogged) ? <BodyContainer/> : <Login/> }
                <Footer/>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        userIsLogged: appState.getUserIsLogged(state),
    }),
    (dispatch) => ({
        //fetchUserData: () => dispatch(fetchUserData()),
        checkToken: () => dispatch(checkToken()),
        changeTab: (tabId) => dispatch(changeTab(tabId))
    })
)(App);