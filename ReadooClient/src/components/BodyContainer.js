import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeTab, setIsOpenAddBook } from '../app_state/actions';
import * as appState from '../app_state/reducers';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import LS from './LanguageSelector';
import ExploreView from './explore/ExploreView';
import UploadBookModal from './explore/UploadBookModal';
import FavouritesView from './favourites/FavouritesView';
import ChatView from './chat/ChatView';
import ProfileView from './profile/ProfileView';
import '../styles/BodyContainer.css';

class BodyContainer extends Component {

    initialState = {}

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    hadleOpenAddBook() {
        this.props.openAddBook(true);
    };

    handleCloseAddBook() {
        // Por si se quiere cerrar el modal pulsando esc o fuera del mismo
        this.props.openAddBook(false);
    };

    render() {
        switch (this.props.selectedIndex) {
            case 0:
                return (
                    <div className='bodyContainer'>
                        <ExploreView/>
                        <Button variant="fab" color="primary" aria-label="add" onClick={this.hadleOpenAddBook.bind(this)} className='styleButton'>
                            <AddIcon />
                        </Button>
                        <UploadBookModal />
                    </div>
                );

            case 1:
                return (
                    <div className='favouritesBody'>
                        <FavouritesView/>
                    </div>
                );

            case 2:
                return (
                    <div className='bodyContainer'>
                        <ChatView/>
                    </div>
                );

            case 3:
                return (
                    <div className='bodyContainer'>
                        <ProfileView previewUser={null}/>
                    </div>
                );

            default:
                return (
                    <div className='bodyContainer'>
                        <LS msgId='something.goes.wrong'/>
                    </div>
                );
        }

    }
}

export default connect(
    (state) => ({
        //isOpenModal: appState.getIsOpenModal(state).isOpenAddBook,
        selectedIndex: appState.getCurrentTabID(state),
    }),
    (dispatch) => ({
        changeTab: (tabID) => dispatch(changeTab(tabID)),
        openAddBook: (isOpen) => dispatch(setIsOpenAddBook(isOpen))
    })
)(BodyContainer);