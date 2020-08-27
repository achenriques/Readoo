import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionTypes, setIsOpenProfilePreview } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ProfileView from './ProfileView';
import LS from '../LanguageSelector';
import { DISPLAY_NONE, REST_FAILURE, REST_DEFAULT, REST_SUCCESS } from '../../constants/appConstants';


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
        this.props.openProfilePreview(false);
    }

    render() {
        return (
            <Dialog
                title={LS.getStringMsg('upload.my.book', 'Upload Book')}
                open={this.props.isOpenModal}
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
                    <div>
                        <Button variant="contained" color="primary"
                            onClick={this.handleClose.bind(this)}
                            className="primaryButton"
                        >
                            <LS msgId='close' defaultMsg='Close'/>
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        );
    }
}

export default connect(
    (state) => ({
        isOpenModal: appState.getIsOpenModal(state).isOpenProfilePreview,
        currentUserId: appState.getUserId(state),
        loadingProcesses: appState.getLoadingProcesses(state)
    }),
    (dispatch) => ({
        openProfilePreview: (isOpen) => dispatch(setIsOpenProfilePreview(isOpen))
    })
)(ProfilePreviewModal);