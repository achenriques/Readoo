import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBooks, nextBook, doLikeBook, doDislikeBook } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import ArrowLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ArrowRight from 'material-ui/svg-icons/navigation/chevron-right';
import Favorite from 'material-ui/svg-icons/action/favorite';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import Divider from '@material-ui/core/Divider';
import CommentsGrid from '../common/CommentsGrid';
import { NUM_OF_BOOKS, DISPLAY_NONE } from '../../constants/appConstants';
import bookDefault from '../../resources/bookDefault.gif';
import material_styles from './material_styles';

class ExploreView extends Component {

    initilState = {
        isPreviousBook: false,
        previousBook : null,
        currentBook: {
            bookId: null,
            bookTitle: '',
            bookAuthor: '',
            bookCover: null,
            bookDescription: '',
            bookReview: '',
            bookLikes: 0,
        },
        likeBook: false,
        bookCoverErr: false,
        showHeart: 0,  // 0 no mostrar, 1 red, 2 black
        expanded: false,
    };

    loadCurrentBookFromProps (props) {
        console.log(props.shownBooks[props.bookIndex]);
        if (props.shownBooks.length > 0 || props.bookIndex > -1) {
            let bookCover;
            if (props.shownBooks.length === 1)
                bookCover = props.shownBooks[props.bookIndex].coverUrl;
            else if (props.shownBooks[props.bookIndex].coverUrl)
                bookCover = 'data:image/png;base64, ' + props.shownBooks[props.bookIndex].coverUrl;
            else
                bookCover =  bookDefault;
            
            this.setState({
                ...this.state,
                currentBook: {
                    bookId: props.shownBooks[props.bookIndex].bookId,
                    bookTitle: props.shownBooks[props.bookIndex].bookTitle,
                    bookAuthor: props.shownBooks[props.bookIndex].bookAuthor,
                    bookCover: bookCover,
                    bookDescription: props.shownBooks[props.bookIndex].descripcion,
                    bookReview: props.shownBooks[props.bookIndex].review,
                    bookLikes: +props.shownBooks[props.bookIndex].bookLikes,
                },
                bookCoverErr: (!props.shownBooks[props.bookIndex].coverUrl)? "Oh oh! No se ha cargado la imagen. Que mal!": '',
            });
        } else {

        }
    }

    constructor(props) {
        super(props);
        this.state = { ...this.initilState };
    };

    componentDidMount() {
        this.props.fetchBooks(0, [], true);
    }

    componentWillReceiveProps(newProps) {
        this.loadCurrentBookFromProps (newProps);
    }

    handleBack(evt) {
        this.setState({
            ...this.state,
            bookCoverErr: (!this.state.previousBook.bookCover)? "Oh oh! No se ha cargado la imagen. Que mal!": '',
            currentBook: { ...this.state.previousBook },
            previousBook: null,
            isPreviousBook: true,
        })
    }

    handleForward(evt) {
        if (this.props.bookIndex === NUM_OF_BOOKS / 2) {
            this.props.fetchBooks(0, []);
            this.props.nextBook();
        }
        else if (this.state.isPreviousBook) {
            this.setState({
                ...this.state,
                isPreviousBook: false,
            }, () => { this.loadCurrentBookFromProps (this.props) });
        } else {
            this.setState({
                ...this.state,
                previousBook: this.state.currentBook
            }, () => {
                this.props.nextBook();
            });
        }
    }

    handleDbClickImage(evt) {
        if (this.state.currentBook && this.state.currentBook.bookId > 0) {
            if (this.state.likeBook) {
                this.handleUnlike(evt);
            } else {
                this.handleLike(evt);
            }
        }
    }

    handleLike(evt) {
        if (!this.state.likeBook) {
            const closeHeart = () => {
                setTimeout(()=>{
                    this.setState(
                        {
                            ...this.state,
                            currentBook: { ...this.state.currentBook, bookLikes: this.state.currentBook.bookLikes +1},
                            showHeart: 0,
                            likeBook: true,
                        }
                    )
                }, 1000);
            }

            // (this.props.enviandoMegusta === false) && 
            this.props.doLikeBook(this.state.currentBook.bookId, this.props.currentUserId);
            this.setState(
                {
                    ...this.state,
                    showHeart: 1
                }, closeHeart
            )
        }
    }

    handleUnlike(evt) {
        if (this.state.likeBook) {
            const closeHeart = () => {
                setTimeout(()=>{
                    this.setState(
                        {
                            ...this.state,
                            currentBook: { ...this.state.currentBook, bookLikes: this.state.currentBook.bookLikes -1},
                            showHeart: 0,
                            likeBook: false
                        }
                    )
                }, 1000);
            }
            
            // (this.props.enviandoMegusta === false) && 
            this.props.doDislikeBook(this.state.currentBook.bookId, this.props.currentUserId);
            this.setState(
                {
                    ...this.state,
                    showHeart: 2
                }, closeHeart
            )

        }        
    }

