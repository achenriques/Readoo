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

    initialState = {}

    constructor(props) {
        super(props);
        this.state = this.initialState;
    };

    componentDidMount() {
        // Check if a sesson is open
        if (!this.props.userIsLogged) {
            this.props.checkToken();
        }
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.userIsLogged !== prevProps.userIsLogged
                && this.props.userIsLogged === USER_FIRST_TIME_LOGGED ) {
            this.props.changeTab(pages.PROFILE);
        }
    }

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