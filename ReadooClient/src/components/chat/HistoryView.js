import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchChatHistory, recivedChatWith, deleteChat, actionTypes, fetchChatMessages } from '../../app_state/actions';
import * as appState from '../../app_state/reducers/index';
import { parseDate } from '../../utils/appUtils';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import LS from '../LanguageSelector';
import ContinueModal from '../common/ContinueModal';
import avatarDefault from '../../resources/avatarDefault.svg';
import { NEW_CHAT_ID, REST_EMPTY, REST_FAILURE, REST_DEFAULT, REST_SUCCESS } from '../../constants/appConstants';
import '../../styles/Chat.css';

class ChatView extends Component {

    initialState = {
        chatHistory: [],
        currentChat: null,
        selectedChatId: null,
        deleteChatId: null,
        newChat: null,
        openContinueDeleteChat: false,
        loadingChatHistory: REST_DEFAULT,
        loadingChatMessages: REST_DEFAULT
    };

    constructor(props) {
        super(props);
        this.state = { 
            ...this.initialState
        };
    };

    componentDidMount = () => {
        this.props.fetchChatHistory(this.props.currentUserId);
    }

    componentDidUpdate = () => {
        if (this.isLoadingProcess(actionTypes.FETCH_CHAT_HISTORY)) {
            if (!this.state.loadingChatHistory === REST_DEFAULT) {
                this.setState({
                    ...this.state,
                    loadingChatHistory: REST_DEFAULT
                });
            }
        } else {
            if (this.state.loadingChatHistory === REST_DEFAULT && this.props.chatHistory === null) {
                this.setState({
                    ...this.state,
                    loadingChatHistory: REST_FAILURE
                }, () => this.statusCallback(REST_FAILURE));
            } else if (this.props.chatHistory !== null && this.state.newChat === null && (this.state.loadingChatHistory === REST_DEFAULT
                    || this.state.loadingChatHistory === REST_SUCCESS && this.props.chatHistory.length !== this.state.chatHistory.length)) {
                let newChatHistory = (Array.isArray(this.props.chatHistory)) ? this.props.chatHistory.slice() : [];
                let newChat = null;
                let newChatId = null;
                if (this.props.chatWith !== null) {
                    // search for the conversation an open it. If not exits create it
                    let chatWithConversation = this.props.chatHistory.find(chat => chat.userIdFrom === this.props.chatWith || chat.userIdTo === this.props.chatWith);
                    if (chatWithConversation) {
                        // select the conversation
                        this.setState({
                            ...this.state,
                            newChat: newChat,
                            selectedChatId: chatWithConversation.chatId,
                            loadingChatHistory: REST_SUCCESS,
                            currentChat: chatWithConversation,
                            chatHistory: newChatHistory
                        }, () => {
                            this.props.recivedChatWith();
                            this.hadleChatClick(chatWithConversation, REST_SUCCESS);

                        });
                    } else {
                        newChatId = NEW_CHAT_ID;
                        newChat = {
                            chatId: newChatId,
                            userIdFrom: this.props.currentUser.userId,
                            userNickFrom: this.props.currentUser.userNick,
                            userAvatarUrlFrom: this.props.currentUser.userAvatarUrl,
                            userIdTo: this.props.chatWith,
                            userNickTo: this.props.userPreview.userNick,
                            userAvatarUrlTo: this.props.userPreview.userAvatarUrl,
                            chatDateTime: new Date(),
                            chatVisible: 'B'
                        };
                        // create it
                        newChatHistory.unshift(newChat);
                        this.setState({
                            ...this.state,
                            newChat: newChat,
                            selectedChatId: newChatId,
                            loadingChatHistory: REST_SUCCESS,
                            currentChat: newChat,
                            chatHistory: newChatHistory
                        }, () => {
                            this.props.recivedChatWith();
                            this.hadleChatClick(newChat, REST_SUCCESS);
                        });
                    }
                } else {
                    this.setState({
                        ...this.state,
                        loadingChatHistory: REST_SUCCESS,
                        chatHistory: newChatHistory
                    }, () => {
                        if (newChatHistory.length > 0) {
                            this.hadleChatClick(null, REST_SUCCESS);
                        } else {
                            this.hadleChatClick(null, REST_EMPTY);
                        }
                    });
                }
            }
        }
    }

