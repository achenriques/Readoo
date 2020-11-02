import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../../app_state/reducers';
import Grid from '@material-ui/core/Grid';
import LS from '../LanguageSelector';
import { REST_FAILURE, REST_DEFAULT, REST_SUCCESS } from '../../constants/appConstants';
import '../../styles/Chat.css';
import MessagesView from './MessagesView';
import HistoryView from './HistoryView';
import { actionTypes } from '../../app_state/actions';

class ChatView extends Component {

    initialState = {
        chatHistory: [],
        chatMessages: [],
        newChat: null,
        currentChat: null,
        selectedChatId: null,
        messageText: "",
        openContinueDeleteChat: false,
        loadingChatHistory: REST_SUCCESS
    };

    constructor(props) {
        super(props);
        this.state = { 
            ...this.initialState
        };
    };

    componentDidUpdate = () => {
        
    }

    isLoadingProcess(action) {
        return this.props.loadingProcesses.includes(action)
    }

    hadleChatClick(evt, chat) {
        console.log("Chat con id: " + chat.chatId)
        this.setState({
            ...this.state,
            selectedChatId: chat.chatId,
            currentChat: chat
        });
    }

    render = () => {
        switch (this.state.loadingChatHistory) {
            case REST_FAILURE:
                return (
                    <div className="loadingNewTab">
                        <h3><LS msgId='timeout.error' defaultMsg='An error has ocurred...'/></h3>
                    </div>
                )
            case REST_DEFAULT:
                return (
                    <div className="loadingNewTab">
                        <h3><LS msgId='loading' defaultMsg='Loading...'/></h3>
                    </div>
                )
        
            default:
                return (
                    <div className="chatRootDiv">
                        <Grid container spacing={24}className="chatRootGrid">
                            <Grid item sm={3} className="chatConversationGrid">
                                <h3><LS msgId='conversations' defaultMsg='Conversations'/></h3>
                                <HistoryView onClickSelectChat={this.hadleChatClick.bind(this)}/>
                            </Grid>
                            <Grid item sm={9} className="chatMessagesGrid">
                                {(this.state.currentChat != null) ? (<MessagesView chat={this.state.currentChat}/>) : (<div/>) }
                            </Grid>
                        </Grid>
                    </div>
                )
        }
    }
}

export default connect(
    (state) => ({
        currentUserId: appState.getUserId(state),
        currentUser: appState.getUser(state),
        userPreview: appState.getUserPreview(state),
        appLanguage: appState.getAppLanguage(state),
        loadingProcesses: appState.getLoadingProcesses(state),
        succeedProcesses: appState.getSucceedProcesses(state),
        failedProcesses: appState.getFailedProcesses(state)
    }),
    (dispatch) => ({
    })
)(ChatView);