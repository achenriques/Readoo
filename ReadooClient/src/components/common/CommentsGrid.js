import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCommentaries, fetchSubCommentaries, writeComment, sendComment, actionTypes } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Grid from '@material-ui/core/Grid';
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import Send from 'material-ui/svg-icons/content/send';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import SubCommentsGrid from './SubCommentsGrid';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import LS from '../LanguageSelector';
import avatarDefault from '../../resources/avatarDefault.svg';
import { parseInputText } from '../../utils/AppUtils';
import { DISPLAY_NONE, NUM_OF_COMENTARIES, REST_FAILURE, REST_SUCCESS, REST_DEFAULT } from '../../constants/appConstants';

class CommentsGrid extends Component {

    initialState = {
        loadedComment: REST_DEFAULT,
        bookCommentaries: [],
        currentBookId: null,
        commentFatherId: null,
        expandComment: null,
        loadMoreCount: 1
    }

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    componentDidMount() {
        if (this.props.bookId && this.props.bookId !== this.state.currentBookId) {
            let lastCommentaryDate = null;
            if (this.state.bookCommentaries && this.state.bookCommentaries.length) {
                lastCommentaryDate = new Date(Math.max.apply(null, this.state.bookCommentaries.map(function(e) {
                    return new Date(e.date);
                  })));
            }
            // todo date
            if (this.props.commentFatherId === null) {
                this.props.fetchCommentaries(this.props.bookId, NUM_OF_COMENTARIES, lastCommentaryDate);
            } else {
                this.props.fetchSubCommentaries(this.props.bookId, this.props.commentFatherId, NUM_OF_COMENTARIES, lastCommentaryDate);
            }
            // Set first state
            this.setState({
                ...this.state,
                loadedComment: REST_DEFAULT,
                currentBookId: this.props.bookId,
                commentFatherId: this.props.commentFatherId,
            });
        }
    }

    componentDidUpdate() {
        // This props contains current props.
        let isSubs = this.props.commentFatherId !== null;
        if (this.props.bookId && this.props.bookId !== this.state.currentBookId) {
            let lastCommentaryDate = null;
            if (this.state.bookCommentaries && this.state.bookCommentaries.length) {
                lastCommentaryDate = new Date(Math.max.apply(null, this.state.bookCommentaries.map(function(e) {
                    return new Date(e.date);
                  })));
            }
            let nextState = {
                ...this.state,
                loadedComment: REST_DEFAULT,
                currentBookId: this.props.bookId
            };
            if (isSubs) {
                nextState["expandSubs_" + this.state.commentFatherId] = undefined;
            }
            this.props.fetchCommentaries(this.props.bookId, NUM_OF_COMENTARIES, lastCommentaryDate);
            this.setState(nextState);
        } else if (!isSubs) {
            if (this.state.loadedComment === REST_DEFAULT && !this.isLoading() && this.props.shownCommentaries === null) {
                this.setState({
                    ...this.state,
                    loadedComment: REST_FAILURE,
                    bookCommentaries: null
                });
            } else if (this.state.loadedComment === REST_DEFAULT && !this.isLoading() && this.props.shownCommentaries !== null) {
                this.setState({
                    ...this.state,
                    loadedComment: REST_SUCCESS,
                    bookCommentaries: this.props.shownCommentaries
                })
            } else if (this.state.loadedComment === REST_SUCCESS && this.props.shownCommentaries.length !== this.state.bookCommentaries.length) {
                this.setState({
                    ...this.state,
                    bookCommentaries: this.props.shownCommentaries
                })
            }
        } else {
            if (this.state.loadedComment === REST_DEFAULT && !this.isLoadingSubs() && this.props.shownSubCommentaries === null) {
                this.setState({
                    ...this.state,
                    loadedComment: REST_FAILURE,
                    bookCommentaries: null
                });
            } else if (this.state.loadedComment === REST_DEFAULT && !this.isLoadingSubs() && this.props.shownSubCommentaries !== null) {
                this.setState({
                    ...this.state,
                    loadedComment: REST_SUCCESS,
                    bookCommentaries: this.props.shownSubCommentaries
                })
            } else if (this.state.loadedComment === REST_SUCCESS && this.props.shownSubCommentaries.length !== this.state.bookCommentaries.length) {
                this.setState({
                    ...this.state,
                    bookCommentaries: this.props.shownSubCommentaries
                })
            }
        }
    }

    radomColor () {
        let ran = Math.round(Math.random() * 5);
        
        switch (ran) {
            case 0:
                return 'rgba(159, 159, 237, 0.8)';
        
            case 1:
                return 'rgba(242, 223, 215, 0.8)';

            case 2:
                return 'rgba(254, 249, 170, 0.8)';

            case 3:
                return 'rgba(72, 190, 255, 0.8)';

            case 4:
                return 'rgba(105, 234, 127, 0.8)';
            default:
                return 'rgba(255, 204, 102 , 0.8)';
        }
    }

