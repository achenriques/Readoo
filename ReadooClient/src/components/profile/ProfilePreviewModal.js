import React, { Component } from 'react';
import { connect } from 'react-redux';
import { goChatWith } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ProfileView from './ProfileView';
import LS from '../LanguageSelector';

class ProfilePreviewModal extends Component {

    initialState = {
        disabledChatButton: true,
    };

    genreItems = [];

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    handleClose = () => {
        // Calback onClose
        if (this.props.closeCallback !== undefined && typeof this.props.closeCallback === "function") {
            this.props.closeCallback();
        }
    };

    handleChat = () => {
        this.props.goChatWith(this.props.previewUser);
        this.handleClose();
    }

    render() {
        return (
            <Dialog
                title={LS.getStringMsg('profile.preview', 'Readoo User')}
                open={this.props.isOpen}
                aria-labelledby="responsive-dialog-title"
                classes={{
                    paper: 'dialogUploadBook'
                }}
            >
                <DialogTitle><LS msgId='profile.preview' defaultMsg='Readoo User'/></DialogTitle>
                <DialogContent /* fullWidth */>
                    <ProfileView previewUser={this.props.previewUser}/>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="secondary"
                        onClick={this.handleClose.bind(this)}
                        className="primaryButton"
                    >
                        <LS msgId='close' defaultMsg='Close'/>
                    </Button>
                    <Button variant="contained" color="primary"
                        onClick={this.handleChat.bind(this)}
                        className="primaryButton"
                    >
                        <LS msgId='chat' defaultMsg='Go chat!'/>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default connect(
    (state) => ({
        currentUserId: appState.getUserId(state),
        loadingProcesses: appState.getLoadingProcesses(state)
    }),
    (dispatch) => ({
        goChatWith: (userId) => dispatch(goChatWith(userId)),
    })
)(ProfilePreviewModal);