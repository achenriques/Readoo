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

class ProfileView extends Component {

    initialState = {
        isLogged: false,
        isARegister: false,
        alreadyExists: false,
        userData: {
            userNickEmail: "",
            userPass: "",
            userRepeatPass: ""
        },
        acceptDisabled: false,
        showRepeatPass: false,
        repeatPassError: false
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    oChangeInput = (evt) => {
        const value = evt.target.value;
        const name = evt.target.name;

        let repeatPassError = false;
        if (this.state.showRepeatPass && (name === "userPass" || name === "userRepeatPass")) {
            if ((name === "userPass" && value != this.state.userData.userRepeatPass)
                    || (name === "userRepeatPass" && value != this.state.userData.userPass)) {
                repeatPassError: true;
            }
        }

        let acceptDisabled = false;
        if (!this.state.userData.userNickEmail.trim().length || !this.state.userData.userPass.length) {
            acceptDisabled = true;
        }

        // ver impletar errores en el alta de libros
        this.setState({
            ...this.state,
            acceptDisabled: acceptDisabled,
            userData: {
                ...this.state.userData,
                [name]: value
            },
            repeatPassError: repeatPassError
        });
    }

    loadAvatarImage = (evt) => {
        /*
        const callState = () => {
            if (this.state.error.add_libro_imagen === true) {
                this.setState({
                    ...this.state,
                    error: {
                        ...this.state.error,
                        add_libro_imagen: false
                    }
                });
            }
        };
        */
        if (evt.target.files[0]) {
            this.setState({
                ...this.state,
                datosUsuario: {
                    ...this.state.datosUsuario,
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

    acceptLoggin = (evt) => {
        if(this.state.isARegister){
            this.setState({
                ...this.state,
                isARegister: false,
                showRepeatPass: false
            })
        } else {
            let logName = this.state.userData.userNickEmail.trim();
            let logPass = this.state.userData.userPass;
            this.props.doLogin(logName, logPass, this.props.getAppLanguage());
        }
    }

    acceptRegister = (evt) => {
        if(!this.state.isARegister){
            this.setState({
                ...this.state,
                isARegister: true,
                showRepeatPass: true
            })
        } else {
            let logName = this.state.userData.userNickEmail.trim();
            let logPass = this.state.userData.userPass;
            this.props.doRegister(logName, logPass, this.props.getAppLanguage());
        }
    }

    render = () => {
        return (
            <div>
                <Grid container className="gridLogin">
                    <Grid item sm={8} className="columnaDatosPerfil">
                        <Paper elevation={4} className="divDatosPerfil">
                            <TextField
                                label= {<LS msgId='unique.user'/>}
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
                                label="Tu contraseña"
                                id="userPass"
                                name="userPass"
                                fullWidth
                                type="password"
                                inputProps={{
                                    maxLength: 20,
                                }}
                                value={this.state.passUsuario}
                                onChange={this.oChangeInput.bind(this)}
                                className="inputLoginData"
                            />
                            <br/>
                            {(this.state.mostrarAntiguaPass)? (
                                <div>
                                    <TextField
                                        label="Repite tu contraseña"
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
                                disabled={(this.props.savingUserData !== REST_DEFAULT)}
                            >
                                REGISTER
                            </Button>
                            <Button 
                                variant="flat" 
                                color={(!this.state.isARegister) ? "primary" : "secondary"}
                                onClick={this.acceptLogin.bind(this)}
                                disabled={(this.state.acceptDisabled)}
                            >
                                {(!this.state.isARegister) ? "LOGIN" : "CANCEL REGISTER"}
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
        getAppLanguage: (state) => appState.getAppLanguage()
    }),
    (dispatch) => ({
        fetchUserData: () => dispatch(fetchUserData()),
        doLogin: (logName, logPass) => dispatch(doLogin(logName, logPass)),
        doRegister: (logName, logPass) => dispatch(doRegister(logName, logPass))
    })
)(ProfileView);