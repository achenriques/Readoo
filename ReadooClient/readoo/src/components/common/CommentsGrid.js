import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCommentaries, sendComment } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Grid from '@material-ui/core/Grid';
// TODO change GridList
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
// FIXME borrar start
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import material_styles from './material_styles';
import { NUM_OF_COMENTARIES, REST_FAILURE, REST_SUCCESS, REST_DEFAULT } from '../../constants/appConstants';

class CommentsGrid extends Component {

    initialState = {
        loadedComment: null,  // 1 para loaded, -1 para error
        bookCommentaries: [],
        newCommentary: '',
        currentBookId: null
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        /* if(nextProps.getfetchcommentariesSuccess && REST_FAILURE === nextProps.getfetchcommentariesSuccess) {
            nextProps.recibidoFetchcommentaries();
            return ({
                ...prevState,
                loadedComment: REST_FAILURE
            });
        } */

        if (nextProps.bookId > 0 && nextProps.bookId != prevState.currentBookId/*&& prevState.loadedComment !== REST_DEFAULT*/) {
            let lastCommentaryDate = null;
            if (prevState.bookCommentaries && prevState.bookCommentaries.length) {
                lastCommentaryDate = new Date(Math.max.apply(null, prevState.bookCommentaries.map(function(e) {
                    return new Date(e.date);
                  })));
            }
            // todo date
            (nextProps.fetchCommentaries) && nextProps.fetchCommentaries(nextProps.bookId, NUM_OF_COMENTARIES, lastCommentaryDate);
            return ({ ...prevState, loadedComment: REST_DEFAULT, currentBookId: nextProps.bookId });
        } else
        if (nextProps.shownCommentaries == null) {
            return ({
                ...prevState,
                loadedComment: REST_FAILURE,
                bookCommentaries: null
            })
        } else
        if (nextProps.shownCommentaries && prevState.loadedComment === REST_DEFAULT) {
            return ({
                ...prevState.state,
                loadedComment: REST_SUCCESS,
                comentaries: nextProps.shownCommentaries
            })
        } else
        return null;
    }

    comentaries = [
        {   
            commentId: 1,
            userName: "Minervo",
            commentaries: "Ou la la!",
            subcommentaries: []
        },
        {   
            commentId: 2,
            userName: "Minervo",
            commentaries: "Ou la la!",
            subcommentaries: []
        },
        {   
            commentId: 3,
            userName: "Minervo",
            commentaries: "Ou la lelo!",
            subcommentaries: [ 
                {
                    commentId: 13,
                    userName: "Minervo",
                    commentaries: "Me gusta lo que has dicho",
                    subcommentaries: []
                },  {
                    commentId: 14,
                    userName: "Minerv1",
                    commentaries: "Adios vella",
                    subcommentaries: []
                } 
            ]
        },
        {   
            commentId: 4,
            userName: "Minervo",
            commentaries: "Ou la la!",
            subcommentaries: []
        },
        {   
            commentId: 5,
            userName: "Minervo",
            commentaries: "Ou la la!",
            subcommentaries: []
        },
        {   
            commentId: 6,
            userName: "Minervo",
            commentaries: "Ou la la!",
            subcommentaries: []
        },
    ]

    constructor(props) {
        super(props);
        this.state = { ...this.initilState };
    };

    colorAleatorio () {
        let ran = Math.round(Math.random() * 5);
        
        switch (ran) {
            case 0:
                return 'rgba(159, 159, 237, 0.8)'
                break;
        
            case 1:
                return 'rgba(242, 223, 215, 0.8)'
                break;

            case 2:
                return 'rgba(254, 249, 170, 0.8)'
                break;

            case 3:
                return 'rgba(72, 190, 255, 0.8)'
                break;

            case 4:
                return 'rgba(105, 234, 127, 0.8)'
                break;
            default:
                return 'rgba(255, 204, 102 , 0.8)'
                break;
        }
    }

    changeNewCommentaries (evt) {
        (evt) && this.setState({
            ...this.state,
            newCommentary: evt.currentTarget.value
        })
    }

    sendCommentary (evt, commentId, bookId) {
        if (this.state.newCommentary) {
            let commentText = this.state.newCommentary.trim();

            this.props.sendCommentary(commentId, bookId, this.props.currentUserId, 
                this.props.currentUser.userNick, commentText);
        }
    }

