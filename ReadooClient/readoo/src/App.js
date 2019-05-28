import React, { Component } from 'react';
import 'bootstrap';
import Login from './components/login/Login';
import ShortcutBar from './components/ShortcutBar';
import BodyContainer from './components/BodyContainer';
import Footer from './components/Footer';
import { connect } from 'react-redux';
import { checkToken } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';

class App extends Component {

    initialState = {
        userIsLogged: false
    }

    constructor(props) {
        super(props);
        // this.state = {};
    };

    componentWillMount() {
        if (!this.props.userIsLogged) {
          this.props.checkToken();
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
        userIsLogged: appState.userIsLogged(state),
    }),
    (dispatch) => ({
        //fetchUserData: () => dispatch(fetchUserData()),
        checkToken: () => dispatch(checkToken())
    })
)(App);