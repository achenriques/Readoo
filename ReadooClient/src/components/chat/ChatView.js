import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionTypes } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import LS from '../LanguageSelector';
import avatarDefault from '../../resources/avatarDefault.svg';
import { DISPLAY_NONE, REST_FAILURE, REST_DEFAULT, REST_SUCCESS } from '../../constants/appConstants';

class ChatView extends Component {

    initialState = {
        
    };

    constructor(props) {
        super(props);
        this.state = { 
            ...this.initialState
        };
    };

    componentDidMount = () => {
        // fetch chat history
    }

    componentDidUpdate = () => {
        
    }

    oChangeInput = (evt) => {
        const value = evt.target.value;
        const name = evt.target.name;

        this.setState({
            ...this.state,
            [name]: value
        });
    }

    sendMessage(evt) {

    }

    render = () => {
        switch (this.state.loadingProcesses(xx)) {
            case REST_FAILURE:
                return (
                    <div className="loadingNewTab">
                        <h3><LS msgId='timeout.error' defaultMsg='An error has ocurred...'/></h3>
                    </div>
                )
            case REST_DEFAULT:
                return (
                    <div className="loadingNewTab">
                        <h3><LS msgId='loading' defaultMsg='Loading...'/></h3>
                    </div>
                )
        
            default:
                return (
                    <div>
                        <Grid container className="">
                            <Grid item sm={4} className="">
                                <Paper elevation={16}>
                                    <List className={classes.root}>
                                        {this.props.chatHistory.map((chat) => (
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <ImageIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="chat.chatNick" secondary="Date" />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                                {/* List of chat users*/}
                            </Grid>
                            <Grid item sm={8} className="">
                                <Paper elevation={16}>
                                    {/* Chat text*/}
                                </Paper>
                            </Grid>
                        </Grid>
                        <ContinueModal open={this.state.openContinueDeleteChat} text={LS.getStringMsg('continue.delete.chat', 'Delete?')} closeCallback={this.acceptDeleteChat.bind(this)} />
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
)(ChatView);