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
        datosUsuario: {
            avatar: avatarDefault,
            nick: "",
            contrasena: "******",
            email: "",
            nombre: "",
            apellidos: "",
            sobreMi: "",
            misCategorias: []
        },
        nickUsuario: "",
        viejaPassUsuario: "",
        passUsuario: "",
        emailUsuario: "",
        nombreUsuario: "",
        apellidosUsuario: "",
        imagenAvatar: "",
        cargandoPerfil: null,
        mostrarAntiguaPass: false
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
        // TODO 
        this.props.fetchUserData(1);
    };

    oChangeInput = (evt) => {
        const value = evt.target.value;
        const name = evt.target.name;

        let callback = () => {};
        if (name === "passUsuario" && !this.state.mostrarAntiguaPass) {
            callback = () => {
                this.setState({
                    ...this.state,
                    mostrarAntiguaPass: true
                });
            }
        }
        // ver impletar errores en el alta de libros
        this.setState({
            ...this.state,
            [name]: value
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

    acceptSaveProfile = (evt) => {
        // TODO
    }

    acceptDeleteProfile = (evt) => {
        // TODO
    }

    render = () => {
        switch (this.state.cargandoPerfil) {
            case -1:
                return (
                    <div className="cargandoComentarios">
                        <h3>Error en la carga de los datos de usuario. Puede ser un problema de red o fallo del servidor...</h3>
                    </div>
                )
            case 0:
                return (
                    <div className="cargandoComentarios">
                        <h3>Cargando...</h3>
                    </div>
                )
        
            default:
                return (
                    <div>
                        <Grid container className="gridPerfil">
                            <Grid item sm={4} className="columnaAvatarPerfil">
                                    <div style={{ position: "relative"}}>
                                        <Paper elevation={4} className="divAvatarPerfil">
                                            <img src={this.state.datosUsuario.avatar} alt="Imagen de presentación de usuario" className="imgAvatarPerfil"/>
                                        </Paper>
                                    </div>
                                    <div className="divBotonSubirAvatar">
                                        <input
                                            accept="image/*"
                                            style={DISPLAY_NONE}
                                            id="botonSubirAvatar"
                                            multiple
                                            type="file"
                                            onChange={this.loadAvatarImage.bind(this)} 
                                        />
                                        <label htmlFor="botonSubirAvatar">
                                            <Button variant="outlined" component="span" className="subirAvatarPerfil" fullWidth>
                                                AÑADE UNA IMAGEN DE PORTADA
                                            </Button>
                                        </label>
                                    </div>
                            </Grid>
                            <Grid item sm={8} className="columnaDatosPerfil">
                                <Paper elevation={4} className="divDatosPerfil">
                                    <TextField
                                        label="Nick de tu Usuario, es único recuerda"
                                        id="nickUsuario"
                                        name="nickUsuario"
                                        fullWidth
                                        inputProps={{
                                            maxLength: 45,
                                        }}
                                        value={this.state.nickUsuario}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputDatosPerfil"
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
                                        className="inputDatosPerfil"
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