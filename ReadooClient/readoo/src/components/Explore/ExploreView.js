/*import React, { Component } from 'react';
import * as appState from '../../app_state/reducers';
//import Explore from 'material-ui/svg-icons/action/explore';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;


class ShortcutBar extends Component {

    handleActive(tab) {
        this.props.changeTab(tab.props.value);
    }

    render() {
        return (
          <Paper zDepth={1}>
            <BottomNavigation selectedIndex={this.props.selectedIndex}>
              <BottomNavigationItem
                label="VER LIBROS"
                icon={recentsIcon}
                onClick={(tab) => this.handleActive(tab)}
              />
              <BottomNavigationItem
                label="MIS FAVORITOS"
                icon={favoritesIcon}
                onClick={(tab) => this.handleActive(tab)}
              />
              <BottomNavigationItem
                label="Nearby"
                icon={nearbyIcon}
                onClick={(tab) => this.handleActive(tab)}
              />
            </BottomNavigation>
          </Paper>
        );
      }

    /*render() {
        return (
            <Tabs>
                <Tab
                    icon={<Explore/>}
                    label="VER LIBROS"
                    value='explora'
                    onActive={(tab) => this.handleActive(tab)}
                />
                <Tab
                    icon={<Favorite/>}
                    label="FAVORITOS"
                    value='favoritos'
                    onActive={(tab) => this.handleActive(tab)}
                />
                <Tab
                    icon={<ChatBubble/>}
                    label="PERFIL"
                    value='perfil'
                    onActive={(tab) => this.handleActive(tab)}
                />
                <Tab
                    icon={<MapsPersonPin/>}
                    label="PERFIL"
                    value='perfil'
                    onActive={(tab) => this.handleActive(tab)}
                />
            </Tabs>
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
  )(ShortcutBar);*/