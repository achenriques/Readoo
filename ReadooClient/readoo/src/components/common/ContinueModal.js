import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import LS from '../LanguageSelector';

const modalStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
};

class ContinueModal extends Component {

    initialState = {
        open: false
    }

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    handleOpen = () => {
        this.setState({
            open: true
        });
    };

    handleClose = (selectedOption) => {
        // Calback onClose
        if (this.props.closeCallback !== undefined) {
            this.props.closeCallback(selectedOption);
        }
    };

    render = () => {
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.open}
                onClose={this.handleClose}
            >
                <div style={modalStyle}>
                    <h2 id="simple-modal-title"><LS msgId='continue.modal.title' defaultMsg='Continue?'/></h2>
                    <p id="simple-modal-description">
                        <Button variant="flat" color="secondary" 
                            onClick={this.handleClose.bind(this, false)}
                        >
                            <LS msgId='cancel' defaultMsg='Cancel'/>
                        </Button>
                        <Button variant="flat" color="primary" 
                            onClick={this.handleClose.bind(this, true)}
                        >
                            <LS msgId='continue' defaultMsg='Continue'/>
                        </Button>
                    </p>
                </div>
            </Modal>
        );
    }
}

export default ContinueModal;