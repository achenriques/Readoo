import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchChatMessages, reportErrorMessage, actionTypes } from '../../app_state/actions';
import * as appState from '../../app_state/reducers/index';
import io from 'socket.io-client';
import { parseDate, compareArrays } from '../../utils/appUtils';
import RootRef from '@material-ui/core/RootRef';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import LS from '../LanguageSelector';
import avatarDefault from '../../resources/avatarDefault.svg';
import { NEW_CHAT_ID, CHAT_MESSAGES_EMPTY, SERVER_ENDPOINT, 
    REST_FAILURE, REST_DEFAULT, REST_SUCCESS } from '../../constants/appConstants';
import '../../styles/Chat.css';

class MessagesView extends Component {

    initialState = {
        currentChat: null,
        userIdTo: null,
        chatMessages: [],
        messageText: "",
        isNewChat: false,
        socketId: null,
        loadingChatMessages: REST_DEFAULT
    };

    constructor(props) {

        super(props);
        this.gridChatRef = React.createRef();
        this.state = { 
            ...this.initialState
        };
    };

    socketListeners(chat) {
        // open socket connection
        if (this.socket !== undefined && !this.socket.disconnected) {
            this.socket.close();
        }
        this.socket = io.connect(SERVER_ENDPOINT, {
            path: '/chat',
            query: { from: chat.userIdFrom, to: chat.userIdTo },
            reconnectionDelayMax: 10000
        });
        this.socket.on("socketId", id => {
            if (this.state.socketId !== null) {
                this.setState({
                    ...this.state,
                    socketId: id
                });
            }
        });
        this.socket.on("newChatId", chatId => {
            if (this.state.currentChat.chatId < 0 && +chatId > 0) {
                this.setState({
                    ...this.state,
                    currentChat: {
                        ...this.state.currentChat,
                        chatId: chatId
                    }
                });
            }
        });
        // socket is listening for new messages
        this.socket.on("message", message => {
            if (message && message.chatId === this.state.currentChat.chatId && message.userIdFrom !== this.props.currentUserId) {
                let newChatMessages = this.props.chatMessages.slice();
                newChatMessages.push(message);
                this.setState({
                    ...this.state,
                    chatMessages: newChatMessages
                });
            }
        });

        // manage socket connection errors
        this.socket.on("error", () => {
            this.props.reportErrorMessage(LS.getStringMsg('error.sendig.message', 'An error has occurred!'));
        });
        this.socket.on("connect_error", () => {
            this.props.reportErrorMessage(LS.getStringMsg('error.sendig.message', 'An error has occurred!'));
        });
    }

    componentDidMount() {
        let chat = this.props.chat;
        if (chat && chat.chatId !== null) {
            let userIdTo = chat.userIdTo;
            if (chat.chatId > 0) {
                this.setState({
                    ...this.state,
                    currentChat: chat,
                    userIdTo: userIdTo,
                }, () => this.props.fetchChatMessages(this.props.chat.chatId, this.props.currentUserId));
            } else {
                this.setState({
                    ...this.state,
                    currentChat: chat,
                    userIdTo: userIdTo,
                    loadingChatMessages: REST_SUCCESS,
                    isNewChat: true
                }, () => this.socketListeners(chat));
            }
        } else {
            this.setState({
                ...this.state,
                loadingChatMessages: REST_FAILURE
            });
        }
    }

    componentWillUnmount() {
        // close socket connection
        if (this.socket !== undefined) {
            this.socket.close();
        }
    }

    componentDidUpdate() {
        if (this.isLoadingProcess(actionTypes.FETCH_CHAT_MESSAGES)) {
            if (!this.state.loadingChatMessages === REST_DEFAULT) {
                this.setState({
                    ...this.state,
                    loadingChatMessages: REST_DEFAULT
                });
            }
        } else {
            if (this.state.loadingChatMessages === REST_DEFAULT && this.props.chatMessages === null) {
                this.setState({
                    ...this.state,
                    loadingChatMessages: REST_FAILURE
                });
            } else if (this.state.loadingChatMessages === REST_DEFAULT && !compareArrays(CHAT_MESSAGES_EMPTY, this.props.chatMessages)) { 
                let newChatMessages = this.props.chatMessages.slice();
                this.setState({
                    ...this.state,
                    chatMessages: newChatMessages,
                    currentChat: this.props.chat,
                    loadingChatMessages: REST_SUCCESS
                }, () => this.socketListeners(this.props.chat));
            } else if (this.props.chat !== undefined 
                        && this.state.currentChat !== null && this.props.chat.chatId !== this.state.currentChat.chatId) {
                if (!this.state.isNewChat || this.state.currentChat.chatId > NEW_CHAT_ID) {
                    // if not is an assignation of a new id to a new chat...
                    // fetch next messages...
                    this.setState({
                        ...this.state,
                        chatMessages: [],
                        currentChat: this.props.chat,
                        messageText: "",
                        loadingChatMessages: REST_DEFAULT
                    }, () => this.props.fetchChatMessages(this.props.chat.chatId, this.props.currentUserId));
                }
            }
        }        
    }

    isLoadingProcess(action) {
        return this.props.loadingProcesses.includes(action)
    }

    oChangeInput(evt) {
        const value = evt.target.value;
        const name = evt.target.name;

        this.setState({
            ...this.state,
            [name]: value
        });
    }

