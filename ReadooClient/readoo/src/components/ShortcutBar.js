import React, { Component } from 'react';
import * as appState from '../app_state/reducers';
import { changeTab } from '../app_state/actions';
import { connect } from 'react-redux';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Explore from 'material-ui/svg-icons/action/explore';
import Favorite from 'material-ui/svg-icons/action/favorite';
import ChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import Paper from 'material-ui/Paper';

const explore = <Explore />;
const favoritesIcon = <Favorite />;
const chatBubble = <ChatBubble />;
const perfil = <MapsPersonPin />;

class ShortcutBar extends Component {

    handleActive(tab) {
        this.props.changeTab(tab);
    }

    render() {
        return (
            <Paper zDepth={1} style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '60px', overflow: 'visible', zIndex: 1}}>
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
                    {/* TODO: implementar botones de idioma */}
                </BottomNavigation>
            </Paper >
        );
    }
}

export default connect(
    (state) => ({
        selectedIndex: appState.getCurrentTabID(state)
    }),
    (dispatch) => ({
        changeTab: (tabID) => dispatch(changeTab(tabID)),
    })
)(ShortcutBar);