    isLoadingProcess(action) {
        return this.props.loadingProcesses.includes(action)
    }

    acceptDeleteChat(deleteChatId) {
        if (deleteChatId === NEW_CHAT_ID) {
            let newChatHistory = this.state.chatHistory.filter(c => +c.chatId !== NEW_CHAT_ID);
            this.setState({
                ...this.state,
                newChat: null,
                selectedChatId: null,
                currentChat: null,
                chatHistory: newChatHistory
            });
        }
        this.props.deleteChat(deleteChatId, this.props.currentUserId);
    }

    hadleDeleteChatClick(chatId, evt) {
        this.setState({
            ...this.state,
            deleteChatId: chatId,
            openContinueDeleteChat: true
        });
    }

    handleCloseContinueModal(deleteBoolean) {
        if (deleteBoolean && this.state.deleteChatId !== null) {
            this.acceptDeleteChat(this.state.deleteChatId);
        }
        this.setState({
            ...this.state,
            deleteChatId: null,
            openContinueDeleteChat: false
        });
    }

    hadleChatClick(chat, status, evt) {
        this.setState({
            ...this.state,
            selectedChatId: (chat !== null) ? chat.chatId : null,
            currentChat: chat
        });

        // Calback onClickChat
        if (this.props.onClickSelectChat !== undefined && typeof this.props.onClickSelectChat === "function") {
            this.props.onClickSelectChat(chat, status);
        }
    }

    statusCallback(status) {
        // Calback onClickChat
        if (this.props.statusCallback !== undefined && typeof this.props.statusCallback === "function") {
            this.props.statusCallback(status);
        }
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
                    <div>
                        <Paper elevation={16} className="chatConversationPaper">
                            <List className="">
                                {this.state.chatHistory.map((chat) => (
                                <ListItem key={chat.chatId} 
                                    onClick={(evt) => this.hadleChatClick(chat, REST_SUCCESS, evt)}
                                    className={(this.state.selectedChatId === chat.chatId) ? "chatHistorySelectedItem" : "chatHistoryItem"}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <IconButton onClick={(evt) => this.handleAvatarClick(evt, chat.userId)}>
                                                <Avatar src={(chat.userIdFrom !== this.props.currentUserId) 
                                                        ? (chat.userAvatarUrlFrom !== null) ? chat.userAvatarUrlFrom : avatarDefault 
                                                        : (chat.userAvatarUrlTo !== null) ? chat.userAvatarUrlTo : avatarDefault } 
                                                />
                                            </IconButton>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={(chat.userIdFrom !== this.props.currentUserId) ? chat.userNickFrom : chat.userNickTo } 
                                        secondary={parseDate(chat.chatDateTime, this.props.appLanguage)} 
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete" onClick={this.hadleDeleteChatClick.bind(this, chat.chatId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                ))}
                            </List>
                        </Paper>
                        <ContinueModal open={this.state.openContinueDeleteChat} text={LS.getStringMsg('continue.delete.chat', 'Delete?')} closeCallback={this.handleCloseContinueModal.bind(this)} />
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
        chatHistory: appState.getChatHistory(state),
        chatWith: appState.getChatWith(state),
        loadingProcesses: appState.getLoadingProcesses(state),
        succeedProcesses: appState.getSucceedProcesses(state),
        failedProcesses: appState.getFailedProcesses(state)
    }),
    (dispatch) => ({
        fetchChatHistory: (userId) => dispatch(fetchChatHistory(userId)),
        recivedChatWith: () => dispatch(recivedChatWith()),
        deleteChat: (chatId, userId) => dispatch(deleteChat(chatId, userId))
    })
)(ChatView);