    showSubcommentaries (commentaries) {
        if (commentaries.subcommentaries.length) {
            return (
                <div>
                    <div className="commentariesAnswer">
                        {(commentaries.subcommentaries.length > 1)? 'Respuestas': 'Respuesta'}
                    </div>
                    <div style={material_styles.styleChildren} >
                        <GridList
                            cols={1}
                            cellHeight='auto'
                            padding={10}
                            style={material_styles.styleChildrenList}
                        >
                        {commentaries.subcommentaries.map((subComment) => (
                            <Paper elevation={1} >
                                <GridTile
                                    key={subComment.commentId}
                                    title={subComment.userName}
                                    actionIcon={<IconButton><StarBorder color="white" style={{width: '30px', heigth: '30px' }}><Avatar src="" /></StarBorder></IconButton>}
                                    actionPosition="left"
                                    titlePosition="top"
                                    titleBackground={"linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(0, 0, 0 , 0.3) 50%,rgba(0,0,0,0) 100%)"}
                                    titleStyle={{color: 'black', heigth: '30px'}}
                                    cols={1}
                                    rows={1}
                                >
                                    <div className='divCommentaries'> {subComment.commentaries} </div>
                                </GridTile>
                            </Paper>
                        ))}
                        </GridList>
                    </div>
                </div>
            )
        }
    }

    render() {
        switch (this.state.loadedComment) {
            case -1:
                return (
                    <div className="loadingCommentaries">
                        <h3>Error en la carga de comentaries puede ser un problema de red o fallo del servidor...</h3>
                    </div>
                )
            case 0:
                return (
                    <div className="loadingCommentaries">
                        <h3>Cargando...</h3>
                    </div>
                )

            case 1:
                if (this.state.comentaries.length) {
                    return (
                        <div style={material_styles.styleRoot} >
                            <GridList
                                cols={2}
                                rows={1.5}
                                cellHeight='auto'
                                padding={15}
                                style={material_styles.styleGridList}
                            >
                            {/*this.props.comentaries*/this.props.comentaries.map((commentaries) => (
                                <Paper elevation={4} >
                                    <GridTile
                                        key={commentaries.commentId}
                                        title={commentaries.userName}
                                        actionIcon={<IconButton><StarBorder color="white" ><Avatar src="" /></StarBorder></IconButton>}
                                        actionPosition="left"
                                        titlePosition="top"
                                        titleBackground={"linear-gradient(to bottom right, rgba(255,255,255,0.7) 0%, rgba(0, 0, 0 , 0.2) 50%,rgba(0,0,0,0) 100%)"}
                                        titleStyle={{color: 'black' }}
                                        style={{heigth: '30px'}}
                                        cols={1}
                                        rows={1}
                                    >
                                        <div>
                                            <div className='divCommentaries'> {commentaries.commentaries} </div>
                                            <Divider style={material_styles.styleCommentSeparator}/>
                                            {this.showSubcommentaries(commentaries)}
                                            <div className="divCommentaryAnswer">
                                                <Grid container spacing={24}>
                                                    <Grid item sm={10}>
                                                        <TextField
                                                            label="Escribe tu respuesta"
                                                            maxLength="140"
                                                            multiline
                                                            rowsMax="2"
                                                            fullWidth={true}
                                                            onChange={this.changeNewCommentaries.bind(this)}
                                                        />
                                                    </Grid>
                                                    <Grid item sm={1}>
                                                        <IconButton color="primary" onClick={() => {this.sendCommentary(this, null, this.props.bookId)}} style={material_styles.styleSendButton}>
                                                            <Send/>
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </div>
                                    </GridTile>
                                </Paper>
                            ))}
                            </GridList>
                        </div>
                    );
                }

            default:
                if (this.props.bookId > 0) {
                    return (
                        <div>
                            <h3 className="marginNoCommentaries" >No hay ningún commentaries. Sé tu el primero en romper el hielo...</h3>
                            <div className="divCommentaryAnswer">
                                <Grid container spacing={24}>
                                    <Grid item sm={10}>
                                        <TextField
                                            label="Escribe un commentaries digno de un gran lector"
                                            maxLength="140"
                                            multiline
                                            rowsMax="2"
                                            fullWidth={true}
                                            onChange={this.changeNewCommentaries.bind(this)}
                                        />
                                    </Grid>
                                    <Grid item sm={1} style={{position: 'relative'}}>
                                        <IconButton color="primary" onClick={() => {this.sendCommentary(this, null, this.props.bookId)}} style={material_styles.styleSendButton}>
                                            <Send/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    );  
                } else {
                    return (
                        <h3 className="marginNoCommentaries" >No contrates Jastel!</h3>
                    )
                }
                break;
        }
    }
}

export default connect(
    (state) => ({
        shownCommentaries: appState.getCommentaries(state),
        // TODO getfetchcommentariesSuccess: appState.getfetchcommentariesSuccess(state)
    }),
    (dispatch) => ({
        fetchCommentaries: (bookId, nCommentaries, lastDate) => dispatch(fetchCommentaries(bookId, nCommentaries, lastDate)),
        sendCommentary: (commentId, bookId, userId, commentaries) => dispatch(sendComment(commentId, bookId, userId, commentaries)),
    })
)(CommentsGrid);
