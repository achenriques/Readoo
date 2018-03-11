import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../app_state/reducers';
import { getPaginaActual, getIdioma } from '../utils/AppUtils'
import '../styles/Footer.css'

class Footer extends Component {
    render() {
        return (
            <div className=" Back-Color">
                <div className="displayed-left">
                    ¿Qué estoy haciendo? Pues estoy {getPaginaActual(this.props.selectedIndex)}
                </div>
                <div className="displayed-right">
                    Idioma: {getIdioma()}
                </div>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        selectedIndex: appState.getCurrentTabID(state)
    }),
    (dispatch) => ({
    })
)(Footer);

