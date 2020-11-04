import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../../app_state/reducers';
import Grid from '@material-ui/core/Grid';
import LS from '../LanguageSelector';
import { REST_FAILURE, REST_DEFAULT, REST_SUCCESS, REST_EMPTY, DISPLAY_NONE } from '../../constants/appConstants';
import '../../styles/Chat.css';
import MessagesView from './MessagesView';
import HistoryView from './HistoryView';
import { actionTypes } from '../../app_state/actions';

class ChatView extends Component {

    initialState = {
        currentChat: null,
        selectedChatId: null,
        fetchStatus: REST_DEFAULT
    };

    constructor(props) {
        super(props);
        this.state = { 
            ...this.initialState
        };
    };

    hadleChatClick(chat, status) {
        let newState = { ...this.state };
        if (chat !== undefined) {
            newState.currentChat = chat;
            newState.selectedChatId = (chat !== null) ? chat.chatId : null
        }
        if (status !== undefined) {
            newState.fetchStatus = status;
        }
        this.setState(newState);
    }

    render = () => {
        switch (this.state.fetchStatus) {
            case REST_FAILURE:
                return (
                    <div className="loadingNewTab">
                        <h3><LS msgId='timeout.error' defaultMsg='An error has ocurred...'/></h3>
                    </div>
                )
                
            case REST_EMPTY:
                return (
                    <div className="loadingNewTab">
                        <h3><LS msgId='any.chat.yet' defaultMsg='No chats yet...'/></h3>
                    </div>
                )

            default:
                return (
                    <div className="chatRootDiv">
                        <div className="loadingNewTab" style={(this.state.fetchStatus === REST_DEFAULT) ? {} : DISPLAY_NONE}>
                            <h3><LS msgId='loading' defaultMsg='Loading...'/></h3>
                        </div>
                        <Grid container spacing={24} className="chatRootGrid" style={(this.state.fetchStatus === REST_DEFAULT) ? DISPLAY_NONE : {}}>
                            <Grid item sm={3} className="chatConversationGrid">
                                <h3 className="conversationsText">
                                    <LS msgId='conversations' defaultMsg='Conversations'/>
                                </h3>
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