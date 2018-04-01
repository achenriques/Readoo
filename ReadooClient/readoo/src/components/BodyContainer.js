import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeTab, setIsOpenAddLibro } from '../app_state/actions';
import * as appState from '../app_state/reducers';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Grid, Row, Col } from 'react-material-responsive-grid';
import SubirLibroModal from './Explore/SubirLibroModal';
import '../styles/BodyContainer.css';

const styleButton = {
    position: 'absolute',
    bottom: '50px',
    right: '50px',
}

class BodyContainer extends Component {

    handleOpen = () => {
        this.props.openAddLibro(true);
    };

    handleClose = () => {
        // Por si se quiere cerrar el modal pulsando esc o fuera del mismo
        this.setState({ ...this.initialState });
        this.props.openAddLibro(false);
    };

    render() {
        switch (this.props.selectedIndex) {
            case 0:
                return (
                    <div>
                        <h1 align="center">
                            Soy un body
                        </h1>
                        <input type="button" onClick={this.pruebas} />
                        <FloatingActionButton onClick={this.handleOpen} style={styleButton}>
                            <ContentAdd />
                        </FloatingActionButton>
                        <SubirLibroModal />
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
        //isOpenModal: appState.getIsOpenModal(state).isOpenAddLibro,
        selectedIndex: appState.getCurrentTabID(state)
    }),
    (dispatch) => ({
        changeTab: (tabID) => dispatch(changeTab(tabID)),
        openAddLibro: (isOpen) => dispatch(setIsOpenAddLibro(isOpen)),
    })
)(BodyContainer);