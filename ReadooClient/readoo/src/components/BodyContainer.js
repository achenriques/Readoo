import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setIsOpenAddLibro } from '../app_state/actions';
import * as appState from '../app_state/reducers';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import '../styles/BodyContainer.css';

const styleButton = {
    position: 'absolute',
    bottom: '50px',
    right: '50px',
}

class BodyContainer extends Component {
    
    handleOpen = (evt) => {
        this.props.openAddLibro(true);
    };
    
    handleClose = () => {
        this.props.openAddLibro(false);
    };
    
    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                disabled={true}
                onClick={this.handleClose}
            />,
        ];


        switch (this.props.selectedIndex) {
            case 0:
                return (
                    <div>
                        <h1 align="center">
                            Soy un body
                        </h1>
                        <FloatingActionButton onClick={this.handleOpen} style={styleButton}>
                            <ContentAdd />
                        </FloatingActionButton>
                        <Dialog
                            title="Dialog With Actions"
                            actions={actions}
                            modal={true}
                            open={this.props.isOpenModal}
                        >
                            + COMPONENTES
                        </Dialog>
                    </div>
                );

            case 1:
                return (
                    <div>
                        <h1 align="center">
                            Soy un body 2
                        </h1>
                    </div>
                );

            case 2:
            return (
                <div>
                    <h1 align="center">
                        Soy un body 3
                    </h1>
                </div>
            );

            case 3:
            return (
                <div>
                    <h1 align="center">
                        Soy un body 4
                    </h1>
                </div>
            );

            default:
                break;
        }

    }
}

export default connect(
    (state) => ({
        isOpenModal: appState.getIsOpenModal(state).isOpenAddLibro,
        selectedIndex: appState.getCurrentTabID(state)
    }),
    (dispatch) => ({
        openAddLibro: (isOpen) => dispatch(setIsOpenAddLibro(isOpen)),
    })
)(BodyContainer);