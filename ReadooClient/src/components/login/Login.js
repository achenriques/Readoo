import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUserData, doLogin, doRegister, checkNickIsUnique, setNickIsUniqueFalse,
        checkEmailIsUnique, setEmailIsUniqueFalse} from '../../app_state/actions';
import * as appState from '../../app_state/reducers/index';
import LS from '../LanguageSelector';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import avatarDefault from '../../resources/avatarDefault.svg';
import '../../styles/Login.css';

class Login extends Component {

    initialState = {
        isLogged: false,
        isARegister: false,
        alreadyExists: false,
        userData: {
            userNickEmail: "",
            userPass: "",
            userRepeatPass: "",
            userEmail: ""
        },
        acceptDisabled: true,
        showRepeatPass: false,
        repeatPassError: false,
        emailError: false
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    componentDidUpdate = () => {
        let acceptDisabled = this.checkAcceptDisabled();
        if (this.state.acceptDisabled !== acceptDisabled) {
            this.setState({
                ...this.state,
                acceptDisabled: acceptDisabled
            });
        }
    }

    checkEmail = (val) => {
        let toRet = /.*@[A-z]{1,15}\.[a-z]{2,3}$/.test(val);
        if (toRet) {
            // If is a register we should prove that the nick does not exists yet
            this.props.checkEmailIsUnique(val.trim());
        } else {
            if (this.props.avaliableEmail === false && this.state.userData.userEmail !== val) {
                this.props.setEmailIsUniqueFalse();
            }
        }
        return toRet;
    }

    oChangeInput = (evt) => {
        const value = evt.target.value;
        const name = evt.target.name;

        let repeatPassError = this.state.repeatPassError;
        if (this.state.showRepeatPass && (name === "userPass" || name === "userRepeatPass")) {
            if ((name === "userPass" && value != this.state.userData.userRepeatPass)
                    || (name === "userRepeatPass" && value != this.state.userData.userPass)) {
                repeatPassError = true;
            } else {
                repeatPassError = false;
            }
        }

        let emailError = this.state.emailError;
        if (name === "userEmail") {
            emailError = !this.checkEmail(value);
        }

        // If is a register we should prove that the nick does not exists yet
        if (this.state.isARegister && name === "userNickEmail") {
            if (value.trim().length) {
                this.props.checkNickIsUnique(value);
            } else {
                this.props.setNickIsUniqueFalse();
            }
        }

        // if I have to dissable or not login Button
        let callback = () => {
            let acceptDisabled = this.checkAcceptDisabled();
            if (this.state.acceptDisabled !== acceptDisabled) {
                this.setState({
                    ...this.state,
                    acceptDisabled: acceptDisabled
                });
            }
        };

        this.setState({
            ...this.state,
            emailError: emailError,
            repeatPassError: repeatPassError,
            userData: {
                ...this.state.userData,
                [name]: value
            }            
        }, callback);
    }

    loadAvatarImage = (evt) => {
        /*
        const callState = () => {
            if (this.state.error.addBookCover === true) {
                this.setState({
                    ...this.state,
                    error: {
                        ...this.state.error,
                        addBookCover: false
                    }
                });
            }
        };
        */
        if (evt.target.files[0]) {
            this.setState({
                ...this.state,
                userData: {
                    ...this.state.userData,
                    avatar: (URL.createObjectURL(evt.target.files[0])) ? URL.createObjectURL(evt.target.files[0]) : null,
                },
                imagenAvatar: evt.target.files[0] ? evt.target.files[0] : avatarDefault
            }, /*callState*/);
        } else {
            this.setState({
                imagenAvatar: avatarDefault
            });
        }
    }

    acceptLogin = (evt) => {
        if(this.state.isARegister){
            // cancel register state
            this.setState({
                ...this.state,
                isARegister: false,
                showRepeatPass: false,
                repeatPassError: false,
                emailError: false,
                userData: {
                    ...this.state.userData,
                    userRepeatPass: "",
                    userEmail: ""
                },
                acceptDisabled: this.state.userData.userNickEmail.trim().length === 0 
                        || this.state.userData.userPass.length === 0 
            })
        } else {
            let logName = this.state.userData.userNickEmail.trim();
            let logPass = this.state.userData.userPass;
            this.props.doLogin(logName, logPass, this.props.appLanguage);
        }
    }

    acceptRegister = (evt) => {
        if(!this.state.isARegister){
            this.setState({
                ...this.state,
                isARegister: true,
                showRepeatPass: true,
                repeatPassError: false,
                acceptDisabled: true,
                userData: {
                    userNickEmail: "",
                    userPass: "",
                    userRepeatPass: "",
                    userEmail: ""
                },
            })
        } else {
            if (!this.checkAcceptDisabled()) {
                let logName = this.state.userData.userNickEmail.trim();
                let logPass = this.state.userData.userPass;
                let logEmail = this.state.userData.userEmail.trim();
                this.props.doRegister(logName, logPass, logEmail, this.props.appLanguage);
            }
        }
    }

    checkAcceptDisabled = () => {
        return (!this.state.userData.userNickEmail.trim().length || !this.state.userData.userPass.length 
        || this.state.repeatPassError || this.state.emailError 
        || (this.state.isARegister && (!this.state.userData.userEmail.length || !this.props.avaliableEmail
        || !this.props.avaliableNick)));
    }

    render = () => {
        let noAvaliableNick = (this.state.isARegister && this.state.userData.userNickEmail.trim().length > 0 
                && this.props.avaliableNick === false);

        let noAvaliableEmail = (this.state.isARegister && this.state.userData.userEmail.trim().length > 0 
                && this.props.avaliableEmail === false);

        return (
            <div>
                <Grid container className="gridLogin">
                    <Grid item sm={12} className="perfilDataColumn">
                        <Paper elevation={4} className="loginForm">
                            <TextField
                                error={noAvaliableNick}
                                label={(!this.state.isARegister) ? (<LS msgId='unique.user'/>) 
                                        : (!noAvaliableNick) ? (<LS msgId='nick.user'/>) : (<LS msgId='nick.user.exists'/>) }
                                id="loginNickEmail"
                                name="userNickEmail"
                                fullWidth
                                inputProps={{
                                    maxLength: 20,
                                }}
                                value={this.state.userData.userNickEmail}
                                onChange={this.oChangeInput.bind(this)}
                                className="inputLoginData"
                            />
                            <br/>
                            <TextField
                                error={this.state.repeatPassError}
                                label={(!this.state.repeatPassError) ? (<LS msgId='your.pass'/>) : (<LS msgId='pass.arnt.same'/>)}
                                id="userPass"
                                name="userPass"
                                fullWidth
                                type="password"
                                inputProps={{
                                    maxLength: 20,
                                }}
                                value={this.state.userData.userPass}
                                onChange={this.oChangeInput.bind(this)}
                                className="inputLoginData"
                            />
                            <br/>
                            {(this.state.isARegister)? (
                                <div>
                                    <TextField
                                        error={this.state.repeatPassError}
                                        label={(!this.state.repeatPassError) ? (<LS msgId='repeat.pass'/>) : (<LS msgId='pass.arnt.same'/>)}
                                        id="userRepeatPass"
                                        name="userRepeatPass"
                                        fullWidth
                                        type="password"
                                        inputProps={{
                                            maxLength: 20,
                                        }}
                                        value={this.state.userData.userRepeatPass}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputLoginData"
                                    />
                                    <br/>
                                    <TextField
                                        error={this.state.emailError || noAvaliableEmail}
                                        label={(!this.state.emailError && !noAvaliableEmail) ? (<LS msgId='your.email'/>) : (!noAvaliableEmail) 
                                                ? (<LS msgId='isnot.email'/>) : (<LS msgId='email.user.exists'/>)}
                                        id="userEmail"
                                        name="userEmail"
                                        fullWidth
                                        type="text"
                                        inputProps={{
                                            maxLength: 20,
                                        }}
                                        value={this.state.userData.userEmail}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputLoginData"
                                    />
                                <br/>
                            </div>
                            ): (<div/>)}
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container alignItems="flex-end">
                    <Grid item sm={12}>
                        <div className="loginButtons">
                            <Button 
                                variant="flat" 
                                color={(!this.state.isARegister) ? "secondary" : "primary"}
                                onClick={this.acceptRegister.bind(this)}
                                disabled={this.state.isARegister && this.state.acceptDisabled}
                            >
                                {<LS msgId='register'/>}
                            </Button>
                            <Button 
                                variant="flat" 
                                color={(!this.state.isARegister) ? "primary" : "secondary"}
                                onClick={this.acceptLogin.bind(this)}
                                disabled={!this.state.isARegister && this.state.acceptDisabled}
                            >
                                {(!this.state.isARegister) ? (<LS msgId='login'/>) : (<LS msgId='cancel.register'/>)}
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        appLanguage: appState.getAppLanguage(state),
        avaliableNick: appState.getAvaliableNick(state),
        avaliableEmail: appState.getAvaliableEmail(state)
    }),
    (dispatch) => ({
        fetchUserData: () => dispatch(fetchUserData()),
        doLogin: (logName, logPass, language) => dispatch(doLogin(logName, logPass, language)),
        doRegister: (logName, logPass, email, language) => dispatch(doRegister(logName, logPass, email, language)),
        setNickIsUniqueFalse: () => dispatch(setNickIsUniqueFalse()),
        setEmailIsUniqueFalse: () => dispatch(setEmailIsUniqueFalse()),
        checkNickIsUnique: (nick) => dispatch(checkNickIsUnique(nick)),
        checkEmailIsUnique: (email) => dispatch(checkEmailIsUnique(email))
    })
)(Login);