    isLoading() {
        return this.props.loadingProcesses.includes(actionTypes.FETCH_COMMENTARIES);
    }

    isLoadingSubs() {
        return this.props.loadingProcesses.includes(actionTypes.FETCH_SUB_COMMENTARIES);
    }

    isSendingComment() {
        return this.props.loadingProcesses.includes(actionTypes.SEND_COMMENTARY);
    }

    inputEnterPress(textFieldId, commentFatherId, evt) {
        // If user press ENTER then Send
        if (evt.charCode===13 && evt.ctrlKey === false) {
            evt.stopPropagation();
            return this.sendCommentary(evt, commentFatherId, this.state.currentBookId, textFieldId);
        }
    }

    changeNewCommentaries (textFieldId, commentFatherId, evt) {
        if (textFieldId && evt && evt.target.value !== "\n") {
            let nameOfErrorParam = "commentError_" + textFieldId;
            let nameOfNewParam = "newCommentary_" + textFieldId;
            this.setState({
                ...this.state,
                [nameOfNewParam]: evt.currentTarget.value,
                [nameOfErrorParam]: undefined
            });
        }
    }

    getNewCommentaryIndex () {
        let toRet = -1;
        if (this.props.shownCommentaries !== null) {
            toRet = this.props.shownCommentaries.reduce((accumulator, currentValue) => (currentValue.commentId > accumulator) ? currentValue.commentId : accumulator, toRet);
        }
        if (this.props.shownSubCommentaries !== null) {
            toRet = this.props.shownSubCommentaries.reduce((accumulator, currentValue) => (currentValue.commentId > accumulator) ? currentValue.commentId : accumulator, toRet);
        }
        return toRet + 1;
    }

    sendCommentary (evt, commentFatherId, bookId, textFieldId) {
        evt.stopPropagation();
        let nameOfParam = "newCommentary_" + textFieldId;
        if (this.state[nameOfParam]) {
            let commentText = parseInputText(this.state[nameOfParam]);
            if (commentText.length) {
                let newCommentaryIndex = this.getNewCommentaryIndex();
                // Build commentary
                let newComment = {
                    commentId: newCommentaryIndex, 
                    commentText: commentText, 
                    userId: this.props.currentUser.userId,
                    userNick: this.props.currentUser.userNick,
                    userAvatarUrl: this.props.currentUser.userAvatarUrl, 
                    bookId: bookId, 
                    date: new Date(),
                    commentFatherId: commentFatherId,
                };
                // Write commetn in the app
                this.props.writeComment(newComment);
                // Send commentary to the server
                this.props.sendCommentary(newComment);
                // Clear text field
                this.setState({
                    ...this.state,
                    [nameOfParam]: ""
                })
            } else {
                let nameOfErrorParam = "commentError_" + textFieldId;
                let statusText = LS.getStringMsg('error.empty.commentary', 'Text can not be empty!');
                this.setState({
                    ...this.state,
                    [nameOfErrorParam]: statusText
                });
            }
        }
    }

    handleCollapseSubs (evt, commentaryId) {
        console.log("I made click on show subcommentaries of: " + commentaryId);
        if (commentaryId !== null) {
            if (this.state.expandComment === commentaryId) {
                // Close the expand
                this.setState({
                    ...this.state,
                    expandComment: null
                });
            } else {
                this.setState({
                    ...this.state,
                    expandComment: commentaryId
                });
            }
        }
    }

    handleLoadMore (evt) {
        if (this.state.commentFatherId === null) {
            this.props.fetchCommentaries(this.state.currentBookId, 
                    NUM_OF_COMENTARIES, this.state.bookCommentaries[this.state.bookCommentaries.length - 1].date, true);
        } else {
            this.props.fetchSubCommentaries(this.state.currentBookId, this.state.commentFatherId, 
                    NUM_OF_COMENTARIES, this.state.bookCommentaries[this.state.bookCommentaries.length - 1].date, true);
        }
        this.setState({
            ...this.state,
            loadMoreCount: this.state.loadMoreCount + 1
        });
    }

    handleAvatarClick (evt, userId) {
        evt.stopPropagation();
        console.log("I made click on avatar: " + userId);
    }