    handleCollapse(evt) {
        setTimeout(() => {window.scrollTo(0, window.innerHeight + 200)}, 500);
            this.setState({
            ...this.state,
            expanded: !this.state.expanded
        })
    }

    // Devuelve el estilo de doble click sobre la imagen
    heartType = (typeId) => {
        switch (typeId) {
            case 0:
                return (DISPLAY_NONE);
        
            case 1:
                return ({ ...material_styles.heartStyle, fill: 'red' });

            case 2:
                return (material_styles.heartStyle)
                
            default:
                break;
        }
    }

    contador = 0;

    render() {  
        return (
            <div>
                <Card>
                    <CardMedia style={material_styles.styleCard}
                    //overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
                    >
                    <div className='imageExplore'>
                        <IconButton onClick={this.handleBack.bind(this)} style={material_styles.styleLeftArrow} disabled={(this.state.previousBook)? false: true}>
                            <ArrowLeft style={(this.state.previousBook)? material_styles.styleArrows: DISPLAY_NONE} />
                        </IconButton>
                        <IconButton onClick={this.handleForward.bind(this)} style={material_styles.styleRightArrow} disabled={this.props.shownBooks.length === 1}>
                            <ArrowRight style={(this.props.shownBooks.length > 1)? material_styles.styleArrows: DISPLAY_NONE} />
                        </IconButton >
                        <div style= {(this.state.bookCoverErr.length)? { color: 'red', paddingTop: '1em' }: DISPLAY_NONE}>
                            { this.state.bookCoverErr }
                        </div>
                        <img src={this.state.currentBook.bookCover} alt="" className="imageExplore" onDoubleClick={this.handleDbClickImage.bind(this)}/>
                        <Favorite style={ this.heartType(this.state.showHeart) } />
                    </div>
                    </CardMedia>
                    <CardContent style={material_styles.width50}>
                        <Divider/>
                        <Typography gutterBottom variant='headline'>
                            {this.state.currentBook.bookTitle}
                        </Typography>
                        <div className="escritoPor">de:  </div><Typography gutterBottom variant='title' style={material_styles.inlineBlock}>
                            {this.state.currentBook.bookAuthor}
                        </Typography>
                        <h3 style={(this.state.currentBook.bookDescription)? {marginBottom: '5px'}: {display: 'none'}}>De qué va la cosa... TODO</h3>
                        {this.state.currentBook.bookDescription}
                        <br/>
                        <h4 style={(this.state.currentBook.bookReview)? {marginBottom: '5px'}: {display: 'none'}}>Qué opina... TODO</h4>
                        {this.state.currentBook.bookReview}
                    </CardContent>
                    <CardActions>
                        {(this.state.currentBook.bookId)
                            ? (<div>Son {this.state.currentBook.bookLikes} los que piensan que este libro mola
                                <Button size='small' disableRipple disableFocusRipple variant='flat' onClick={this.handleDbClickImage.bind(this)} style={material_styles.backgroundTransparent}>
                                    <Favorite style={{...material_styles.styleFavorite, fill: (this.state.likeBook)? 'red': ''}} />
                                </Button>
                                <Button disableRipple size="small" variant='flat' onClick={this.handleCollapse.bind(this)} style={material_styles.styleExpandComentaries}>{(this.state.expanded)? "Ocultar comentaries": "Ver Comentarios"}
                                    {(this.state.expanded)? (<ExpandLessIcon />): (<ExpandMoreIcon />)}
                                </Button >
                            </div>)
                            : (<div></div>)
                        }
                    </CardActions>
                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            { /* Grid of comentaries */ }
                            <CommentsGrid bookId={this.state.currentBook.bookId} />
                        </CardContent>
                    </Collapse>
                </Card>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        bookIndex: appState.getBookIndex(state),
        shownBooks: appState.getBooks(state),
        currentUserId: appState.getUserId(state)
        // TODO
        // enviandoMegusta: appState.getEnviandoMeGusta(state) */
    }),
    (dispatch) => ({
        fetchBooks: (lastBookId, genres, primeraVez) => dispatch(fetchBooks(lastBookId, genres, primeraVez)),
        nextBook: () => dispatch(nextBook()),
        doLikeBook: (bookId, userId) => dispatch(doLikeBook(bookId, userId)),
        doDislikeBook: (bookId, userId) => dispatch(doDislikeBook(bookId, userId)),
    })
)(ExploreView);