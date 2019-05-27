import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUserData } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
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
        showRepeatPass: false
        
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    oChangeInput = (evt) => {
        const value = evt.target.value;
        const name = evt.target.name;

        let callback = () => {};
        if (name === "userPass" && !this.state.showRepeatPass) {
            callback = () => {
                this.setState({
                    ...this.state,
                    showRepeatPass: true
                });
            }
        }
        // ver impletar errores en el alta de libros
        this.setState({
            ...this.state,
            userData: {
                ...this.state.userData,
                [name]: value
            }
        }, callback);
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
        // TODO
    }

    goRegister = (evt) => {
        if(!this.state.isARegister){
            this.setState({
                ...state,
                isARegister: true,
                showRepeatPass: true
            })
        }
    }

    render = () => {
        
        return (
            <div>
                <Grid container className="gridLogin">
                    <Grid item sm={8} className="columnaDatosPerfil">
                        <Paper elevation={4} className="divDatosPerfil">
                            <TextField
                                label="Nick de tu Usuario, es único recuerda"
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
                                label="Nombre de usuario"
                                id="nombreUsuario"
                                name="nombreUsuario"
                                fullWidth
                                inputProps={{
                                    maxLength: 45,
                                }}
                                value={this.state.nombreUsuario}
                                onChange={this.oChangeInput.bind(this)}
                                className="inputLoginData"
                            />
                            <br/>
                            <TextField
                                label="Tus apellidos"
                                id="apellidoUsuario"
                                name="apellidoUsuario"
                                fullWidth
                                inputProps={{
                                    maxLength: 45,
                                }}
                                value={this.state.apellidosUsuario}
                                onChange={this.oChangeInput.bind(this)}
                                className="inputDatosPerfil"
                            />
                            <br/>
                            <TextField
                                label="Tu E-mail"
                                id="emailUsuario"
                                name="emailUsuario"
                                fullWidth
                                inputProps={{
                                    maxLength: 45,
                                }}
                                value={this.state.emailUsuario}
                                onChange={this.oChangeInput.bind(this)}
                                className="inputDatosPerfil"
                            />
                            <br/>
                            <TextField
                                label="Algo sobre tí mismo"
                                id="sobreMiPerfil"
                                name="sobreMiPerfil"
                                multiline
                                rowsMax="4"
                                fullWidth
                                inputProps={{
                                    maxLength: 140,
                                }}
                                value={this.state.sobreMi}
                                onChange={this.oChangeInput.bind(this)}
                                className="inputDatosPerfil"
                            />
                            {(this.state.mostrarAntiguaPass)? (
                                <div>
                                    <TextField
                                        label="Tu antigüa contraseña"
                                        id="viejaPassUsuario"
                                        name="viejaPassUsuario"
                                        fullWidth
                                        type="password"
                                        inputProps={{
                                            maxLength: 20,
                                        }}
                                        value={this.state.viejaPassUsuario}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputDatosPerfil"
                                    />
                                    <br/>
                                </div>
                            ): (<div/>)}
                            <TextField
                                label="Tu contraseña"
                                id="passUsuario"
                                name="passUsuario"
                                fullWidth
                                type="password"
                                inputProps={{
                                    maxLength: 20,
                                }}
                                value={this.state.passUsuario}
                                onChange={this.oChangeInput.bind(this)}
                                className="inputDatosPerfil"
                            />
                            <br/>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container alignItems="flex-end">
                    <Grid item sm={12}>
                        <div className="saveProfileButton">
                            <Button variant="flat" color="secondary" 
                                onClick={this.acceptDeleteProfile.bind(this)}
                                disabled={(this.props.savingUserData !== REST_DEFAULT)}
                            >
                                ELIMINAR MI PERFIL
                            </Button>
                            <Button variant="flat" color="primary" 
                                onClick={this.acceptSaveProfile.bind(this)}
                                disabled={(this.props.savingUserData !== REST_DEFAULT)}
                            >
                                GUARDAR
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
        datosUsuario: appState.getUser(state),
        savingUserData: appState.getsaveUserDataSuccess(state),
    }),
    (dispatch) => ({
        fetchUserData: () => dispatch(fetchUserData())
    })
)(ProfileView);