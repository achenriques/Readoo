import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionTypes, fetchUserData, checkEmailIsUnique, setEmailIsUniqueFalse, 
    saveUserData, dissableUser, resetProccess, doLogOut } from '../../app_state/actions';
import * as appState from '../../app_state/reducers/index';
import RootRef from '@material-ui/core/RootRef';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Popper from '@material-ui/core/Popper';
import Help from '@material-ui/icons/Help';
import LS from '../LanguageSelector';
import GenreSelector from '../common/GenreSelector';
import ContinueModal from '../common/ContinueModal';
import avatarDefault from '../../resources/avatarDefault.svg';
import { DISPLAY_NONE, REST_FAILURE, REST_DEFAULT, REST_SUCCESS } from '../../constants/appConstants';
import { getProccessStatus, excedsLimit } from '../../utils/appUtils';

const iconHelp = <Help/>;

const LOADING_PROFILE = 0;
const RUNNING_PROFILE = 1;
const ERROR_PROFILE = -1;

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
            userGenres: []
        },
        userNick: "",
        oldUserPass: "",
        userPass: "",
        userEmail: "",
        userName: "",
        userSurname: "",
        userAboutMe: "",
        userKarma: 0,
        userGenres: [],
        avatarImage: avatarDefault,
        avatarImageFile: null,
        loadingProfile: LOADING_PROFILE,
        showOldPass: false,
        emailError: false,
        avatarError: '',
        acceptDisabled: false,
        acceptDisabledText: 'loading',
        noChanges: false,
        helpKarmaOpen: false,
        alreadyLoadedTab: false,
        openContinueDeleteProfile: false,
        genresColected: false,
        isPreview: false,
        previewUser: null
    };

    constructor(props) {
        super(props);
        this.helpIconRef = React.createRef();
        this.profileDataGridRef = React.createRef();
        this.profileDataGridHeight = 0;
        this.profileDataGridWidth = 0;
        this.state = { 
            ...this.initialState, 
            isPreview: props.previewUser !== null,
            previewUser: props.previewUser
        };
    };

    componentDidMount = () => {
        if (!this.state.isPreview) {
            this.props.fetchUserData(this.props.userId, false);
        } else {
            this.props.fetchUserData(this.props.previewUser, true);
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(this.state.loadingProfile === LOADING_PROFILE && !this.state.alreadyLoadedTab && !this.isLoadingUserData(this.state.isPreview)) {
            let errorState = {
                ...this.state,
                loadingProfile: ERROR_PROFILE,
            };
            if (!this.state.isPreview) {
                if (this.props.userData != null) {
                    this.setState({
                        ...this.state,
                        loadingProfile: RUNNING_PROFILE,
                        userData: this.props.userData,
                        avatarImage: (this.props.userData.userAvatarUrl != null) ?  this.props.userData.userAvatarUrl.trim() : avatarDefault,
                        userNick: this.props.userData.userNick,
                        userPass: "******",
                        userEmail: this.props.userData.userEmail,
                        userName: (this.props.userData.userName != null) ? this.props.userData.userName : "",
                        userSurname: (this.props.userData.userSurname != null) ? this.props.userData.userSurname : "",
                        userAboutMe: (this.props.userData.userAboutMe != null) ? this.props.userData.userAboutMe : "",
                        userKarma: +this.props.userData.userKarma,
                        userGenres: (this.props.userData.userGenres != null) ? this.props.userData.userGenres : [],
                        alreadyLoadedTab: true,
                        helpKarmaOpen: false
                    });
                } else {
                    this.setState(errorState);
                }
            } else {
                if (this.props.userPreviewData != null) {
                    this.setState({
                        ...this.state,
                        loadingProfile: RUNNING_PROFILE,
                        userData: this.props.userPreviewData,
                        avatarImage: (this.props.userPreviewData.userAvatarUrl != null) ?  this.props.userPreviewData.userAvatarUrl.trim() : avatarDefault,
                        userNick: this.props.userPreviewData.userNick,
                        userAboutMe: (this.props.userPreviewData.userAboutMe != null) ? this.props.userPreviewData.userAboutMe : "",
                        userKarma: +this.props.userPreviewData.userKarma,
                        userGenres: (this.props.userPreviewData.userGenres != null) ? this.props.userPreviewData.userGenres : [],
                        alreadyLoadedTab: true,
                        helpKarmaOpen: false
                    });
                } else {
                    this.setState(errorState);
                }
            }
        }

        if (this.state.acceptDisabled && this.state.acceptDisabledText === 'loading' && this.props.failedProcesses && this.props.succeedProcesses && this.props.loadingProcesses) {
            let statusOfSaveUser = getProccessStatus(actionTypes.SAVE_USER_DATA, this.props.loadingProcesses, this.props.failedProcesses, this.props.succeedProcesses, () => { this.props.resetProccessStatus(actionTypes.SAVE_USER_DATA)});
            
            // Return to normal status of running
            let callbackDefault = () => { 
                setTimeout(() => {
                    this.setState({
                        ...this.state,
                        acceptDisabledText: 'loading',
                        acceptDisabled: false
                    })
                }, 3000); // Hide message after 3 seconds
            }

            switch (statusOfSaveUser) {
                case REST_SUCCESS:
                    this.setState({
                        ...this.state,
                        loadingProfile: RUNNING_PROFILE,
                        acceptDisabledText: 'saved.successfully',
                        userPass: "******",
                        showOldPass: false
                    }, /*CALLBACK*/ callbackDefault);
                    break;

                case REST_FAILURE:
                    this.setState({
                        ...this.state,
                        loadingProfile: RUNNING_PROFILE,
                        acceptDisabledText: 'failed.save'
                    }, /*CALLBACK*/ callbackDefault);
                    break;
           
                default:
                    break;
            }
            let statusOfDeleteUser = getProccessStatus(actionTypes.DELETE_USER, this.props.loadingProcesses, this.props.failedProcesses, this.props.succeedProcesses, () => { this.props.resetProccessStatus(actionTypes.SAVE_USER_DATA)});
            switch (statusOfDeleteUser) {
                case REST_SUCCESS:
                    let callbackSuccessDeleteUser = () => {
                        setTimeout(() => {
                            this.props.doLogOut();
                        }, 3000); // Hide message after 3 seconds
                    };

                    this.setState({
                        ...this.state,
                        loadingProfile: RUNNING_PROFILE,
                        acceptDisabledText: 'saved.successfully'
                    }, /*CALLBACK*/ callbackDefault);
                    break;

                case REST_FAILURE:
                    this.setState({
                        ...this.state,
                        loadingProfile: RUNNING_PROFILE,
                        acceptDisabledText: 'failed.save'
                    }, /*CALLBACK*/ callbackDefault);
                    break;
           
                default:
                    break;
            }
        }
        return;
    }

    isLoadingUserData = (isPreveiw) => {
        if (isPreveiw) {
            return this.props.loadingProcesses.includes(actionTypes.FETCH_USER_PREVIEW_DATA);
        } else {
            return this.props.loadingProcesses.includes(actionTypes.FETCH_USER_DATA);
        }
    }

    checkEmail = (val) => {
        let toRet = /.*@[A-z]{1,15}\.[a-z]{2,3}$/.test(val);
        if (toRet) {
            // If is a register we should prove that the nick does not exists yet
            if (val.trim() !== this.props.userData.userEmail) {
                this.props.checkEmailIsUnique(val.trim());
            }
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

        let showOldPass = this.state.showOldPass;
        let callback = () => {};
        // Hide old pass field
        if (name === "userPass" && !showOldPass) {
            showOldPass = true;
        }

        let helpKarmaOpen = this.state.helpKarmaOpen;
        // Close help karma
        if ((name === "userName" || name === "userSurname") && helpKarmaOpen) {
            helpKarmaOpen = false;
        }

        let emailError = this.state.emailError;
        if (name === "userEmail") {
            emailError = !this.checkEmail(value);
        }

        this.setState({
            ...this.state,
            [name]: value,
            noChanges: false,
            showOldPass: showOldPass,
            helpKarmaOpen: helpKarmaOpen,
            emailError: emailError
        }, callback);
    }

    loadAvatarImage = (evt) => {
        if (evt.target.files && evt.target.files[0]) {
            if (!excedsLimit(evt.target.files[0])) {
                this.setState({
                    ...this.state,
                    avatarImageFile: evt.target.files[0],
                    avatarImage: (URL.createObjectURL(evt.target.files[0])) ? URL.createObjectURL(evt.target.files[0]) : "",
                    avatarError: false
                });
            } else {
                this.setState({
                    ...this.state,
                    avatarError: true
                });
            }            
        } else {
            this.setState({
                avatarImageFile: null,
                avatarImage: avatarDefault
            });
        }
    }

    acceptSaveProfile = (evt) => {
        // Functions that returns if the genres has changed...
        const checkGenresDiff = () => {
            if (this.state.userGenres.length === this.state.userData.userGenres.length
                    && this.state.userGenres.filter(x => !this.state.userData.userGenres.includes(x)).length === 0) {
                return false;
            } else {
                return true;
            }
        }

        let newUserData = {
            userAvatarUrl: (this.state.avatarImageFile !== null) ? this.state.avatarImageFile : null,
            userNick: (this.state.userNick !== this.state.userData.userNick) ? this.state.userNick : null,
            userPass: (this.state.userPass !== "" && this.state.userPass !== "******"  && this.state.userPass !== this.state.userData.userPass) ? this.state.userPass : null,
            userEmail:(this.state.userEmail !== "" && this.state.userEmail !== this.state.userData.userEmail) ? this.state.userEmail : null,
            userName: (this.state.userName !== "" && this.state.userName !== this.state.userData.userName) ? this.state.userName : null,
            userSurname: (this.state.userSurname != "" && this.state.userSurname !== this.state.userData.userSurname) ? this.state.userSurname : null,
            userAboutMe: (this.state.userAboutMe !== this.state.userData.userAboutMe) ? this.state.userAboutMe : null
        }
        
        // Sets the user Id in the object sent to back
        newUserData.userId = this.props.userId;
        let genresHasChange = checkGenresDiff();
        if (newUserData.userAvatarUrl || newUserData.userNick || newUserData.userPass || newUserData.userEmail || newUserData.userName ||
                newUserData.userSurname || newUserData.userAboutMe || genresHasChange) {
            if (newUserData.userPass !== null && newUserData.userPass.length) {
                newUserData.oldUserPass = this.state.oldUserPass;
            } else {
                newUserData.oldUserPass = null;
            }
            // Size of PAPER DomElement from user data settings.
            // This info is used to overload a new paper over the old one with the same dimensions.
            this.profileDataGridHeight = this.profileDataGridRef.current.getBoundingClientRect().height;
            this.profileDataGridWidth = this.profileDataGridRef.current.getBoundingClientRect().width;

            let dataToSend = new FormData();
            dataToSend.set('userId', newUserData.userId);
            (newUserData.userAvatarUrl !== null) && dataToSend.set('userAvatarUrl', newUserData.userAvatarUrl);
            (newUserData.userNick !== null) && dataToSend.set('userNick', newUserData.userNick);
            (newUserData.userPass !== null) && dataToSend.set('userPass', newUserData.userPass);
            (newUserData.userEmail !== null) && dataToSend.set('userEmail', newUserData.userEmail);
            (newUserData.userName !== null) && dataToSend.set('userName', newUserData.userName);
            (newUserData.userSurname !== null) && dataToSend.set('userSurname', newUserData.userSurname);
            (newUserData.userAboutMe !== null) && dataToSend.set('userAboutMe', newUserData.userAboutMe);
            (newUserData.oldUserPass !== null) && dataToSend.set('oldUserPass', newUserData.oldUserPass);
            if (genresHasChange) {
                newUserData.userGenres = this.state.userGenres;
                dataToSend.set('userGenres', JSON.stringify(this.state.userGenres));
            }
            this.setState({
                ...this.state,
                acceptDisabled: true
            }, () => { this.props.saveUserData(newUserData, {form: dataToSend}); })
        } else {
            this.setState({
                ...this.state,
                noChanges: true
            })
        }
    }

    openDeleteProfile = (evt) => {
        this.setState({
            openContinueDeleteProfile: true
        });
        
    }

    acceptDeleteProfile = (selectedOption) => {
        if (selectedOption) {
            if (this.props.userId !== null) {
                this.setState({
                    ...this.state,
                    acceptDisabled: true
                }, () => { this.props.deleteUser(this.props.userId); });            
            } else {
                this.props.showErrorLog(LS.getStringMsg('user.id.not.provided', 'No userId found, please reload and try again.'));
            }
        }
        this.setState({
            openContinueDeleteProfile: false
        });
    }

    showKarmaHelp = (evt) => {
        this.helpIconRef = evt.currentTarget;
        this.setState({
            ...this.state,
            helpKarmaOpen: !this.state.helpKarmaOpen
        });
    }

    onChangeGenre = (selected) => {
        if (selected) {
            this.setState({
                ...this.state,
                userGenres: selected.map((genre) => genre.genreId)
            })
        }
    }

    render = () => {
        let noAvaliableEmail = (this.state.emailError || this.props.avaliableEmail === false);
        
        let noAvaliableSafe = this.state.acceptDisabled || noAvaliableEmail
                || !this.state.userPass.length || (this.state.showOldPass && this.state.oldUserPass.length === 0);

        switch (this.state.loadingProfile) {
            case ERROR_PROFILE:
                return (
                    <div className="loadingNewTab">
                        <h3><LS msgId='timeout.error' defaultMsg='An error has ocurred...'/></h3>
                    </div>
                )
            case LOADING_PROFILE:
                return (
                    <div className="loadingNewTab">
                        <h3><LS msgId='loading' defaultMsg='Loading...'/></h3>
                    </div>
                )
        
            default:
                return (
                    <div>
                        <Grid container className={(!this.state.isPreview) ? "profileGrid" : ""}>
                            <Grid item sm={4} className="profileAvatarColumn">
                                <div style={{ position: "relative"}}>
                                    <Paper elevation={4} className="divProfileAvatar">
                                        <img 
                                            src={this.state.avatarImage} 
                                            crossOrigin='http://localhost:3030' 
                                            alt={(this.state.avatarImage === null && this.state.avatarImageFile !== null) 
                                                    ? ( <LS msgId='no.image.preview' defaultMsg='Preview not avaliable.'/> ) 
                                                    : "" } className="profileAvatarImage"
                                        />
                                    </Paper>
                                </div>
                                {(!this.state.isPreview)
                                    ?   <div className="divUploadAvatarButton">
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
                                            <p id="error_add_profile_img" className="errorInput" hidden={!this.state.avatarError}>
                                                <LS msgId='image.exceds.limit' defaultMsg='The image exceds the limit of 5MB'/>
                                            </p>
                                        </div>
                                    :   <div/> }
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
                                    <h3 className="marginAuto"><LS msgId={this.state.acceptDisabledText} defaultMsg='Loading...' params={[Math.floor(Math.random() * 1000)]} /></h3>
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
                                            <Grid item sm={1} className='profileKarmaIconColumn' style={(this.state.isPreview) ? DISPLAY_NONE : {}}>
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
                                        {(!this.state.isPreview)
                                            ?   <div>
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
                                                        label={(!this.state.emailError && !noAvaliableEmail) ? (<LS msgId='your.email'/>) : (this.props.avaliableEmail !== false) 
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
                                                    {(this.state.showOldPass) 
                                                        ?   <div>
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
                                                        : (<div/>)}
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
                                                </div>
                                            :   <div/>}
                                        <br/>
                                        <TextField
                                            label={(!this.state.isPreview) 
                                                    ? <LS msgId='about.you' params={(this.state.userAboutMe != null) ? [140 - this.state.userAboutMe.length] : [140]}/>
                                                    : <LS msgId='about.a.readoer'/> }
                                            id="userAboutMe"
                                            name="userAboutMe"
                                            multiline
                                            rowsMax="4"
                                            disabled={this.state.isPreview}
                                            fullWidth
                                            inputProps={{
                                                maxLength: 140,
                                            }}
                                            value={this.state.userAboutMe}
                                            style={(this.state.isPreview && !this.state.userAboutMe.length) ? DISPLAY_NONE : {}}
                                            onChange={this.oChangeInput.bind(this)}
                                        />
                                        <br/>
                                        <GenreSelector
                                            readOnly={this.state.isPreview}
                                            multiple
                                            genresSelected={this.state.userGenres} 
                                            onChange={this.onChangeGenre.bind(this)}
                                            myGenres={true}
                                        />
                                    </Paper>
                                </RootRef>
                            </Grid>
                        </Grid>
                        {(!this.state.isPreview)
                            ?   <Grid container alignItems="flex-end">
                                    <Grid item sm={12}>
                                        {(this.state.noChanges) ? (<div className="redInfo"><LS msgId='no.changes' defaultMsg='No changes to save'/></div>) : (<div/>)}
                                        <div className="saveProfileButton">
                                            <Button variant="flat" color="secondary" 
                                                onClick={this.openDeleteProfile.bind(this)}
                                                disabled={this.state.acceptDisabled}
                                            >
                                                <LS msgId='delete.profile' defaultMsg='Delete profile!'/>
                                            </Button>
                                            <Button variant="flat" color="primary" 
                                                onClick={this.acceptSaveProfile.bind(this)}
                                                disabled={this.state.acceptDisabled || noAvaliableSafe }
                                            >
                                                <LS msgId='save' defaultMsg='Save'/>
                                            </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            :   <div/>
                        }
                        <ContinueModal open={this.state.openContinueDeleteProfile} text={LS.getStringMsg('continue.delete.profile')} closeCallback={this.acceptDeleteProfile} />
                    </div>
                )
        }
    }
}

export default connect(
    (state) => ({
        userId: appState.getUserId(state),
        userData: appState.getUser(state),
        userPreviewData: appState.getUserPreview(state),
        avaliableEmail: appState.getAvaliableEmail(state),
        loadingProcesses: appState.getLoadingProcesses(state),
        succeedProcesses: appState.getSucceedProcesses(state),
        failedProcesses: appState.getFailedProcesses(state)
    }),
    (dispatch) => ({
        fetchUserData: (userId, isPreveiw) => dispatch(fetchUserData(userId, isPreveiw)),
        setEmailIsUniqueFalse: () => dispatch(setEmailIsUniqueFalse()),
        checkEmailIsUnique: (email) => dispatch(checkEmailIsUnique(email)),
        saveUserData: (newUserData, userDataForm) => dispatch(saveUserData(newUserData, userDataForm)),
        deleteUser: (userId) => dispatch(dissableUser(userId)),
        resetProccessStatus: (proccessName) => dispatch(resetProccess(proccessName)),
        // Do logOut in case of delete user success...
        doLogOut: () => dispatch(doLogOut())
    })
)(ProfileView);