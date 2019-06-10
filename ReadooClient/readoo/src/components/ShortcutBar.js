import React, { Component } from 'react';
import * as appState from '../app_state/reducers';
import { changeTab, changeLanguage } from '../app_state/actions';
import { connect } from 'react-redux';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Explore from 'material-ui/svg-icons/action/explore';
import Favorite from 'material-ui/svg-icons/action/favorite';
import ChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import Paper from 'material-ui/Paper';
import { LANGUAGE_ENGLISH, LANGUAGE_SPANISH} from '../constants/appConstants';
import icon_en from '../resources/language_en.png';
import icon_es from '../resources/language_es.png';
import '../styles/ShortcutBar.css';

const explore = <Explore />;
const favoritesIcon = <Favorite />;
const chatBubble = <ChatBubble />;
const perfil = <MapsPersonPin />;

class ShortcutBar extends Component {

    handleActive(tab) {
        this.props.changeTab(tab);
    }

    handleLanguage(languageId) {
        if (this.props.currengLanguage !== languageId) {
            this.props.changeLanguage(languageId);
        }
    }

    render() {
        return (
            <Paper zDepth={1} style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '60px', overflow: 'visible', zIndex: 1}}>
                <Grid container spacing={2}>
                    <Grid item sm={2} xs={0} >
                        {(this.props.loading > 0) ? <CircularProgress className="loadingIcon" size='20' /> : <div/>}
                    </Grid>
                    <Grid item sm={8} xs={8} >
                        <BottomNavigation selectedIndex={this.props.selectedIndex}>
                            <BottomNavigationItem
                                label="Ver libros"
                                icon={explore}
                                onClick={(tab) => this.handleActive(0)}
                            />
                            <BottomNavigationItem
                                label="Mis favoritos"
                                icon={favoritesIcon}
                                onClick={(tab) => this.handleActive(1)}
                            />
                            <BottomNavigationItem
                                label="Mis Chats"
                                icon={chatBubble}
                                onClick={(tab) => this.handleActive(2)}
                            />
                            <BottomNavigationItem
                                label="Perfil"
                                icon={perfil}
                                onClick={(tab) => this.handleActive(3)}
                            />
                        </BottomNavigation>
                    </Grid>
                    <Grid item sm={2} xs={4} >
                        <BottomNavigation selectedIndex={this.props.currengLanguage}>
                            <BottomNavigationItem
                                label="English"
                                icon={<img src={icon_en} className="countryFlagIcon" />}
                                onClick={(tab) => this.handleLanguage(LANGUAGE_ENGLISH)}
                            />
                            <BottomNavigationItem
                                label="Spanish"
                                icon={<img src={icon_es} className="countryFlagIcon" />}
                                onClick={(tab) => this.handleLanguage(LANGUAGE_SPANISH)}
                            />
                        </BottomNavigation>
                    </Grid>
                </Grid>
            </Paper >
        );
    }
}

export default connect(
    (state) => ({
        selectedIndex: appState.getCurrentTabID(state),
        currengLanguage: appState.getAppLanguage(state),
        loading: appState.getLoadingStatus(state)
    }),
    (dispatch) => ({
        changeTab: (tabID) => dispatch(changeTab(tabID)),
        changeLanguage: (languageId) => dispatch(changeLanguage(languageId)),
    })
)(ShortcutBar);