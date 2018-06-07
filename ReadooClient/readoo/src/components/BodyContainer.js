import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeTab, setIsOpenAddLibro, 
    controllerLibroDefault, controllerComentarioDefault } from '../app_state/actions';
import * as appState from '../app_state/reducers';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import ExploreView from './explore/ExploreView';
import SubirLibroModal from './explore/SubirLibroModal';
import { REST_SUCCESS, REST_DEFAULT, REST_FAILURE } from '../constants/appConstants';
import '../styles/BodyContainer.css';
import FavouritesView from './favourites/FavouritesView';

const styleButton = {
    position: 'fixed',
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if(REST_FAILURE === nextProps.enviarNuevoComentarioSuccess) {
            nextProps.recibidoEnviarComentario();
            return({
                ...prevState,
                snackBarMsg: 'Error al subir el comentario al servidor',
                openSnackBar: true,
            });
        }
        
        if (REST_SUCCESS === nextProps.uploadLibroSuccess) {
            nextProps.openAddLibro(false);
            nextProps.listenedUploadLibro();
            return ({
                ...prevState,
                snackBarMsg: 'Libro subido correctamente',
                openSnackBar: true,
            });
        }
        if (REST_FAILURE === nextProps.uploadLibroSuccess) {
            nextProps.openAddLibro(false);
            return ({
                ...prevState,
                snackBarMsg: 'Ha fallado la subida del libro',
                openSnackBar: true,
            });
        }
        return null;
    }

    handleSnakRequestClose () {
        this.setState({
            ...this.state,
            openSnackBar: false,
        });
    };

    hadleOpenAddLibro() {
        this.props.openAddLibro(true);
    };

    handleCloseAddLibro() {
        // Por si se quiere cerrar el modal pulsando esc o fuera del mismo
        this.props.openAddLibro(false);
    };

    render() {
        switch (this.props.selectedIndex) {
            case 0:
                return (
                    <div className='bodyContainer'>
                        <ExploreView/>
                        <Button variant="fab" color="primary" aria-label="añadir" onClick={this.hadleOpenAddLibro.bind(this)} style={styleButton}>
                            <AddIcon />
                        </Button>
                        <SubirLibroModal />
                        <Snackbar
                            open={this.state.openSnackBar}
                            message={this.state.snackBarMsg}                            
                            autoHideDuration={5000 /*ms*/}
                            onClose={this.handleSnakRequestClose.bind(this)}
                            action={[
                                <Button key="cerrar" color="secondary" size="small" onClick={() => {this.setState({...this.state, openSnackBar: false})}}>
                                  CERRAR
                                </Button>
                              ]}
                        />
                    </div>
                );

            case 1:
                return (
                    <div className='bodyContainer'>
                        <FavouritesView/>
                    </div>
                );

            case 2:
                return (
                    <div className='bodyContainer'>
                        <h1 align="center">
                            Soy un body 3
                        </h1>
                    </div>
                );

            case 3:
                return (
                    <div className='bodyContainer'>
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
        uploadLibroSuccess: appState.libroSuccessUpload(state),
        enviarNuevoComentarioSuccess: appState.getComentarioEnviado(state),
    }),
    (dispatch) => ({
        changeTab: (tabID) => dispatch(changeTab(tabID)),
        openAddLibro: (isOpen) => dispatch(setIsOpenAddLibro(isOpen)),
        listenedUploadLibro: () => dispatch(controllerLibroDefault()),
        recibidoEnviarComentario: () => dispatch(controllerComentarioDefault())
    })
)(BodyContainer);