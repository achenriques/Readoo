import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUserData, checkEmailIsUnique, setEmailIsUniqueFalse, saveUserData } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LS from '../LanguageSelector';
import avatarDefault from '../../resources/avatarDefault.svg';
import { DISPLAY_NONE, REST_FAILURE, REST_DEFAULT } from '../../constants/appConstants';

class ProfileView extends Component {

    initialState = {
        userData: {
            userAvatarUrl: "",
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
        userAboutMe: "",
        avatarImage: avatarDefault,
        loadingProfile: 0,
        showOldPass: false,
        emailError: false,
        acceptDisabled: false,
        noChanges: false
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
        // TODO 
        this.props.fetchUserData(this.props.userId);
    };

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if(nextProps.userData != null && nextProps.userData.userId) {
            return {
                ...prevState,
                loadingProfile: null,
                userData: nextProps.userData,
                avatarImage: (nextProps.userData.userAvatarUrl != null) ? nextProps.userData.userAvatarUrl : avatarDefault,
                userNick: nextProps.userData.userNick,
                userPass: "******",
                userEmail: nextProps.userData.userEmail,
                userName: (nextProps.userData.userName != null) ? nextProps.userData.userName : "",
                userSurname: (nextProps.userData.userSurname != null) ? nextProps.userData.userSurname : "",
                userAboutMe: (nextProps.userData.userAboutMe != null) ? nextProps.userData.userAboutMe : ""
            }
        }
        if (nextProps.loadingStatus === 0) {
            if (prevState.loadingProfile === 0) {
                setTimeout(function() {
                    //your code to be executed after 3 second
                    if (prevState.userData.userNick === "") {
                        return {
                            ...prevState,
                            loadingProfile: -1
                        }
                    }
                }, 3000);
            }
        }
        return null;
    }

    checkEmail = (val) => {
        let toRet = /.*@[A-z]{1,15}\.[a-z]{2,3}$/.test(val);
        if (toRet) {
            // If is a register we should prove that the nick does not exists yet
            this.props.checkEmailIsUnique(val.trim());
        } else {
            if (this.props.avaliableEmail === false && this.state.userEmail !== val) {
                this.props.setEmailIsUniqueFalse();
            }
        }
        return toRet;
    }

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

        let emailError = this.state.emailError;
        if (name === "userEmail") {
            emailError = !this.checkEmail(value);
        }

        // ver impletar errores en el alta de libros
        this.setState({
            ...this.state,
            [name]: value,
            noChanges: false
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
        let newUserData = {
            userAvatarUrl: (this.state.avatarImage !== "" && this.state.avatarImage !== avatarDefault) ? this.state.userAvatar : null,
            userNick: (this.state.userNick !== this.state.userData.userNick) ? this.state.userNick : null,
            userPass: (this.state.userPass !== "" && this.state.userPass !== "******"  && this.state.userPass !== this.state.userData.userPass) ? this.state.userPass : null,
            userEmail:(this.state.userEmail !== "" && this.state.userEmail !== this.state.userData.userEmail) ? this.state.userEmail : null,
            userName: (this.state.userName !== "" && this.state.userName !== this.state.userData.userName) ? this.state.userName : null,
            userSurname: (this.state.userSurname != "" && this.state.userSurname !== this.state.userData.userSurname) ? this.state.userSurname : null,
            userAboutMe: (this.state.userAboutMe !== this.state.userData.userAboutMe) ? this.state.userAboutMe : null
        }

        if (newUserData.userAvatar || newUserData.userNick || newUserData.userPass || newUserData.userEmail || newUserData.userName ||
                newUserData.userSurname || newUserData.userAboutMe) {
            let dataToSend = newUserData;
            if (newUserData.userPass !== null && newUserData.userPass.length) {
                dataToSend.oldUserPass = this.state.oldUserPass;
            }
            this.setState({
                ...this.state,
                acceptDisabled: true
            })
            this.props.saveUserData(dataToSend);
        } else {
            this.setState({
                ...this.state,
                noChanges: true
            })
        }
    }

    acceptDeleteProfile = (evt) => {
        // TODO
    }

    render = () => {
        let noAvaliableEmail = (this.state.isARegister && this.state.userData.userEmail.trim().length > 0 
                && this.props.avaliableEmail === false);

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
                                            <img src={this.state.avatarImage} alt="TODO  : 'user.image.avatar' " className="profileAvatarImage"/>
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
                                                <LS msgId='add.portrait.image' defaultMsg='Add image'/>
                                            </Button>
                                        </label>
                                    </div>
                            </Grid>
                            <Grid item sm={8} className="columnaDatosPerfil">
                                <Paper elevation={4} className="divDatosPerfil">
                                    <TextField
                                        label={<LS msgId='nick.user' defaultMsg='Nick'/>}
                                        id="userNick"
                                        name="userNick"
                                        fullWidth
                                        inputProps={{
                                            maxLength: 45,
                                        }}
                                        disabled
                                        value={this.state.userNick}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="inputProfileData"
                                    />
                                    <br/>
                                    <TextField
                                        error={this.state.userName.length === 0}
                                        label={<LS msgId='your.name' defaultMsg='Name'/>}
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
                                        error={this.state.userSurname.length === 0}
                                        label={<LS msgId='your.surname' defaultMsg='Surname'/>}
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
                                        error={this.state.emailError || noAvaliableEmail}
                                        label={(!this.state.emailError && !noAvaliableEmail) ? (<LS msgId='your.email'/>) : (!noAvaliableEmail) 
                                                ? (<LS msgId='isnot.email'/>) : (<LS msgId='email.user.exists'/>)}
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
                                        label={<LS msgId='about.you' params={(this.state.userAboutMe != null) ? [140 - this.state.userAboutMe.length] : [140]}/>}
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
                                                error={this.state.oldUserPass.length === 0}
                                                label={<LS msgId='old.pass' defaultMsg="Current pass"/>}
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
                                        error={this.state.userPass.length === 0}
                                        label={<LS msgId='your.pass' defaultMsg='Password'/>}
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
                                {(this.state.noChanges) ? (<div className="redInfo"><LS msgId='no.changes' defaultMsg='No changes to save'/></div>) : (<div/>)}
                                <div className="saveProfileButton">
                                    <Button variant="flat" color="secondary" 
                                        onClick={this.acceptDeleteProfile.bind(this)}
                                        disabled
                                    >
                                        <LS msgId='delete.profile' defaultMsg='Delete profile!'/>
                                    </Button>
                                    <Button variant="flat" color="primary" 
                                        onClick={this.acceptSaveProfile.bind(this)}
                                        disabled={this.state.acceptDisabled}
                                    >
                                        <LS msgId='save' defaultMsg='Save'/>
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
        userId: appState.getUserId(state),
        userData: appState.getUser(state),
        avaliableEmail: appState.getAvaliableEmail(state),
        loadingStatus: appState.getLoadingStatus(state)
    }),
    (dispatch) => ({
        fetchUserData: (userId) => dispatch(fetchUserData(userId)),
        setEmailIsUniqueFalse: () => dispatch(setEmailIsUniqueFalse()),
        checkEmailIsUnique: (email) => dispatch(checkEmailIsUnique(email)),
        saveUserData: (userData) => dispatch(saveUserData(userData))
    })
)(ProfileView);