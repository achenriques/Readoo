import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../../app_state/reducers';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import avatarDefault from '../../resources/avatarDefault.svg';
import { DISPLAY_NONE } from '../../constants/appConstants';

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

    cargarImagenAvatar = (evt) => {
        /*
        FIXME
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
                    avatar: (URL.createObjectURL(evt.target.files[0])) ? URL.createObjectURL(evt.target.files[0]) : avatarDefault,
                },
                imagenAvatar: evt.target.files[0] ? evt.target.files[0] : null
            }, /*callState*/);
        }
    }

    render() {
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
                            <Grid item sm={4} alignContent="center" alignItems="center" className="columnaAvatarPerfil">
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
                                        />
                                        <label htmlFor="botonSubirAvatar">
                                            <Button variant="contained" component="span" className="subirAvatarPerfil" fullWidth>
                                                AÑADE UNA IMAGEN DE PORTADA
                                            </Button>
                                        </label>
                                    </div>
                            </Grid>
                            <Grid item sm={8} className="columnaDatosPerfil" alignContent="center" alignItems="center">
                                <Paper elevation={4} className="divDatosPerfil">
                                    <TextField
                                        label="Nick de tu Usuario, es único recuerda"
                                        id="nickUsuario"
                                        name="nickUsuario"
                                        fullWidth
                                        maxLength="45"
                                        value={this.state.datosUsuario.nick}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputDatosPerfil"
                                    />
                                    <br/>
                                    <TextField
                                        label="Nombre de usuario"
                                        id="nombreUsuario"
                                        name="nombreUsuario"
                                        fullWidth
                                        maxLength="45"
                                        value={this.state.datosUsuario.nombre}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputDatosPerfil"
                                    />
                                    <br/>
                                    <TextField
                                        label="Tus apellidos"
                                        id="apellidoUsuario"
                                        name="apellidoUsuario"
                                        fullWidth
                                        maxLength="45"
                                        value={this.state.datosUsuario.apellidos}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputDatosPerfil"
                                    />
                                    <br/>
                                    <TextField
                                        label="Tu E-mail"
                                        id="emailUsuario"
                                        name="emailUsuario"
                                        fullWidth
                                        maxLength="45"
                                        value={this.state.datosUsuario.email}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputDatosPerfil"
                                    />
                                    <br/>
                                    {(this.state.mostrarAntiguaPass)? (
                                        <div>
                                            <TextField
                                                label="Tu antigüa contraseña"
                                                id="viejaPassUsuario"
                                                name="viejaPassUsuario"
                                                fullWidth
                                                type="password"
                                                maxLength="20"
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
                                        maxLength="20"
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputDatosPerfil"
                                    />
                                    <br/>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                )
        }
    }
}

export default connect(
    (state) => ({
        
    }),
    (dispatch) => ({

    })
)(ProfileView);