import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../../app_state/reducers';
import { 
    favouritePageRequest, fetchFavourites, 
    doLikeBook, doDislikeBook, unsubscribeBook,
    resetProccess, actionTypes } from '../../app_state/actions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import FirstPageIcon from 'material-ui/svg-icons/navigation/first-page';
import KeyboardArrowLeft from 'material-ui/svg-icons/navigation/chevron-left';
import KeyboardArrowRight from 'material-ui/svg-icons/navigation/chevron-right';
import LastPageIcon from 'material-ui/svg-icons/navigation/last-page';
import Favorite from 'material-ui/svg-icons/action/favorite';
import { Avatar, Divider } from '@material-ui/core';
import Close from 'material-ui/svg-icons/content/clear';
import LS from '../LanguageSelector';
import CommentsGrid from '../common/CommentsGrid';
import ProfilePreviewModal from '../profile/ProfilePreviewModal';
import ContinueModal from '../common/ContinueModal';
import FavouritesSelector from './FavouritesSelector';
import * as constants from '../../constants/appConstants';
import avatarDefault from '../../resources/avatarDefault.svg';
import bookDefault from '../../resources/bookDefault.gif';
import '../../styles/Favourites.css';
import InfoModal from '../common/InfoModal';

class FavouritesView extends Component {

