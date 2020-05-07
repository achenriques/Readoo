import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCommentaries, sendComment, actionTypes } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Grid from '@material-ui/core/Grid';
// TODO change GridList
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Send from 'material-ui/svg-icons/content/send';
// FIXME borrar start
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import LS from '../LanguageSelector';
import avatarDefault from '../../resources/avatarDefault.svg';
import { NUM_OF_COMENTARIES, REST_FAILURE, REST_SUCCESS, REST_DEFAULT } from '../../constants/appConstants';

class CommentsGrid extends Component {

    initialState = {
        loadedComment: REST_DEFAULT,
        bookCommentaries: [],
        currentBookId: null,
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
            this.props.fetchCommentaries(this.props.bookId, NUM_OF_COMENTARIES, lastCommentaryDate);
            this.setState({
                ...this.state,
                loadedComment: REST_DEFAULT,
                currentBookId: this.props.bookId
            });
        }
    }

    componentDidUpdate() {
        // This props contains current props.
        if (this.props.bookId && this.props.bookId !== this.state.currentBookId) {
            let lastCommentaryDate = null;
            if (this.state.bookCommentaries && this.state.bookCommentaries.length) {
                lastCommentaryDate = new Date(Math.max.apply(null, this.state.bookCommentaries.map(function(e) {
                    return new Date(e.date);
                  })));
            }
            // todo date
            this.props.fetchCommentaries(this.props.bookId, NUM_OF_COMENTARIES, lastCommentaryDate);
            this.setState({
                ...this.state,
                loadedComment: REST_DEFAULT,
                currentBookId: this.props.bookId
            });
        } else if (this.state.loadedComment === REST_DEFAULT && !this.isLoading() && this.props.shownCommentaries === null) {
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
        }
    }

    comentaries = [
        {   
            commentId: 1,
            userName: "Minervo",
            commentaries: "Ou la la!",
            subCommentaries: []
        },
        {   
            commentId: 2,
            userName: "Minervo",
            commentaries: "Ou la la!",
            subCommentaries: []
        },
        {   
            commentId: 3,
            userName: "Minervo",
            commentaries: "Ou la lelo!",
            subCommentaries: [ 
                {
                    commentId: 13,
                    userName: "Minervo",
                    commentaries: "Me gusta lo que has dicho",
                    subCommentaries: []
                },  {
                    commentId: 14,
                    userName: "Minerv1",
                    commentaries: "Adios vella",
                    subCommentaries: []
                } 
            ]
        },
        {   
            commentId: 4,
            userName: "Minervo",
            commentaries: "Ou la la!",
            subCommentaries: []
        },
        {   
            commentId: 5,
            userName: "Minervo",
            commentaries: "Ou la la!",
            subCommentaries: []
        },
        {   
            commentId: 6,
            userName: "Minervo",
            commentaries: "Ou la la!",
            subCommentaries: []
        },
    ]

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

    changeNewCommentaries (textFieldId, evt) {
        if (textFieldId && evt) {
            let nameOfErrorParam = "commentError_" + textFieldId;
            let nameOfNewParam = "newCommentary_" + textFieldId;
            this.setState({
                ...this.state,
                [nameOfNewParam]: evt.currentTarget.value,
                [nameOfErrorParam]: undefined
            });
        }
    }

    sendCommentary (evt, commentFatherId, bookId, textFieldId) {
        let nameOfParam = "newCommentary_" + textFieldId;
        if (this.state[nameOfParam]) {
            let commentText = this.state[nameOfParam].trim();
            if (commentText.length) {
                // Send commentary to the server
                this.props.sendCommentary(commentFatherId, bookId, this.props.currentUserId, commentText);
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

    showSubcommentaries (commentaries) {
        if (commentaries && commentaries.subCommentaries && commentaries.subCommentaries.length) {
            return (
                <div>
                    <div className="commentariesAnswer">
                        <LS msgId='answer' defaultMsg='Answers' params={[(commentaries.subCommentaries.length > 1)? 's': '']}/>
                    </div>
                    <div className="styleChildren">
                        <GridList
                            cols={2}
                            rows={1.5}
                            cellHeight='auto'
                            padding={15}
                            className="styleChildrenList"
                        >
                        {commentaries.subCommentaries.map((subCommentary) => (
                            <Paper key={subCommentary.commentId} elevation={4} variant="outlined" className="commentMargin">
                                <GridListTile
                                    key={subCommentary.commentId}
                                    style={{heigth: '30px'}}
                                    cols={1}
                                    rows={1}
                                >
                                    <GridListTileBar
                                        title={<h4><span className="commentaryNickName">{subCommentary.userNick}</span></h4>}
                                        titlePosition="top"
                                        actionPosition="left"
                                        actionIcon={<IconButton><Avatar src={(subCommentary.userAvatarUrl !== null) ? subCommentary.userAvatarUrl : avatarDefault} /></IconButton>}
                                        className="commentListTileBar2"
                                    />
                                    <Grid container spacing={24}>
                                        <Grid item sm={1}>
                                            <div className="verticalDivider"/>
                                        </Grid>
                                        <Grid item sm={11}>
                                            <div>
                                                <div className='divCommentaries'> {subCommentary.commentText} </div>
                                                <Divider className="styleCommentSeparator"/>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </GridListTile>
                            </Paper>
                        ))}
                        </GridList>
                    </div>
                </div>
            )
        } else {
            return (<div/>)
        }
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
                                            actionIcon={<IconButton><Avatar src={(commentary.userAvatarUrl !== null) ? commentary.userAvatarUrl : avatarDefault} /></IconButton>}
                                            className="commentListTileBar"
                                        />
                                        <Grid container spacing={24}>
                                            <Grid item sm={1}>
                                                <div className="verticalDivider"/>
                                            </Grid>
                                            <Grid item sm={11}>
                                                <div>
                                                    <div className='divCommentaries'> {commentary.commentText} </div>
                                                    {this.showSubcommentaries(commentary)}
                                                    <div className="divCommentaryAnswerSubCommentary">
                                                        <Grid container spacing={24}>
                                                            <Grid item sm={10}>
                                                                <TextField
                                                                    error={this.state["commentError_" + commentary.commentId]  !== undefined}
                                                                    helperText={(this.state["commentError_" + commentary.commentId]  !== undefined) ? this.state["commentError_" + commentary.commentId]: ""}
                                                                    label={ <LS msgId='write.commentary.answer' defaultMsg='Write an answer...' params={ [(this.state["newCommentary_" + commentary.commentId] !== undefined) ? 140 - this.state["newCommentary_" + commentary.commentId].length : 140] } /> } 
                                                                    maxLength="140"
                                                                    multiline
                                                                    rowsMax="2"
                                                                    fullWidth={true}
                                                                    onChange={this.changeNewCommentaries.bind(this, "" + commentary.commentId)}
                                                                />
                                                            </Grid>
                                                            <Grid item sm={1}>
                                                                <IconButton 
                                                                    color="primary" 
                                                                    disabled={this.isLoading()}
                                                                    onClick={() => {this.sendCommentary(this, commentary.commentId, this.props.bookId, "" + commentary.commentId)}} 
                                                                    className="styleSendButton"
                                                                >
                                                                    <Send/>
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </GridListTile>
                                </Paper>
                            ))}
                            </GridList>
                            <div className="divCommentaryAnswer">
                                <Grid container spacing={24}>
                                    <Grid item sm={10}>
                                        <TextField
                                            error={this.state["commentError_new"] !== undefined}
                                            helperText={(this.state["commentError_new"]  !== undefined) ? this.state["commentError_new"]: ""}
                                            label={ <LS msgId='write.commentary' defaultMsg='Write a great commentary, its your time!' params={ [(this.state["newCommentary_new"] !== undefined) ? 140 - this.state["newCommentary_new"].length : 140] } /> } 
                                            maxLength="140"
                                            multiline
                                            rowsMax="2"
                                            fullWidth={true}
                                            onChange={this.changeNewCommentaries.bind(this, "new")}
                                        />
                                    </Grid>
                                    <Grid item sm={1} style={{position: 'relative'}}>
                                        <IconButton 
                                            color="primary"
                                            disabled={this.isLoading()}
                                            onClick={() => {this.sendCommentary(this, null, this.props.bookId, "new")}} 
                                            className="styleSendButton"
                                        >
                                            <Send/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </div>
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
                                            maxLength="140"
                                            multiline
                                            rowsMax="2"
                                            fullWidth={true}
                                            onChange={this.changeNewCommentaries.bind(this, "new")}
                                        />
                                    </Grid>
                                    <Grid item sm={1} style={{position: 'relative'}}>
                                        <IconButton 
                                            color="primary"
                                            disabled={this.isLoading()}
                                            onClick={() => {this.sendCommentary(this, null, this.props.bookId, "new")}} 
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
        shownCommentaries: appState.getCommentaries(state),
        loadingProcesses: appState.getLoadingProcesses(state)
    }),
    (dispatch) => ({
        fetchCommentaries: (bookId, nCommentaries, lastDate) => dispatch(fetchCommentaries(bookId, nCommentaries, lastDate)),
        sendCommentary: (commentFatherId, bookId, userId, commentaries) => dispatch(sendComment(commentFatherId, bookId, userId, commentaries)),
    })
)(CommentsGrid);
