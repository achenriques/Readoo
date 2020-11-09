import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import appReducer from './app_state/reducers/index';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-action-middleware'
import App from './App';
import registerServiceWorker from './registerServiceWorker';

let store = createStore(appReducer, applyMiddleware(thunk, promiseMiddleware));

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
jss.options.insertionPoint = document.getElementById('jss-insertion-point');

const muiTheme = createMuiTheme();

ReactDOM.render(
    <MuiThemeProvider theme={muiTheme}>
        <JssProvider jss={jss} generateClassName={generateClassName}>
            <Provider store={store}>
                <App />
            </Provider>
        </JssProvider>
    </MuiThemeProvider>,
    document.getElementById('root')
);
registerServiceWorker();