    initilState = {
        loadingState: constants.REST_DEFAULT,
        expanded: false,
        page: 0,
        total: 0,
        loadingPage: 0,
        currentBooksPerPage: 0,
        rowsPerPage: constants.ROWS_PER_PAGE,
        booksPerPage: constants.BOOKS_PER_PAGE,
        booksPerRow: constants.BOOKS_PER_PAGE / constants.ROWS_PER_PAGE,
        selectedCell: null,
        selectedBook: null,
        previewUser: null,
        dislikeBooks: [],
        deletedBooks: [],
        selectorValue: constants.MY_FAVOURITES,
        openContinueDeleteBook: false,
        openInfoModal: false
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initilState };
    };

    // Ciclo de vida de react
    componentDidMount() {
        this.props.fetchFavourites(this.props.currentUserId, this.state.page, this.state.booksPerPage, 
                this.state.selectorValue === constants.MY_BOOKS, null);
    }

    componentDidUpdate() {
        let isLoading = this.isLoading(actionTypes.FETCH_FAVOURITES);
        if (isLoading) {
            if (this.state.loadingState != constants.REST_DEFAULT) {
                this.setState({
                    ...this.state,
                    loadingState: constants.REST_DEFAULT
                });
            }
        } else if (constants.REST_DEFAULT === this.state.loadingState) {
            if (this.props.favouriteBooks !== null) {
                this.setState({
                    ...this.state,
                    currentBooksPerPage: this.props.favouriteBooks.length,
                    total: this.props.totalOfFavourites,
                    loadingPage: null,
                    loadingState: constants.REST_SUCCESS
                });
            } else {
                // Fetch has failed...
                this.setState({
                    ...this.state,
                    total: 0,
                    loadingState: constants.REST_FAILURE
                });
            }
        } if (this.props.successProcesses.includes(actionTypes.DELETE_BOOK)) {
                // status of delete book...
                this.props.resetProccessStatus(actionTypes.DELETE_BOOK);
                this.setState({
                    ...this.state,
                    openInfoModal: true,
                    deletedBooks: this.state.deletedBooks.concat(this.state.selectedBook),
                    selectedBook: null,
                    selectedCell: null
                });
        }
    }

    isLoading(actionName) {
        return this.props.loadingProcesses.includes(actionName);
    }

    // Table event handler
    handleChangePage = (evt, buttonCode) => {
        if (buttonCode) {
            let page = this.state.page;
            let pageToFetch = page;
            switch (buttonCode) {
                case constants.NEXT_PAGE:
                    page = page + 1;
                    pageToFetch = page + 1;
                    break;
    
                case constants.BEFORE_PAGE:
                    page = (page > 0) ? (page - 1) : page;
                    pageToFetch = (page > 0) ? (page - 1) : page;
                    break;
                        
                case constants.LAST_PAGE:
                    page = Math.floor(this.state.total / constants.BOOKS_PER_PAGE);
                    pageToFetch = (page > 0) ? (page - 1) : page;
                    break; 
    
                case constants.FIRST_PAGE:
                    page = 0;
                    pageToFetch = page + 1;
                    break; 
            
                default:
                    break;
            }
            const needFetch = this.state.total > this.state.booksPerPage * 2;
            this.setState({ 
                ...this.state, 
                page: page, 
                loadingPage: (needFetch) ? pageToFetch  : null,
                selectedCell: null,
                selectedBook: null
            });
            // Change the current page
            this.props.favouritePageRequest(buttonCode, needFetch);
            // Fetch the data
            if (needFetch) {
                this.props.fetchFavourites(this.props.currentUserId, pageToFetch, 
                    this.state.booksPerPage, this.state.selectorValue === constants.MY_BOOKS, buttonCode);
            }
        }
    };

    // bookLikes
    handleLike(evt) {
        if (!this.state.likeLibro) {
            const closeHeart = () => {
                setTimeout(()=>{
                    this.setState(
                        {
                            ...this.state,
                            currentBook: { ...this.state.currentBook, bookLikes: this.state.currentBook.bookLikes +1},
                            showHeart: 0,
                            likeLibro: true,
                        }
                    )
                }, 1000);
            }
    
            this.setState(
                {
                    ...this.state,
                    showHeart: 1
                }, closeHeart
            )
    
            // TODO: this.props.setLikeLibro(bookId, true)
        }
    }

    handleUnlike(evt) {
        if (this.state.likeLibro) {
            const closeHeart = () => {
                setTimeout(()=>{
                    this.setState(
                        {
                            ...this.state,
                            currentBook: { ...this.state.currentBook, bookLikes: this.state.currentBook.bookLikes -1},
                            showHeart: 0,
                            likeLibro: false
                        }
                    )
                }, 1000);
            }
    
            this.setState(
                {
                    ...this.state,
                    showHeart: 2
                }, closeHeart
            )
            // TODO: this.props.setLikeLibro(bookId, false)
        }        
    }

    handleCollapse(evt) {
        this.setState({
            ...this.state,
            expanded: !this.state.expanded
        })
    }

    handleImageClick(evt, cellNumber, bookId) {
        if (cellNumber !== undefined && bookId) {
            let nextState = {
                ...this.state, 
                selectedCell: cellNumber, 
                selectedBook: bookId
            };
       
            if (this.state.selectedCell === cellNumber || this.state.deletedBooks.includes(bookId)) {
                nextState.selectedCell = null;
                nextState.selectedBook = null;
            }

            // Sets the new state
            this.setState(nextState); 
        }     
    }

    handleCloseClick(evt) {
        this.setState({
            ...this.state, 
            selectedCell: null, 
            selectedBook: null
        });
    }

    handleAvatarClick(evt, userId) {
        evt.stopPropagation();
        if (userId) {
            console.log("I made click on avatar: " + userId);
            this.setState({
                ...this.state,
                previewUser: userId
            });
        }
    }

    handleChangeFavouriteType(evt, newValue) {
        if (newValue !== undefined) {
            if (newValue !== this.state.selectorValue) {
                this.setState({
                        ...this.state,
                        selectorValue: newValue,
                        loadingState: constants.REST_DEFAULT,
                        selectedCell: null,
                        selectedBook: null,
                        previewUser: null,
                        total: 0
                    }, () => this.props.fetchFavourites(this.props.currentUserId, this.state.page, 
                            this.state.booksPerPage, this.state.selectorValue === constants.MY_BOOKS, null)
                );
            }
        }
    }

    handleDeleteBook(evt) {
        if (this.state.selectorValue === constants.MY_BOOKS && this.state.selectedBook !== null) {
            this.setState({
                ...this.state,
                openContinueDeleteBook: true
            });
        }
    }

    closeInfoModal() {
        this.setState({
            ...this.state,
            openInfoModal: false
        })
    }

    acceptDeleteBook(selectedOption) {
        if (selectedOption) {
            this.props.unsubscribeBook(this.state.selectedBook, this.props.currentUserId)
        }

        this.setState({
            ...this.state,
            openContinueDeleteBook: false
        });
    }

    getIsPossibleToHandleLike() {
        return !this.props.loadingProcesses.includes(actionTypes.I_LIKE_BOOK);
    }

    handleLikeClick(evt, bookId) {
        if (bookId && this.getIsPossibleToHandleLike()) {
            let dislikes = this.state.dislikeBooks;
            if (this.state.dislikeBooks.includes(bookId)) {
                dislikes = this.state.dislikeBooks.filter(b => b !== bookId);
                this.props.doLikeBook(bookId, this.props.currentUserId);
            } else {
                dislikes.push(bookId);
                this.props.doDislikeBook(bookId, this.props.currentUserId);
            }
            
            this.setState({
                ...this.state,
                dislikeBooks: dislikes
            });
        }
    }

    hadleProfilePreviewClose() {
        this.setState({
            ...this.state,
            previewUser: null
        });
    }

    // returns the style of favourite hearts
    heartType = (bookId) => {
        let heartStyle = {};
        if (this.state.dislikeBooks.includes(bookId)) {
            heartStyle = { fill: 'black', fontSize:'15px' };
        } else {
            heartStyle = { fill: 'red', fontSize:'15px' };
        }

        heartStyle.cursor = (this.state.selectorValue === constants.MY_BOOKS)
                ? 'not-allowed'
                : 'pointer';
        
        return heartStyle;
    }

    // funcion de carga de pie de tabla
    tableActionButtons () {
        const { total, page, booksPerPage } = this.state;

        return (
            <div className="favouriteFoot">
                <div className="favouriteSelector">
                    <FavouritesSelector
                        disabled={this.isLoading(actionTypes.FETCH_FAVOURITES)}
                        firstOption={this.state.selectorValue}
                        onChangeFavourite={(evt, newValue) => this.handleChangeFavouriteType(evt, newValue)}
                    />
                </div>
                {(this.state.selectorValue === constants.MY_BOOKS && this.state.selectedBook !== null)
                    ? ( <div className="favouritesDelete">
                            <Button 
                                key="deleteBook" 
                                color="secondary" 
                                size="small" 
                                onClick={(evt) => this.handleDeleteBook(evt)}
                                disabled={this.isLoading(actionTypes.DELETE_BOOK)}
                            >
                                <LS msgId='delete.book' defaultMsg='Delete my book!'/>
                            </Button>
                        </div>) : (<div/>)}
                <div className="favouritePages">
                    <span>
                        <LS msgId='page.one.of' defaultMsg={"Page: " + this.state.page + 1} params={[this.state.page + 1, Math.ceil(this.state.total/this.state.booksPerPage)]}/>
                    </span>
                    <IconButton
                        onClick= {(evt) => {this.handleChangePage(evt, constants.FIRST_PAGE)}}
                        disabled={page === 0}
                        aria-label={LS.getStringMsg('first.page', 'To First Page')}
                    >
                        <FirstPageIcon />
                    </IconButton>
                    <IconButton
                        onClick={(evt) => {this.handleChangePage(evt, constants.BEFORE_PAGE)}}
                        disabled={page === 0}
                        aria-label={LS.getStringMsg('before.page', 'To Page Before')}
                    >
                        <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton
                        onClick={(evt) => {this.handleChangePage(evt, constants.NEXT_PAGE)}}
                        disabled={page >= Math.ceil(total / booksPerPage) - 1}
                        aria-label={LS.getStringMsg('next.page', 'To Page Next')}
                    >
                        <KeyboardArrowRight />
                    </IconButton>
                    <IconButton
                        onClick={(evt) => {this.handleChangePage(evt, constants.LAST_PAGE)}}
                        disabled={page >= Math.ceil(total / booksPerPage) - 1}
                        aria-label={LS.getStringMsg('last.page', 'To Last Before')}
                    >
                        <LastPageIcon />
                    </IconButton>
                </div>
            </div>
        );
    }

    render() {
        const {total, rowsPerPage, page , booksPerPage, booksPerRow} = this.state;
        const data = this.props.favouriteBooks;

        //const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        
        switch (this.state.loadingState) {
            case constants.REST_FAILURE:
                return (
                    <div className="loadingNewTab">
                        <h3><LS msgId='favourites.load.error' defaultMsg='Something failed while fetching commentaries. Sorry!'/></h3>
                    </div>
                )

            case constants.REST_DEFAULT:
                return (
                    <div className="loadingNewTab">
                        <h3><LS msgId='loading' defaultMsg='Loading...'/></h3>
                    </div>
                )
            
            case constants.REST_SUCCESS:
                if (this.props.favouriteBooks !== null && this.props.favouriteBooks.length > 0) {
                    return (
                        <div className="favouritesDiv">
                            <Grid container spacing={24} className="favouritesGrid">
                                <Grid item sm={8} xs={12} className="favouritesGrid">
                                    <div className="gridDiv">
                                        <GridList cellHeight={'auto'} cols={3} spacing={0} className="gridList">
                                            {this.props.favouriteBooks.map((book, index, list) => {
                                                return (
                                                    <GridListTile key={'tile_' + book.bookId} 
                                                        className={(this.state.deletedBooks.includes(+book.bookId)) ? "grDeletedBook" : (this.state.selectedCell !== index) ? "grBookId": "grSelectedBookId"}
                                                        classes={{tile: "tileBackGround"}}
                                                    >
                                                        <div className="favouritesCoverDiv" onClick={(evt) => this.handleImageClick(evt, index, book.bookId)}>
                                                            <img className="favouritesCover"
                                                                src={(book.bookCoverUrl !== null) ? book.bookCoverUrl : bookDefault} 
                                                                alt={book.bookTitle}
                                                            />
                                                            <div className={(book.bookCoverUrl === null && !this.state.deletedBooks.includes(book.bookId)) ? "centeredText": "displayNone"}>
                                                                <h3>
                                                                    <LS msgId='no.image.avaliable' defaultMsg='No image encountered'/>
                                                                </h3>
                                                            </div>
                                                            <div className={(this.state.deletedBooks.includes(book.bookId)) ? "centeredText": "displayNone"}>
                                                                <h3>
                                                                    <LS msgId='book.was.deleted' defaultMsg='Deleted!'/>
                                                                </h3>
                                                            </div>
                                                        </div>
                                                        <GridListTileBar
                                                            key={'tileBar_' + book.bookId}
                                                            title={book.bookTitle}
                                                            subtitle={<span><LS msgId='what.book.by' defaultMsg='By: '/> {book.bookAuthor} </span>}
                                                            className="favouritesBookTitle"
                                                            actionIcon={
                                                                <div>
                                                                    <Favorite 
                                                                        className="favouriteLikesHeart" 
                                                                        style={this.heartType(+book.bookId)}
                                                                        disabled={this.state.selectorValue === constants.MY_BOOKS}
                                                                        onClick={(evt) => this.handleLikeClick(evt, +book.bookId)}
                                                                    />
                                                                    <span className="favouriteLikesText">{(this.state.dislikeBooks.includes(+book.bookId)) ? (+book.bookLikes - 1) : +book.bookLikes}</span>
                                                                    <IconButton 
                                                                        className="favouriteAvatarButton"
                                                                        style={(this.state.selectorValue === constants.MY_BOOKS) ? constants.DISPLAY_NONE : { margin: 'auto' } }
                                                                    >
                                                                        <Avatar src={(book.userAvatarUrl !== null) ? book.userAvatarUrl : avatarDefault }
                                                                            onClick={(evt) => this.handleAvatarClick(evt, book.userId)}
                                                                        />
                                                                    </IconButton>
                                                                </div>
                                                            }
                                                        />
                                                    </GridListTile>
                                                );
                                            })}
                                        </GridList>
                                    </div>
                                    <Divider/>
                                    {this.tableActionButtons()}
                                </Grid>
                                <Grid item sm={4} xs={12} className="favouritesGridRightFather">
                                    { (this.state.selectedBook != null)? (
                                        <Grid container 
                                            direction="column" 
                                            alignItems="flex-start" 
                                            justify="flex-start" 
                                            className="favouritesGridRight"
                                        >
                                            <Grid item sm="auto" className="favouritesRightUp">
                                                <IconButton className="inlineBlock floatRight" onClick={(evt) => {this.handleCloseClick(evt)}}>
                                                    <Close/>
                                                </IconButton>
                                                <Typography gutterBottom variant='headline' className="inlineBlockButton">
                                                    {data[this.state.selectedCell].bookTitle}
                                                </Typography>
                                                <br/>
                                                <div className="writtenBy"><LS msgId='what.book.by' defaultMsg='By: '/></div><Typography gutterBottom variant='title' className="inlineBlock">
                                                    {data[this.state.selectedCell].bookAuthor}
                                                </Typography>
                                                <h3 style={(data[this.state.selectedCell].bookDescription)? {marginBottom: '5px'}: {display: 'none'}}>
                                                    <LS msgId='what.book.about' defaultMsg='Explanation about the book'/>
                                                </h3>
                                                {data[this.state.selectedCell].bookDescription}
                                                <br/>
                                                <h4 style={(data[this.state.selectedCell].bookReview)? {marginBottom: '5px'}: {display: 'none'}}>
                                                    <LS msgId='what.book.opinion' defaultMsg='Opinion by the book owner'/>
                                                </h4>
                                                {data[this.state.selectedCell].bookReview}
                                                <Divider className="favouritesRightDivider"/>
                                                <h3 style={{marginBottom: '15px'}}>
                                                    <LS msgId='commentaries' defaultMsg='Let´s see people´s opinion:'/>
                                                </h3>
                                            </Grid>
                                            <Grid item sm="auto" className="favouritesRightDown">
                                                <CommentsGrid bookId={this.state.selectedBook} commentFatherId={null} isFavorite={true}/>
                                            </Grid>
                                        </Grid>       
                                        ) : (
                                        <div>
                                            <Typography gutterBottom variant='headline'>
                                                <LS msgId='click.containt' defaultMsg='Do click on covers to see its content...'/>
                                            </Typography>
                                        </div>
                                        )
                                    }    
                                </Grid>
                            </Grid> 
                            <ProfilePreviewModal allowChat={false} previewUser={this.state.previewUser} isOpen={this.state.previewUser !== null} closeCallback={this.hadleProfilePreviewClose.bind(this)} />
                            <ContinueModal open={this.state.openContinueDeleteBook} text={LS.getStringMsg('continue.delete.book')} closeCallback={this.acceptDeleteBook.bind(this)} />
                            <InfoModal open={this.state.openInfoModal} text={LS.getStringMsg('success.delete.book')} closeCallback={this.closeInfoModal.bind(this)} />
                        </div>
                    );
                }

            default: 
                return (
                    <div className="loadingNewTab">
                        <h3><LS msgId='no.books.yet' defaultMsg='Are you a hater or you just do not like anything?'/></h3>
                    </div>
                );
        }
    }
}

export default connect(
    (state) => ({
        currentUserId: appState.getUserId(state),
        favouriteBooks: appState.getFavourites(state),
        totalOfFavourites: appState.getTotalOfFavourites(state),
        loadingProcesses: appState.getLoadingProcesses(state),
        successProcesses: appState.getSucceedProcesses(state),
        failedProcesses: appState.getFailedProcesses(state)
    }),
    (dispatch) => ({
        favouritePageRequest: (buttonCode, fetchData) => dispatch(favouritePageRequest(buttonCode, fetchData)),
        fetchFavourites: (userId, page, booksPerPage, myUploads, buttonCode) => dispatch(fetchFavourites(userId, page, booksPerPage, myUploads, buttonCode)),
        doLikeBook: (bookId, userId) => dispatch(doLikeBook(bookId, userId)),
        doDislikeBook: (bookId, userId) => dispatch(doDislikeBook(bookId, userId)),
        unsubscribeBook: (bookId, userId) => dispatch(unsubscribeBook(bookId, userId)),
        resetProccessStatus: (proccessName) => dispatch(resetProccess(proccessName))
    })
)(FavouritesView);