import React, { Component } from 'react';
import { connect } from 'react-redux';
import RootRef from '@material-ui/core/RootRef';
import { fetchUserData, checkEmailIsUnique, setEmailIsUniqueFalse, saveUserData } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Popper from '@material-ui/core/Popper';
import Help from 'material-ui/svg-icons/action/help';
import LS from '../LanguageSelector';
import avatarDefault from '../../resources/avatarDefault.svg';
import { DISPLAY_NONE, REST_FAILURE, REST_DEFAULT } from '../../constants/appConstants';

const iconHelp = <Help/>;

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
            userKarma: 0,
            myGenres: []
        },
        userNick: "",
        oldUserPass: "",
        userPass: "",
        userEmail: "",
        userName: "",
        userSurname: "",
        userAboutMe: "",
        userKarma: 0,
        avatarImage: avatarDefault,
        loadingProfile: 0,
        showOldPass: false,
        emailError: false,
        acceptDisabled: false,
        noChanges: false,
        helpKarmaOpen: false,
        alreadyLoadedTab: false
    };

    constructor(props) {
        super(props);
        this.helpIconRef = null;
        this.profileDataGridRef = React.createRef();
        this.profileDataGridHeight = 0;
        this.profileDataGridWidth = 0;
        this.state = { ...this.initialState };
        // TODO 
        this.props.fetchUserData(this.props.userId);
    };

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if(!prevState.alreadyLoadedTab && nextProps.userData != null && nextProps.userData.userId) {
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
                userAboutMe: (nextProps.userData.userAboutMe != null) ? nextProps.userData.userAboutMe : "",
                userKarma: +nextProps.userData.userKarma,
                alreadyLoadedTab: true
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
                }, 10000);
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
        // Hide old pass field
        if (name === "userPass" && !this.state.showOldPass) {
            callback = () => {
                this.setState({
                    ...this.state,
                    showOldPass: true
                });
            }
        }

        // Close help karma
        if ((name === "userName" || name === "userSurname") && this.state.helpKarmaOpen) {
            callback = () => {
                this.setState({
                    ...this.state,
                    helpKarmaOpen: false
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

        // Sets the user Id in the object sent to back
        newUserData.userId = this.props.userId;

        if (newUserData.userAvatar || newUserData.userNick || newUserData.userPass || newUserData.userEmail || newUserData.userName ||
                newUserData.userSurname || newUserData.userAboutMe) {
            let dataToSend = newUserData;
            if (newUserData.userPass !== null && newUserData.userPass.length) {
                dataToSend.oldUserPass = this.state.oldUserPass;
            }
            // Size of PAPER DomElement from user data settings.
            // This info is used to overload a new paper over the old one with the same dimensions.
            this.profileDataGridTop = this.profileDataGridRef.current.getBoundingClientRect().top;
            this.profileDataGridLeft = this.profileDataGridRef.current.getBoundingClientRect().left;
            this.profileDataGridHeight = this.profileDataGridRef.current.getBoundingClientRect().height;
            this.profileDataGridWidth = this.profileDataGridRef.current.getBoundingClientRect().width;

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

    showKarmaHelp = (evt) => {
        if (this.helpIconRef === null) {
            this.helpIconRef = evt.currentTarget;
        }
        this.setState({
            ...this.state,
            helpKarmaOpen: !this.state.helpKarmaOpen
        });
    }

    render = () => {
        let noAvaliableEmail = (this.state.isARegister && this.state.userData.userEmail.trim().length > 0 
                && this.props.avaliableEmail === false);

        switch (this.state.loadingProfile) {
            case -1:
                return (
                    <div className="loadingCommentaries">
                        <h3><LS msgId='timeout.error' defaultMsg='Add image'/></h3>
                    </div>
                )
            case 0:
                return (
                    <div className="loadingCommentaries">
                        <h3><LS msgId='loading' defaultMsg='Loading...'/></h3>
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
                            <Grid item sm={8} className="perfilDataColumn">
                                <Paper elevation={16}
                                    style={(this.state.acceptDisabled) 
                                            ? { position: 'absolute', 
                                                zIndex: 10, 
                                                textAlign: 'center', 
                                                height: this.profileDataGridHeight, 
                                                width: this.profileDataGridWidth,
                                                marginLeft: '50px',
                                                marginRight: '90px'
                                              } 
                                            : DISPLAY_NONE}>
                                    <h3 className="marginAuto"><LS msgId='loading' defaultMsg='Loading...'/></h3>
                                </Paper>
                                <RootRef rootRef={this.profileDataGridRef}>
                                    <Paper elevation={4} className="divDatosPerfil">
                                        <Grid container>
                                            <Grid item sm={6} className='profileNickColumn'>
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
                                                    className="inputProfileData"
                                                />
                                            </Grid>
                                            <Grid item sm={5} className='profileKarmaColumn'>
                                                <TextField
                                                    label={<LS msgId='karma' defaultMsg='Karma'/>}
                                                    id="userKarma"
                                                    name="userKarma"
                                                    fullWidth
                                                    disabled
                                                    value={this.state.userKarma}
                                                    className="inputProfileData"
                                                />
                                            </Grid>
                                            <Grid item sm={1} className='profileKarmaIconColumn'>
                                                <div>
                                                    <IconButton ref={this.helpIconRef} onClick={this.showKarmaHelp.bind(this)}>
                                                        {iconHelp}
                                                    </IconButton>
                                                    <Popper id="helpIconPooper" anchorEl={this.helpIconRef} open={this.state.helpKarmaOpen}>
                                                        <Paper className="helpKarma">
                                                            <LS msgId='what.is.karma' defaultMsg='Karma?'/>
                                                        </Paper>
                                                    </Popper>
                                                </div>
                                            </Grid>
                                        </Grid>
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
                                </RootRef>
                            </Grid>
                        </Grid>
                        <Grid container alignItems="flex-end">
                            <Grid item sm={12}>
                                {(this.state.noChanges) ? (<div className="redInfo"><LS msgId='no.changes' defaultMsg='No changes to save'/></div>) : (<div/>)}
                                <div className="saveProfileButton">
                                    <Button variant="flat" color="secondary" 
                                        onClick={this.acceptDeleteProfile.bind(this)}
                                        disabled={this.state.acceptDisabled}
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
        loadingStatus: appState.getLoadingStatus(state),
        userDataLastRequestStatus: appState.getUserDataReqCode(state)   // Return the las request status Code (0 dont search again user data, 1 search again)
    }),
    (dispatch) => ({
        fetchUserData: (userId) => dispatch(fetchUserData(userId)),
        setEmailIsUniqueFalse: () => dispatch(setEmailIsUniqueFalse()),
        checkEmailIsUnique: (email) => dispatch(checkEmailIsUnique(email)),
        saveUserData: (userData) => dispatch(saveUserData(userData))
    })
)(ProfileView);