import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeTab, setIsOpenAddBook, 
    setBookControllerDefault, setControllerCommentDefault,
    setControllerUserDefault } from '../app_state/actions';
import * as appState from '../app_state/reducers';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import ExploreView from './explore/ExploreView';
import SubirLibroModal from './explore/SubirLibroModal';
import '../styles/BodyContainer.css';
import FavouritesView from './favourites/FavouritesView';
import ProfileView from './profile/ProfileView';
import { REST_SUCCESS, REST_DEFAULT, REST_FAILURE } from '../constants/appConstants';

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
        console.log("eih");
        if(nextProps.enviarNuevoComentarioSuccess && REST_FAILURE === nextProps.enviarNuevoComentarioSuccess) {
            nextProps.recibidoEnviarComentario();
            return({
                ...prevState,
                snackBarMsg: 'Error al subir el comentario al servidor',
                openSnackBar: true,
            });
        }

        if (nextProps.uploadLibroSuccess && REST_SUCCESS === nextProps.uploadLibroSuccess) {
            nextProps.openAddLibro(false);
            nextProps.listenedUploadLibro();
            return ({
                ...prevState,
                snackBarMsg: 'Libro subido correctamente',
                openSnackBar: true,
            });
        }
        
        if (nextProps.uploadLibroSuccess && REST_SUCCESS === nextProps.uploadLibroSuccess) {
            nextProps.openAddLibro(false);
            nextProps.listenedUploadLibro();
            return ({
                ...prevState,
                snackBarMsg: 'Libro subido correctamente',
                openSnackBar: true,
            });
        }

        if (nextProps.uploadLibroSuccess && REST_FAILURE === nextProps.uploadLibroSuccess) {
            nextProps.openAddLibro(false);
            return ({
                ...prevState,
                snackBarMsg: 'Ha fallado la subida del libro',
                openSnackBar: true,
            });
        }

        if (nextProps.getfetchComentarioSuccess && REST_FAILURE == nextProps.getfetchComentarioSuccess) {
            return({
                ...prevState,
                snackBarMsg: 'Error al leer los comentarios desde el servidor',
                openSnackBar: true,
            });
        }

        if (nextProps.failFetchUserData && REST_FAILURE == nextProps.failFetchUserData) {
            return({
                ...prevState,
                snackBarMsg: 'Error al leer los datos de usuario desde el servidor',
                openSnackBar: true,
            });
        }

        if (nextProps.failSavingUserData) {
            if ( REST_FAILURE == nextProps.failSavingUserData) {
                return({
                    ...prevState,
                    snackBarMsg: 'Error al escribir los datos de usuario en el servidor',
                    openSnackBar: true,
                });
            } else if ( REST_SUCCESS == nextProps.failSavingUserData) {
                return({
                    ...prevState,
                    snackBarMsg: 'Se han guardado los datos de usuario correctamente',
                    openSnackBar: true,
                });
            }
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
                    <div className='bodyFavoritos'>
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
                        <ProfileView/>
                    </div>
                );

            default:
                break;
        }

    }
}

export default connect(
    (state) => ({
        //isOpenModal: appState.getIsOpenModal(state).isOpenAddBook,
        selectedIndex: appState.getCurrentTabID(state),
        uploadLibroSuccess: appState.libroSuccessUpload(state),
        enviarNuevoComentarioSuccess: appState.getComentarioEnviado(state),
        getfetchComentarioSuccess: appState.getfetchComentarioSuccess(state),
        failSavingUserData: appState.getsaveUserDataSuccess(state),
        failFetchUserData: appState.getfetchComentarioSuccess(state) === REST_FAILURE
    }),
    (dispatch) => ({
        changeTab: (tabID) => dispatch(changeTab(tabID)),
        openAddLibro: (isOpen) => dispatch(setIsOpenAddBook(isOpen)),
        listenedUploadLibro: () => dispatch(setBookControllerDefault()),
        recibidoEnviarComentario: () => dispatch(setControllerCommentDefault()),
        listenedUserData: () => dispatch(setControllerUserDefault()),
    })
)(BodyContainer);