    sendMessage(evt) {
        let newMessage = this.state.messageText.trim();
        if (newMessage.length) {
            this.gridChatRef.current.scrollTo(0, this.gridChatRef.current.scrollHeight);
            let messages = this.state.chatMessages.slice();
            let newMessage = {
                chatId: this.state.currentChat.chatId,
                userId: this.props.currentUserId,
                message: this.state.messageText,
                messageDateTime: new Date()
            };
            messages.push(newMessage);            
            this.setState({
                ...this.state,
                chatMessages: messages,
                messageText: ""
            });
            // send message to other user...
            this.socket.emit("newMessage", {
                ...newMessage,
                userIdFrom: this.props.currentUserId,
                userIdTo: this.state.userIdTo,
            });
        }
    }

    inputEnterPress(evt) {
        // If user press ENTER then Send
        if (evt.charCode===13 && evt.ctrlKey === false) {
            evt.stopPropagation();
            evt.preventDefault();
            this.sendMessage(evt);
        }
    }

    render = () => {
        switch (this.state.loadingChatMessages) {
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
                    <Paper elevation={16} className="chatMessagesPaper">
                        <Grid container
                            spacing={8} 
                            direction="column-reverse"
                            justify="flex-start"
                            alignItems="flex-start"
                            wrap="nowrap"
                            className="chatMessagesColumnGrid"
                        >
                            <Grid item sm={1} className="chatMessagesTextFieldGrid">
                                <Grid container spacing={24} wrap="nowrap" className="chatMessagesTextField">
                                    <Grid item sm={11}>
                                        <TextField
                                            label={<LS msgId='message' defaultMsg='Message...' params={ [(this.state.messageText !== undefined) ? 250 - this.state.messageText.length : 250] } /> } 
                                            inputProps={{maxLength: "250"}}
                                            name="messageText"
                                            multiline
                                            rowsMax="3"
                                            value={this.state.messageText}
                                            fullWidth={true}
                                            onChange={this.oChangeInput.bind(this)}
                                            onKeyPress={this.inputEnterPress.bind(this)}
                                        />
                                    </Grid>
                                    <Grid item sm={1} >
                                        <IconButton 
                                            color="primary"
                                            disabled={this.state.messageText === ""}
                                            onClick={(evt) => {this.sendMessage(evt)}} 
                                            className="styleSendButton"
                                            style={{position: 'relative'}}
                                        >
                                            <Send/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <RootRef rootRef={this.gridChatRef}>
                                <Grid item sm={11} className="chatMessagesColumnInsideGrid">
                                    <Grid container
                                        direction="column"
                                        justify="flex-end"
                                        alignItems="flex-start"
                                        wrap="nowrap"
                                        className="chatMessageItemsGrid"
                                    >
                                    {this.state.chatMessages.map((msg, index, list) => (
                                        <Grid item key={index} className="chatMessageItemGrid">
                                            <Grid container 
                                                key={index}
                                                spacing={8} 
                                                direction={(+msg.userId === this.state.currentChat.userIdFrom) ? "row-reverse": "row"}
                                                alignItems="flex-end"
                                                wrap="nowrap"
                                                className="chatMessageGrid"
                                            >
                                                <Grid item sm={1}
                                                    zeroMinWidth
                                                    className={(+msg.userId === this.state.currentChat.userIdFrom) ? "chatMessageAvatar right" : "chatMessageAvatar left" }
                                                >
                                                    <span className="chatTimeSpan">{parseDate(msg.messageDateTime).split(' ')[1]}</span>
                                                    <br/>
                                                    <span className="chatDateSpan">{parseDate(msg.messageDateTime).split(' ')[0]}</span>
                                                    <Avatar 
                                                        src={(+msg.userId === this.state.currentChat.userIdFrom) 
                                                                    ? (this.state.currentChat.userAvatarUrlFrom) ? this.state.currentChat.userAvatarUrlFrom : avatarDefault
                                                                    : (this.state.currentChat.userAvatarUrlTo) ? this.state.currentChat.userAvatarUrlTo: avatarDefault }
                                                    />
                                                </Grid>
                                                <Grid item sm={10} xs={11}>
                                                    <p className={(+msg.userId === this.state.currentChat.userIdFrom) ? "chatMessageBubble right" : "chatMessageBubble left"}>
                                                        <span>{msg.message}</span>
                                                    </p>
                                                </Grid>
                                                <Grid item sm={1} xs={false} />
                                            </Grid>
                                        </Grid>
                                    ))}
                                    </Grid>
                                </Grid>
                            </RootRef>
                        </Grid>
                    </Paper>
                )
        }
    }
}

export default connect(
    (state) => ({
        currentUserId: appState.getUserId(state),
        chatHistory: appState.getChatHistory(state),
        chatMessages: appState.getChatMessages(state),
        chatWith: appState.getChatWith(state),
        loadingProcesses: appState.getLoadingProcesses(state),
        succeedProcesses: appState.getSucceedProcesses(state),
        failedProcesses: appState.getFailedProcesses(state)
    }),
    (dispatch) => ({
        fetchChatMessages: (chatId, userId) => dispatch(fetchChatMessages(chatId, userId)),
        reportErrorMessage: (errorMsg) => dispatch(reportErrorMessage(errorMsg))
    })
)(MessagesView);