import React, { Component } from 'react';
import * as appState from '../app_state/reducers';
import { changeTab, changeLanguage, doLogOut } from '../app_state/actions';
import { connect } from 'react-redux';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Explore from '@material-ui/icons/Explore';
import Favorite from '@material-ui/icons/Favorite';
import ChatBubble from '@material-ui/icons/ChatBubble';
import LogOut from '@material-ui/icons/PowerSettingsNew';
import MapsPersonPin from '@material-ui/icons/PersonPin';
import Paper from '@material-ui/core/Paper';
import LS from '../components/LanguageSelector';
import { LANGUAGE_ENGLISH, LANGUAGE_SPANISH, pages } from '../constants/appConstants';
import icon_en from '../resources/language_en.png';
import icon_es from '../resources/language_es.png';
import logo from '../resources/favicon.ico';
import '../styles/ShortcutBar.css';

const explore = <Explore />;
const favoritesIcon = <Favorite />;
const chatBubble = <ChatBubble />;
const perfil = <MapsPersonPin />;
const logOutIcon = <LogOut />;

class ShortcutBar extends Component {

    handleActive = (tab) => {
        this.props.changeTab(tab);
    }

    handleLanguage = (languageId) => {
        if (this.props.currengLanguage !== languageId) {
            this.props.changeLanguage(languageId, this.props.userIsLogged);
        }
    }

    handleLogOut = () => {
        this.props.doLogOut();
    }

    render = () => {
        return (
            <Paper elevation={2} className='bar'>
                <Grid container spacing={8}>
                    <Grid item sm={1} xs={1} className='readooIconGrid'>
                        <img src={logo} className='readooIcon'/>
                        <h4>READOO</h4>
                    </Grid>
                    <Grid item sm={1} xs={1} >
                        {(this.props.loading > 0) ? <CircularProgress className="loadingIcon" size='20' /> : <div/>}
                    </Grid>
                    <Grid item sm={8} xs={6} >
                        {(this.props.userIsLogged) ? (
                        <BottomNavigation 
                            showLabels={true} 
                            value={this.props.selectedIndex}
                        >
                            <BottomNavigationAction 
                                label={<LS msgId='look.for.books' defaultMsg='Explora'/>}
                                icon={explore}
                                onClick={(tab) => this.handleActive(pages.EXPLORE)}
                            />
                            <BottomNavigationAction 
                                label={<LS msgId='favourites' defaultMsg='Favourites'/>}
                                icon={favoritesIcon}
                                onClick={(tab) => this.handleActive(pages.FAVOURITES)}
                            />
                            <BottomNavigationAction 
                                label={<LS msgId='chats' defaultMsg='Chats'/>}
                                icon={chatBubble}
                                onClick={(tab) => this.handleActive(pages.CHAT)}
                            />
                            <BottomNavigationAction 
                                label={<LS msgId='profile' defaultMsg='Me'/>}
                                icon={perfil}
                                onClick={(tab) => this.handleActive(pages.PROFILE)}
                            />
                        </BottomNavigation>
                        ) : (<div/>) }
                    </Grid>
                    <Grid item sm={1} xs={2} >
                        <BottomNavigation 
                            showLabels={true} 
                            value={this.props.currengLanguage}
                        >
                            <BottomNavigationAction 
                                label={<LS msgId='english' defaultMsg='English'/>}
                                icon={<img src={icon_en} className="countryFlagIcon" />}
                                onClick={(tab) => this.handleLanguage(LANGUAGE_ENGLISH)}
                            />
                            <BottomNavigationAction 
                                label={<LS msgId='spanish' defaultMsg='Español'/>}
                                icon={<img src={icon_es} className="countryFlagIcon" />}
                                onClick={(tab) => this.handleLanguage(LANGUAGE_SPANISH)}
                            />
                        </BottomNavigation>
                    </Grid>
                    <Grid item sm={1} xs={2} >
                        {(this.props.userIsLogged) ? (
                            <BottomNavigationAction 
                                label={<LS msgId='log.out' defaultMsg='Log Out'/>}
                                icon={logOutIcon}
                                onClick={(tab) => this.handleLogOut()}
                            />
                        ) : (<div/>) }
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
        loading: appState.getLoadingStatus(state),
        userIsLogged: appState.getUserIsLogged(state)
    }),
    (dispatch) => ({
        changeTab: (tabID) => dispatch(changeTab(tabID)),
        changeLanguage: (languageId) => dispatch(changeLanguage(languageId)),
        doLogOut: () => dispatch(doLogOut())
    })
)(ShortcutBar);