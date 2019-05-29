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
        userData: {
            userAvatar: avatarDefault,
            userNick: "",
            userPass: "******",
            userEmail: "",
            userName: "",
            userSurname: "",
            userAboutMe: "",
            myGenres: []
        },
        userNick: "",
        oldUserPass: "",
        userPass: "",
        userEmail: "",
        userName: "",
        userSurname: "",
        avatarImage: "",
        loadingProfile: null,
        showOldPass: false
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
        // TODO 
        this.props.fetchUserData();
    };

    oChangeInput = (evt) => {
        const value = evt.target.value;
        const name = evt.target.name;

        let callback = () => {};
        if (name === "userPass" && !this.state.showOldPass) {
            callback = () => {
                this.setState({
                    ...this.state,
                    showOldPass: true
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
                    userAvatar: (URL.createObjectURL(evt.target.files[0])) ? URL.createObjectURL(evt.target.files[0]) : null,
                },
                avatarImage: evt.target.files[0] ? evt.target.files[0] : avatarDefault
            }, /*callState*/);
        } else {
            this.setState({
                avatarImage: avatarDefault
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
        switch (this.state.loadingProfile) {
            case -1:
                return (
                    <div className="loadingCommentaries">
                        <h3>Error en la carga de los datos de usuario. Puede ser un problema de red o fallo del servidor...</h3>
                    </div>
                )
            case 0:
                return (
                    <div className="loadingCommentaries">
                        <h3>Cargando...</h3>
                    </div>
                )
        
            default:
                return (
                    <div>
                        <Grid container className="profileGrid">
                            <Grid item sm={4} className="profileAvatarColumn">
                                    <div style={{ position: "relative"}}>
                                        <Paper elevation={4} className="divProfileAvatar">
                                            <img src={this.state.userData.userAvatar} alt="Imagen de presentación de usuario" className="profileAvatarImage"/>
                                        </Paper>
                                    </div>
                                    <div className="divUploadAvatarButton">
                                        <input
                                            accept="image/*"
                                            style={DISPLAY_NONE}
                                            id="uploadAvatarButton"
                                            multiple
                                            type="file"
                                            onChange={this.loadAvatarImage.bind(this)} 
                                        />
                                        <label htmlFor="uploadAvatarButton">
                                            <Button variant="outlined" component="span" className="uploadProfileAvatar" fullWidth>
                                                AÑADE UNA IMAGEN DE PORTADA
                                            </Button>
                                        </label>
                                    </div>
                            </Grid>
                            <Grid item sm={8} className="columnaDatosPerfil">
                                <Paper elevation={4} className="divDatosPerfil">
                                    <TextField
                                        label="Nick de tu Usuario, es único recuerda"
                                        id="userNick"
                                        name="userNick"
                                        fullWidth
                                        inputProps={{
                                            maxLength: 45,
                                        }}
                                        value={this.state.userNick}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputProfileData"
                                    />
                                    <br/>
                                    <TextField
                                        label="Nombre de usuario"
                                        id="userName"
                                        name="userName"
                                        fullWidth
                                        inputProps={{
                                            maxLength: 45,
                                        }}
                                        value={this.state.userName}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputProfileData"
                                    />
                                    <br/>
                                    <TextField
                                        label="Tus apellidos"
                                        id="userSurname"
                                        name="userSurname"
                                        fullWidth
                                        inputProps={{
                                            maxLength: 45,
                                        }}
                                        value={this.state.userSurname}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputProfileData"
                                    />
                                    <br/>
                                    <TextField
                                        label="Tu E-mail"
                                        id="userEmail"
                                        name="userEmail"
                                        fullWidth
                                        inputProps={{
                                            maxLength: 45,
                                        }}
                                        value={this.state.userEmail}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputProfileData"
                                    />
                                    <br/>
                                    <TextField
                                        label="Algo sobre tí mismo"
                                        id="userAboutMe"
                                        name="userAboutMe"
                                        multiline
                                        rowsMax="4"
                                        fullWidth
                                        inputProps={{
                                            maxLength: 140,
                                        }}
                                        value={this.state.userAboutMe}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputProfileData"
                                    />
                                    {(this.state.showOldPass)? (
                                        <div>
                                            <TextField
                                                label="Tu antigüa contraseña"
                                                id="oldUserPass"
                                                name="oldUserPass"
                                                fullWidth
                                                type="password"
                                                inputProps={{
                                                    maxLength: 20,
                                                }}
                                                value={this.state.oldUserPass}
                                                onChange={this.oChangeInput.bind(this)}
                                                className="inputProfileData"
                                            />
                                            <br/>
                                        </div>
                                    ): (<div/>)}
                                    <TextField
                                        label="Tu contraseña"
                                        id="userPass"
                                        name="userPass"
                                        fullWidth
                                        type="password"
                                        inputProps={{
                                            maxLength: 20,
                                        }}
                                        value={this.state.userPass}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputProfileData"
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
        userData: appState.getUser(state),
    }),
    (dispatch) => ({
        fetchUserData: () => dispatch(fetchUserData())
    })
)(ProfileView);