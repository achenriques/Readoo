import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUserData, doLogin, doRegister } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import LS from '../LanguageSelector';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import avatarDefault from '../../resources/avatarDefault.svg';
import { DISPLAY_NONE, REST_FAILURE, REST_DEFAULT } from '../../constants/appConstants';

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

    checkEmail = (val) => {
        return /.*@[A-z]{1,15}\.[a-z]{2,3}$/.test(val);
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

        // if I have to dissable or not loggin Button
        let callback = () => {
            let acceptDisabled = false;
            if (!this.state.userData.userNickEmail.trim().length || !this.state.userData.userPass.length 
                    || this.state.repeatPassError || this.state.emailError 
                    || (this.state.isARegister && !this.state.userData.userEmail.length)) {
                acceptDisabled = true;
            }
            if (this.state.acceptDisabled !== acceptDisabled) {
                this.setState({
                    ...this.state,
                    acceptDisabled: acceptDisabled
                });
            }
        };

        // ver impletar errores en el alta de libros
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
                }
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
                repeatPassError: this.state.userData.userPass !== this.state.userData.userRepeatPass,
                acceptDisabled: true
            })
        } else {
            let logName = this.state.userData.userNickEmail.trim();
            let logPass = this.state.userData.userPass;
            this.props.doRegister(logName, logPass, this.props.appLanguage);
        }
        console.log(this.state)
    }

    render = () => {
        return (
            <div>
                <Grid container className="gridLogin">
                    <Grid item sm={8} className="columnaDatosPerfil">
                        <Paper elevation={4} className="divDatosPerfil">
                            <TextField
                                label= {(!this.state.isARegister) ? (<LS msgId='unique.user'/>) : (<LS msgId='nick.user'/>)}
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
                                value={this.state.userPass}
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
                                        value={this.state.userRepeatPass}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputLoginData"
                                    />
                                    <br/>
                                    <TextField
                                        error={this.state.emailError}
                                        label={(!this.state.emailError) ? (<LS msgId='your.email'/>) : (<LS msgId='isnot.email'/>)}
                                        id="userEmail"
                                        name="userEmail"
                                        fullWidth
                                        type="text"
                                        inputProps={{
                                            maxLength: 20,
                                        }}
                                        value={this.state.userRepeatPass}
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
        appLanguage: appState.getAppLanguage(state)
    }),
    (dispatch) => ({
        fetchUserData: () => dispatch(fetchUserData()),
        doLogin: (logName, logPass, language) => dispatch(doLogin(logName, logPass, language)),
        doRegister: (logName, logPass, email, language) => dispatch(doRegister(logName, logPass, email, language))
    })
)(Login);