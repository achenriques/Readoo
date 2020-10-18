import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import LS from '../LanguageSelector';
import '../../styles/Common.css';

class InfoModal extends Component {

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

    handleClose = () => {
        // Calback onClose
        if (this.props.closeCallback !== undefined && typeof this.props.closeCallback === "function") {
            this.props.closeCallback();
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
                <div className="continueModal">
                    <h2 id="simple-modal-title" style={{margin: '25px'}}>{(this.props.text) ? this.props.text : LS.getStringMsg('info.modal.title', 'INFO')}</h2>
                    <p id="simple-modal-description">
                        <Button variant="flat" color="primary" 
                            onClick={this.handleClose.bind(this)}
                        >
                            <LS msgId='ok' defaultMsg='Ok!'/>
                        </Button>
                    </p>
                </div>
            </Modal>
        );
    }
}

export default InfoModal;