import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeTab, setIsOpenAddBook, resetErrLog } from '../app_state/actions';
import * as appState from '../app_state/reducers';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import ExploreView from './explore/ExploreView';
import UploadBookModal from './explore/UploadBookModal';
import '../styles/BodyContainer.css';
import FavouritesView from './favourites/FavouritesView';
import ProfileView from './profile/ProfileView';

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
        if(nextProps.enviarNuevoComentarioSuccess) {
            let errorMsg = "";
            nextProps.enviarNuevoComentarioSuccess.each((err) => {
                return errorMsg += err + " / ";
            }, this);
            return({
                ...prevState,
                snackBarMsg: errorMsg,
                openSnackBar: true,
            });
        }        
        return null;
    }

    handleSnakRequestClose () {
        this.props.resetErrLog();
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
                        <UploadBookModal />
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
        petitionFailed: appState.getFailingStatus(state),
    }),
    (dispatch) => ({
        changeTab: (tabID) => dispatch(changeTab(tabID)),
        openAddLibro: (isOpen) => dispatch(setIsOpenAddBook(isOpen)),
        resetErrLog: () => dispatch(resetErrLog())
    })
)(BodyContainer);