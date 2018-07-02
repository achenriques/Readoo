import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../../app_state/reducers';
import Grid from '@material-ui/core/Grid';
import Paper from 'material-ui/Paper/Paper';
import TextField from '@material-ui/core/TextField';
import avatarDefault from '../../resources/avatarDefault.svg'

class ProfileView extends Component {

    initialState = {
        datosUsuario: {
            avatar: avatarDefault,
            nick: "",
            contrasena: "",
            email: "",
            nombre: "",
            apellidos: "",
            misCategorias: []
        },
        nickUsuario: "",
        passUsuario: "",
        emailUsuario: "",
        nombreUsuario: "",
        apellidosUsuario: "",
        cargandoPerfil: null
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    oChangeInput = (evt) => {
        const value = evt.target.value;
        const name = evt.target.name;
        // ver impletar errores en el alta de libros
        this.setState({
            ...this.state,
            [name]: value
        });
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
                        <Grid>
                            <Grid item sm={6}>
                                <Paper elevation={4}>
                                    <img src={this.state.datosUsuario.avatar} alt="Imagen de presentación de usuario" />
                                </Paper>
                            </Grid>
                            <Grid item sm={6}>
                                <Paper elevation={4}>
                                    <TextField
                                        name="nickUsuario"
                                        id="nickUsuario"
                                        hintText="Tu nick, único"
                                        fullWidth
                                        maxLength="45"
                                        onChange={this.oChangeInput.bind(this)}
                                    /><br />
                                    <TextField
                                        name="nombreUsuario"
                                        id="nombreUsuario"
                                        hintText="Tu nombre"
                                        fullWidth
                                        maxLength="45"
                                        onChange={this.oChangeInput.bind(this)}
                                    /><br />
                                    <TextField
                                        name="apellidoUsuario"
                                        id="apellidoUsuario"
                                        hintText="Tus apellidos"
                                        fullWidth
                                        maxLength="45"
                                        onChange={this.oChangeInput.bind(this)}
                                    /><br />
                                    <TextField
                                        name="emailUsuario"
                                        id="emailUsuario"
                                        hintText="Tu email"
                                        fullWidth
                                        maxLength="45"
                                        onChange={this.oChangeInput.bind(this)}
                                    /><br />
                                    <TextField
                                        name="passUsuario"
                                        id="passUsuario"
                                        hintText="Tu contraseña"
                                        fullWidth
                                        maxLength="20"
                                        onChange={this.oChangeInput.bind(this)}
                                    /><br />
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