import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'bootstrap';
import { checkToken, resetErrLog } from './app_state/actions';
import * as appState from './app_state/reducers';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import LS from './components/LanguageSelector';
import Login from './components/login/Login';
import ShortcutBar from './components/ShortcutBar';
import BodyContainer from './components/BodyContainer';
import Footer from './components/Footer';

class App extends Component {

    initialState = {
        openSnackBar: false,
        snackBarMsg: ''
    };

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.props.checkToken();
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
    };

    handleSnakRequestClose = () => {
        this.props.resetErrLog();
        this.setState({
            ...this.state,
            openSnackBar: false,
        });
    };

    render() {
        return (
            <div>
                <Snackbar
                    open={this.state.openSnackBar}
                    message={this.state.snackBarMsg}                            
                    autoHideDuration={5000 /*ms*/}
                    onClose={() => this.handleSnakRequestClose()}
                    action={[
                        <Button key="close" color="secondary" size="small" onClick={() => this.handleSnakRequestClose()}>
                            <LS msgId="close" defaultMsg="Close"/>
                        </Button>
                        ]}
                />
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
        errorListener: appState.getFailingStatus(state)
    }),
    (dispatch) => ({
        //fetchUserData: () => dispatch(fetchUserData()),
        checkToken: () => dispatch(checkToken()),
        resetErrLog: () => dispatch(resetErrLog())
    })
)(App);