import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBooks, nextBook, doLikeBook, doDislikeBook, reportErrorMessage, actionTypes } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import RootRef from '@material-ui/core/RootRef';
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
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Favorite from 'material-ui/svg-icons/action/favorite';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import Divider from '@material-ui/core/Divider';
import CommentsGrid from '../common/CommentsGrid';
import CircularProgress from '@material-ui/core/CircularProgress';
import LS from '../LanguageSelector';
import { NUM_OF_BOOKS_PER_REQUEST, MIN_BOOK_ID, DISPLAY_NONE, LANGUAGE_SPANISH } from '../../constants/appConstants';
import noBookDefaultEs from '../../resources/loadingBookEs.svg';
import noBookDefaultEn from '../../resources/loadingBookEn.svg';
import bookDefault from '../../resources/bookDefault.gif';
import material_styles from './material_styles';
import '../../styles/Explorer.css';

const FIRST_TIME_BOOK_ID = -1;

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
            userLikesBook: false
        },
        likeBook: false,
        bookCoverErr: false,
        showHeart: 0,  // 0 no mostrar, 1 red, 2 black
        expanded: false,
        showScrollButton: false
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initilState };
        this.cardRootRef = React.createRef();
    };

    loadCurrentBookFromProps (props) {
        console.log(props.shownBooks[props.bookIndex]);
        if (props.shownBooks.length > 0 || props.bookIndex > -1) {
            let bookCoverUrl;
            if (props.shownBooks.length === 1) {
                bookCoverUrl = props.shownBooks[props.bookIndex].bookCoverUrl;
            } else if (props.shownBooks[props.bookIndex].bookCoverUrl) {
                bookCoverUrl = props.shownBooks[props.bookIndex].bookCoverUrl;
            } else {
                bookCoverUrl =  bookDefault;
            }
            
            this.setState({
                ...this.state,
                currentBook: {
                    bookId: props.shownBooks[props.bookIndex].bookId,
                    bookTitle: props.shownBooks[props.bookIndex].bookTitle,
                    bookAuthor: props.shownBooks[props.bookIndex].bookAuthor,
                    bookCoverUrl: bookCoverUrl,
                    bookDescription: props.shownBooks[props.bookIndex].bookDescription,
                    bookReview: props.shownBooks[props.bookIndex].bookReview,
                    bookGenreId: props.shownBooks[props.bookIndex].genreId,
                    bookLikes: +props.shownBooks[props.bookIndex].bookLikes,
                    userLikesBook: +props.shownBooks[props.bookIndex].userLikesBook
                },
                bookCoverErr: (!props.shownBooks[props.bookIndex].bookCoverUrl) 
                        ? LS.getStringMsg('couldnt.get.image', 'Image didn´t load properly') : '',
                likeBook: props.shownBooks[props.bookIndex].userLikesBook == true
            });
        }
    }

    componentDidMount() {
        if (this.props.currentUserId && this.props.currentUserGenres) {
            this.props.fetchBooks(this.props.currentUserId, FIRST_TIME_BOOK_ID, this.props.currentUserGenres, true);
        } else {
            // throw err
            this.props.reportErrorMessage(LS.getStringMsg('please.reload', 'An error has occurred!'));
        }
        let currentLanguage = this.props.appLanguage;
        if (currentLanguage !== null) {
            this.setState({
                ...this.state,
                currentBook: {
                    ...this.state.currentBook,
                    bookCoverUrl: LANGUAGE_SPANISH === currentLanguage ? noBookDefaultEs : noBookDefaultEn
                }
            })
        }
    }

    componentDidUpdate() {
        // This props contains current props.
        if (this.props.shownBooks.length 
                && !this.state.isPreviousBook
                && this.props.shownBooks[this.props.bookIndex] !== undefined
                && this.state.currentBook.bookId !== this.props.shownBooks[this.props.bookIndex].bookId) {
            this.loadCurrentBookFromProps (this.props);
        }
    }

    handleBack(evt) {
        this.setState({
            ...this.state,
            bookCoverErr: (!this.state.previousBook.bookCoverUrl) 
                    ? LS.getStringMsg('couldnt.get.image', 'Image didn´t load properly') : '',
            currentBook: { ...this.state.previousBook },
            previousBook: null,
            isPreviousBook: true,
        })
    }

    handleForward(evt) {
        if (this.props.bookIndex === NUM_OF_BOOKS_PER_REQUEST) {
            this.props.fetchBooks(this.props.currentUserId, this.props.shownBooks[this.props.shownBooks.length - 1].bookId, this.props.currentUserGenres, false);
            this.props.nextBook(this.props.currentUserId, this.state.currentBook.bookId, this.state.currentBook.bookGenreId);
        } else if (this.state.isPreviousBook) {
            this.setState({
                ...this.state,
                isPreviousBook: false,
            }, () => this.loadCurrentBookFromProps(this.props));
        } else {
            this.setState({
                ...this.state,
                previousBook: Object.assign({}, this.state.currentBook)
            }, () => this.props.nextBook(this.props.currentUserId, this.state.currentBook.bookId, this.state.currentBook.bookGenreId));
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

    getIsPossibleToHandleLike() {
        return !this.props.loadingProcesses.includes(actionTypes.I_LIKE_BOOK);
    }

    isLoadingCommentaries() {
        return this.props.loadingProcesses.includes(actionTypes.FETCH_COMMENTARIES);
    }
    
    handleLike(evt) {
        if (this.getIsPossibleToHandleLike() && !this.state.likeBook) {
            const closeHeart = () => {
                setTimeout(()=>{
                    this.setState(
                        {
                            ...this.state,
                            currentBook: { ...this.state.currentBook, bookLikes: this.state.currentBook.bookLikes + 1 },
                            showHeart: 0,
                            likeBook: true,
                        }
                    )
                }, 1000);
            }

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
        if (this.getIsPossibleToHandleLike() && this.state.likeBook) {
            const closeHeart = () => {
                let newBookLikes = this.state.currentBook.bookLikes > 0 ? this.state.currentBook.bookLikes - 1 : 0
                setTimeout(()=>{
                    this.setState(
                        {
                            ...this.state,
                            currentBook: { ...this.state.currentBook, bookLikes: newBookLikes },
                            showHeart: 0,
                            likeBook: false
                        }
                    )
                }, 1000);
            }
            
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

    handleScroll(evt) {
        this.cardRootRef.current.scrollTo(0,0);
    }

    // Returns the style when a double click is done
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

    displayScrollButton() {
        if (this.cardRootRef.current !== null) {
            if (this.cardRootRef.current.scrollTop > 200) {
                this.setState({
                    ...this.state,
                    showScrollButton: true
                })
            } else {
                this.setState({
                    ...this.state,
                    showScrollButton: false
                })
            }
        } 
    }

    render() {  
        return (
            <div id='exploreDiv'>
                <RootRef rootRef={this.cardRootRef}>
                    <Card classes={{ root: 'styleCardRoot' }} onScroll={this.displayScrollButton.bind(this)}>
                        <CardMedia style={material_styles.styleCard} src="empty"
                            //overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
                        >
                        <div className='imageExplore'>
                            <IconButton onClick={this.handleBack.bind(this)} style={material_styles.styleLeftArrow} disabled={(this.state.previousBook)? false: true}>
                                <ArrowLeft style={(this.state.previousBook)? material_styles.styleArrows : DISPLAY_NONE} />
                            </IconButton>
                            <IconButton 
                                    onClick={this.handleForward.bind(this)} 
                                    style={material_styles.styleRightArrow} 
                                    disabled={!this.state.isPreviousBook && this.props.shownBooks.length === 1 && this.state.currentBook.bookId < MIN_BOOK_ID}>
                                <ArrowRight style={(this.state.isPreviousBook || (this.props.shownBooks.length >= 1 && this.state.currentBook.bookId >= MIN_BOOK_ID)) 
                                        ? material_styles.styleArrows : DISPLAY_NONE} />
                            </IconButton >
                            <div style= {(this.state.bookCoverErr.length)? { color: 'red', paddingTop: '1em' } : DISPLAY_NONE}>
                                { this.state.bookCoverErr }
                            </div>
                            <img src={this.state.currentBook.bookCoverUrl} alt="" className="imageExplore" onDoubleClick={this.handleDbClickImage.bind(this)}/>
                            <Favorite style={ this.heartType(this.state.showHeart) } />
                        </div>
                        </CardMedia>
                        <CardContent style={material_styles.width50}>
                            <Divider/>
                            <Typography gutterBottom variant='headline'>
                                {this.state.currentBook.bookTitle}
                            </Typography>
                            <div className="writtenBy"><LS msgId='what.book.by' defaultMsg='By:'/></div><Typography gutterBottom variant='title' style={material_styles.inlineBlock}>
                                {this.state.currentBook.bookAuthor}
                            </Typography>
                            <h3 style={(this.state.currentBook.bookDescription) ? { paddingLeft: '15px', marginBottom: '5px' }: { display: 'none' }}><LS msgId='what.book.about' defaultMsg='Explanation about the book'/></h3>
                            {this.state.currentBook.bookDescription}
                            <br/>
                            <h4 style={(this.state.currentBook.bookReview) ? { paddingLeft: '15px', marginBottom: '5px' }: { display: 'none' }}><LS msgId='what.book.opinion' defaultMsg='Opinion by the book owner'/></h4>
                            {this.state.currentBook.bookReview}
                        </CardContent>
                        <CardActions>
                            {(this.state.currentBook.bookId)
                                ? (<div><LS msgId='what.book.likes' defaultMsg='Likes' params={ [this.state.currentBook.bookLikes] } />
                                    <Button size='small' disableRipple disableFocusRipple variant='flat' onClick={this.handleDbClickImage.bind(this)} style={material_styles.backgroundTransparent}>
                                        <Favorite style={{...material_styles.styleFavorite, fill: (this.state.likeBook)? 'red': ''}} />
                                    </Button>
                                    <Button 
                                        disableRipple 
                                        disabled={(this.isLoadingCommentaries())}
                                        size="small" 
                                        variant='flat' 
                                        onClick={this.handleCollapse.bind(this)} 
                                        style={material_styles.styleExpandComentaries}
                                    >
                                        {(this.state.expanded)? <LS msgId='hide.commentaries' defaultMsg='Hide comments'/> : <LS msgId='show.commentaries' defaultMsg='Show comments'/>}
                                        {(this.state.expanded)? (this.isLoadingCommentaries()) ? <CircularProgress className="loadingIconCommentaries" size='20' /> : <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </Button >
                                </div>)
                                : (<div></div>)
                            }
                        </CardActions>
                        <Collapse in={this.state.expanded} timeout="auto" direction="right"  
                                classes={{ wrapperInner: 'exploreCollapse' }}
                                mountOnEnter unmountOnExit>
                            <div className="commentBackground">
                                <CommentsGrid bookId={this.state.currentBook.bookId} commentFatherId={null}/>
                            </div>                        
                        </Collapse>
                    </Card>
                </RootRef>
                <Button variant="fab" color="default" aria-label="up" onClick={this.handleScroll.bind(this)} className='styleButtonUp'
                        style={(this.state.showScrollButton) ? {} : DISPLAY_NONE}>
                    <KeyboardArrowUpIcon/>
                </Button>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        bookIndex: appState.getBookIndex(state),
        shownBooks: appState.getBooks(state),
        currentUserId: appState.getUserId(state),
        currentUserGenres: appState.getUserGenres(state),
        appLanguage: appState.getAppLanguage(state),
        loadingProcesses: appState.getLoadingProcesses(state)
    }),
    (dispatch) => ({
        fetchBooks: (userId, lastBookId, genres, firstTime) => dispatch(fetchBooks(userId, lastBookId, genres, firstTime)),
        nextBook: (userId, bookId, genreId) => dispatch(nextBook(userId, bookId, genreId)),
        doLikeBook: (bookId, userId) => dispatch(doLikeBook(bookId, userId)),
        doDislikeBook: (bookId, userId) => dispatch(doDislikeBook(bookId, userId)),
        reportErrorMessage: (errorMsg) => dispatch(reportErrorMessage(errorMsg))
    })
)(ExploreView);