    render() {
        switch (this.state.loadedComment) {
            case REST_FAILURE:
                return (
                    <div className="loadingCommentaries">
                        <h3><LS msgId='commentaries.load.error' defaultMsg='Something failed while fetching commentaries. Sorry!'/></h3>
                    </div>
                )
            case REST_DEFAULT:
                return (
                    <div className="loadingCommentaries">
                        <h3><LS msgId='loading' defaultMsg='Loading...'/></h3>
                    </div>
                )

            case REST_SUCCESS:
                if (this.state.bookCommentaries.length) {
                    return (
                        <div className="styleRoot">
                            <GridList
                                cols={2}
                                rows={1.5}
                                cellHeight='auto'
                                padding={15}
                                className="styleGridList"
                            >
                            {this.state.bookCommentaries.map((commentary) => (
                                <Paper key={commentary.commentId} elevation={4} variant="outlined" className="commentMargin">
                                    <GridListTile
                                        key={commentary.commentId}
                                        style={{heigth: '30px'}}
                                        cols={1}
                                        rows={1}
                                    >
                                        <GridListTileBar
                                            title={<h4><span className="commentaryNickName">{commentary.userNick}</span></h4>}
                                            titlePosition="top"
                                            actionPosition="left"
                                            actionIcon={<IconButton onClick={(evt) => this.handleAvatarClick(evt, commentary.userId)}><Avatar src={(commentary.userAvatarUrl !== null) ? commentary.userAvatarUrl : avatarDefault} /></IconButton>}
                                            className="commentListTileBar"
                                        />
                                        <Grid container spacing={24}>
                                            <Grid item sm={1}>
                                                <div className="verticalDivider"/>
                                            </Grid>
                                            <Grid item sm={11}>
                                                <div>
                                                    <div className='divCommentaries'> {commentary.commentText} </div>
                                                    {(commentary.nSubCommentaries > 0)
                                                        ? ( <div className='divShowAnswers'>
                                                                <Button 
                                                                    disableRipple
                                                                    disabled={(this.isLoadingSubs())}
                                                                    size="small" 
                                                                    variant='flat' 
                                                                    onClick={(evt) => this.handleCollapseSubs(evt, commentary.commentId)}
                                                                >
                                                                    {(this.state.expandComment === commentary.commentId) ? <LS msgId='hide.subcommentaries' defaultMsg='Hide subcommentaries'/> : <LS msgId='show.subcommentaries' defaultMsg='Show subcommentaries'/>}
                                                                    {(this.state.expandComment === commentary.commentId) ? (this.isLoadingSubs()) ? <CircularProgress className="loadingIcon" size='20' /> : <ExpandLessIcon />: <ExpandMoreIcon />}
                                                                </Button >
                                                                <Collapse in={this.state.expandComment === commentary.commentId} timeout="auto" direction="right" mountOnEnter unmountOnExit>
                                                                    <div className="commentBackground">
                                                                        <SubCommentsGrid bookId={this.state.currentBookId} commentFatherId={commentary.commentId}/>
                                                                    </div>                        
                                                                </Collapse>
                                                            </div>) : (<div/>)
                                                    }
                                                    {(this.state.commentFatherId === null)
                                                        ? (<div className="divCommentaryAnswerSubCommentary">
                                                                <Grid container spacing={24}>
                                                                    <Grid item sm={10}>
                                                                        <TextField
                                                                            error={this.state["commentError_" + commentary.commentId]  !== undefined}
                                                                            helperText={(this.state["commentError_" + commentary.commentId]  !== undefined) ? this.state["commentError_" + commentary.commentId]: ""}
                                                                            label={ <LS msgId='write.commentary.answer' defaultMsg='Write an answer...' params={ [(this.state["newCommentary_" + commentary.commentId] !== undefined) ? 140 - this.state["newCommentary_" + commentary.commentId].length : 140] } /> } 
                                                                            inputProps={{maxLength: "140"}}
                                                                            multiline
                                                                            rowsMax="2"
                                                                            value={this.state["newCommentary_" + commentary.commentId]}
                                                                            fullWidth={true}
                                                                            onChange={this.changeNewCommentaries.bind(this, "" + commentary.commentId, commentary.commentId)}
                                                                            onKeyPress={this.inputEnterPress.bind(this, "" + commentary.commentId, commentary.commentId)}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item sm={1}>
                                                                        <IconButton 
                                                                            color="primary" 
                                                                            disabled={this.isSendingComment()}
                                                                            onClick={(evt) => {this.sendCommentary(evt, commentary.commentId, this.props.bookId, "" + commentary.commentId)}} 
                                                                            className="styleSendButton"
                                                                        >
                                                                            <Send/>
                                                                        </IconButton>
                                                                    </Grid>
                                                                </Grid>
                                                            </div>)
                                                        : (<div/>)
                                                    }
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </GridListTile>
                                </Paper>
                            ))}
                            </GridList>
                            {(this.state.commentFatherId === null)
                                ? (<div className="divCommentaryAnswer">
                                        <Grid container spacing={24}>
                                            <Grid item sm={10}>
                                                <TextField
                                                    error={this.state["commentError_new"] !== undefined}
                                                    helperText={(this.state["commentError_new"]  !== undefined) ? this.state["commentError_new"]: ""}
                                                    label={ <LS msgId='write.commentary' defaultMsg='Write a great commentary, its your time!' params={ [(this.state["newCommentary_new"] !== undefined) ? 140 - this.state["newCommentary_new"].length : 140] } /> } 
                                                    inputProps={{maxLength: "140"}}
                                                    multiline
                                                    rowsMax="2"
                                                    value={this.state["newCommentary_new"]}
                                                    fullWidth={true}
                                                    onChange={this.changeNewCommentaries.bind(this, "new", null)}
                                                    onKeyPress={this.inputEnterPress.bind(this, "new", null)}
                                                />
                                            </Grid>
                                            <Grid item sm={1} style={{position: 'relative'}}>
                                                <IconButton 
                                                    color="primary"
                                                    disabled={this.isLoading()}
                                                    onClick={(evt) => {this.sendCommentary(evt, null, this.props.bookId, "new")}} 
                                                    className="styleSendButton"
                                                >
                                                    <Send/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </div>)
                                : (<div/>)
                            }
                            <p>
                            <Button 
                                disableRipple 
                                disabled={(this.isLoading() || this.isLoadingSubs())}
                                size="small" 
                                variant='flat'
                                style={(this.state.bookCommentaries.length >= NUM_OF_COMENTARIES * this.state.loadMoreCount) ? {} : (this.isLoading() || this.isLoadingSubs()) ? {} : DISPLAY_NONE}
                                onClick={(evt) => this.handleLoadMore(evt)}
                            >
                                {(this.state.commentFatherId === null) ? <LS msgId='search.more.commentaries' defaultMsg='Search more'/> : <LS msgId='search.more.subcommentaries' defaultMsg='Show more'/>}
                                {(this.isLoading() || this.isLoadingSubs()) ? <CircularProgress className="loadingIcon" size='20' /> : <ExpandMoreIcon />}
                            </Button >
                            </p>
                        </div>
                    );
                }

            default:
                if (this.props.bookId > 0) {
                    return (
                        <div>
                            <h3 className="marginNoCommentaries" ><LS msgId='no.commentaries.yet' defaultMsg='No commentaries yet. Write a commentary, its your time!' /></h3>
                            <div className="divCommentaryAnswer">
                                <Grid container spacing={24}>
                                    <Grid item sm={10}>
                                        <TextField
                                            error={this.state["commentError_new"] !== undefined}
                                            helperText={(this.state["commentError_new"]  !== undefined) ? this.state["commentError_new"]: ""}
                                            label={ <LS msgId='write.commentary' defaultMsg='Write a great commentary, its your time!' params={ [(this.state["newCommentary_new"] !== undefined) ? 140 - this.state["newCommentary_new"].length : 140] } /> } 
                                            inputProps={{maxLength: "140"}}
                                            multiline
                                            rowsMax="2"
                                            value={this.state["newCommentary_new"]}
                                            fullWidth={true}
                                            onChange={this.changeNewCommentaries.bind(this, "new", null)}
                                            onKeyPress={this.inputEnterPress.bind(this, "new", null)}
                                        />
                                    </Grid>
                                    <Grid item sm={1} style={{position: 'relative'}}>
                                        <IconButton 
                                            color="primary"
                                            disabled={this.isSendingComment()}
                                            onClick={(evt) => {this.sendCommentary(evt, this, null, this.props.bookId, "new")}} 
                                            className="styleSendButton"
                                        >
                                            <Send/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    );  
                } else {
                    return (
                        <h3 className="marginNoCommentaries" ><LS msgId='not.hire.jastel' defaultMsg='Do not hire Jastel!' /></h3>
                    )
                }
        }
    }
}

export default connect(
    (state) => ({
        currentUserId: appState.getUserId(state),
        currentUser: appState.getUser(state),
        shownCommentaries: appState.getCommentaries(state),
        shownSubCommentaries: appState.getSubCommentaries(state),
        loadingProcesses: appState.getLoadingProcesses(state)
    }),
    (dispatch) => ({
        fetchCommentaries: (bookId, nCommentaries, lastDate, fetchMore) => dispatch(fetchCommentaries(bookId, nCommentaries, lastDate, fetchMore)),
        fetchSubCommentaries: (bookId, fatherCommentaryId, nCommentaries, lastDate, fetchMore) => dispatch(fetchSubCommentaries(bookId, fatherCommentaryId, nCommentaries, lastDate, fetchMore)),
        writeComment: (newComment) => dispatch(writeComment(newComment)),
        sendCommentary: (newComment) => dispatch(sendComment(newComment))
    })
)(CommentsGrid);
