import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeTab, setIsOpenAddLibro, controllerLibroDefault } from '../app_state/actions';
import * as appState from '../app_state/reducers';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';
import { Grid, Row, Col } from 'react-material-responsive-grid';
import SubirLibroModal from './Explore/SubirLibroModal';
import { REST_SUCCESS, REST_DEFAULT, REST_FAILURE } from '../constants/appConstants';
import '../styles/BodyContainer.css';

const styleButton = {
    position: 'absolute',
    bottom: '50px',
    right: '50px',
}

class BodyContainer extends Component {

    initialState = {
        openSnackBar: false,
        snackBarMsg: ''
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    // CICLO DE VIDA
    componentWillReceiveProps(newProps) {
        if (newProps.uploadLibroSuccess === REST_SUCCESS) {
            this.handleCloseAddLibro();
            this.showSubidoFinalizado(REST_SUCCESS);
        }
        if (newProps.uploadLibroSuccess === REST_FAILURE) {
            this.handleCloseAddLibro();
            this.showSubidoFinalizado(REST_FAILURE);
        }
    }

    showSubidoFinalizado = (status) => {
        switch (status) {
            case REST_SUCCESS:
                this.setState({
                    ...this.state,
                    snackBarMsg: 'Libro subido correctamente',
                    openSnackBar: true,
                });
                break;

            case REST_FAILURE:
                this.setState({
                    ...this.state,
                    snackBarMsg: 'Ha fallado la subida del libro',
                    openSnackBar: true,
                });
                break;

            default:
                break;
        }
    }

    handleSnakRequestClose = () => {
        this.setState({
            ...this.state,
            openSnackBar: false,
        });
    };

    hadleOpenAddLibro = () => {
        this.props.openAddLibro(true);
    };

    handleCloseAddLibro = () => {
        // Por si se quiere cerrar el modal pulsando esc o fuera del mismo
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
                        <FloatingActionButton onClick={this.hadleOpenAddLibro} style={styleButton}>
                            <ContentAdd />
                        </FloatingActionButton>
                        <SubirLibroModal />
                        <Snackbar
                            open={this.state.openSnackBar}
                            message={this.state.snackBarMsg}
                            action="cerrar"
                            autoHideDuration={5000 /*ms*/}
                            onActionClick={this.handleSnakRequestClose}
                            onRequestClose={this.handleSnakRequestClose}
                        />
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
        selectedIndex: appState.getCurrentTabID(state),
        uploadLibroSuccess: appState.libroSuccessUpload(state)
    }),
    (dispatch) => ({
        changeTab: (tabID) => dispatch(changeTab(tabID)),
        openAddLibro: (isOpen) => dispatch(setIsOpenAddLibro(isOpen)),
        listenedUploadLibro: () => dispatch(controllerLibroDefault())
    })
)(BodyContainer);