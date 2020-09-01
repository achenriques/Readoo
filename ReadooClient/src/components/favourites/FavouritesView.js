import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../../app_state/reducers';
import { fetchFavourites, setIsOpenProfilePreview, actionTypes } from '../../app_state/actions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import FirstPageIcon from 'material-ui/svg-icons/navigation/first-page';
import KeyboardArrowLeft from 'material-ui/svg-icons/navigation/chevron-left';
import KeyboardArrowRight from 'material-ui/svg-icons/navigation/chevron-right';
import LastPageIcon from 'material-ui/svg-icons/navigation/last-page';
import Collapse from '@material-ui/core/Collapse';
import Favorite from 'material-ui/svg-icons/action/favorite';
// import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
// import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import { Avatar, Divider } from '@material-ui/core';
import Close from 'material-ui/svg-icons/content/clear';
import LS from '../LanguageSelector';
import CommentsGrid from '../common/CommentsGrid';
import ProfilePreviewModal from '../profile/ProfilePreviewModal';
import * as constants from '../../constants/appConstants';
import avatarDefault from '../../resources/avatarDefault.svg';
import bookDefault from '../../resources/bookDefault.gif';
import material_styles from './material_styles';
import '../../styles/Favourites.css';

class FavouritesView extends Component {

    initilState = {
        loadingState: constants.REST_DEFAULT,
        expanded: false,
        page: 0,
        total: 0,
        rowsPerPage: constants.ROWS_PER_PAGE,
        booksPerPage: constants.BOOKS_PER_PAGE,
        booksPerRow: constants.BOOKS_PER_PAGE / constants.ROWS_PER_PAGE,
        shownBooks: [],
        selectedCell: null,
        selectedBook: null,
        previewUser: null
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initilState };
    };

    // Ciclo de vida de react
    componentDidMount() {
        this.props.fetchFavourites(this.props.currentUserId, this.state.page, this.state.booksPerPage);
//        this.props.fetchBooks(0, [], true);
    }

    componentDidUpdate() {
        if (this.state.loadingState === constants.REST_DEFAULT && !this.isLoading()) {
            if (this.props.favouriteBooks !== null) {
                this.setState({
                    ...this.state,
                    total: this.props.favouriteBooks.length,
                    loadingState: constants.REST_SUCCESS,
                });
            } else {
                // Fetch has failed...
                this.setState({
                    ...this.state,
                    total: 0,
                    loadingState: constants.REST_FAILURE
                });
            }
        }
    }

    isLoading() {
        return this.props.loadingProcesses.includes(actionTypes.FETCH_FAVOURITES);
    }

    // Table event handlers
    handleFirstPageButtonClick (event) {
        //this.props.onChangePage(event, this.state.page + 1);
        this.handleChangePage(event, 0)
    };

    handleBackButtonClick (event) {
        this.handleChangePage(event, this.state.page - 1);
    };

    handleNextButtonClick (event) {
        //this.props.onChangePage(event, this.state.page + 1);
        this.handleChangePage(event, this.state.page + 1)
    };

    handleLastPageButtonClick (event) {
        this.handleChangePage(event, Math.ceil(this.state.total / this.state.rowsPerPage) - 1);
        /* this.props.onChangePage(
            event,
            Math.max(0, Math.ceil(this.state.total / this.state.rowsPerPage) - 1),
        ); */
    };

    handleChangePage = (event, page) => {
        this.setState({ ...this.state, page: page });
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
       
            if (this.state.selectedCell === cellNumber) {
                nextState.selectedCell = null;
                nextState.selectedBook = null;
            }

            // Sets the new state
            this.setState(nextState); 
        }     
    }

    handleAvatarClick(evt, userId) {
        evt.stopPropagation();
        if (userId) {
            console.log("I made click on avatar: " + userId);
            this.setState({
                ...this.state,
                previewUser: userId
            }, () => this.props.openProfilePreview(true));
        }
    }

    // returns double click style over the images clicked
    heartType = (typeId) => {
        switch (typeId) {
            case 0:
                return (constants.DISPLAY_NONE);
        
            case 1:
                return ({ ...material_styles.heartStyle, fill: 'red' });

            case 2:
                return (material_styles.heartStyle)
                
            default:
                return ({ ...material_styles.heartStyle, fill: 'red', fontSize:'15px' });
        }
    }

    // funcion de carga de pie de tabla
    tableActionButtons () {
        const { total, page, booksPerPage } = this.state;

        return (
          <div className="favouritePages">
                <span>Página: {this.state.page + 1} de {Math.floor(this.state.total/this.state.booksPerPage) + 1} </span>
                <IconButton
                    onClick= {(evt) => {this.handleFirstPageButtonClick(evt)}}
                    disabled={page === 0}
                    aria-label="Primera página"
                >
                    <FirstPageIcon />
                </IconButton>
                <IconButton
                    onClick={(evt) => {this.handleBackButtonClick(evt)}}
                    disabled={page === 0}
                    aria-label="Página anterior"
                >
                    <KeyboardArrowLeft />
                </IconButton>
                <IconButton
                    onClick={(evt) => {this.handleNextButtonClick(evt)}}
                    disabled={page >= Math.ceil(total / booksPerPage) - 1}
                    aria-label="Página siguiente"
                >
                    <KeyboardArrowRight />
                </IconButton>
                <IconButton
                    onClick={(evt) => {this.handleLastPageButtonClick(evt)}}
                    disabled={page >= Math.ceil(total / booksPerPage) - 1}
                    aria-label="Última página"
                >
                    <LastPageIcon />
                </IconButton>
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
                        <div>
                            <Grid container spacing={24}>
                                <Grid item sm={8} xs={12} className="favouritesGrid">
                                    <div className="gridDiv">
                                        <GridList cellHeight={'auto'} cols={3} spacing={0} style={material_styles.gridList}>
                                            {this.props.favouriteBooks.slice(page * booksPerPage, page * booksPerPage + booksPerPage).map((book, index, list) => {
                                                return (
                                                    <div key={'div_' + book.bookId}>
                                                        <GridListTile key={'tile_' + book.bookId} 
                                                            className={(this.state.selectedCell !== index) ? "grbookId": "grSelectedBookId"}
                                                            classes={{tile: "tileBackGround"}}
                                                        >
                                                            <img className="favouritesCover"
                                                                src={(book.bookCoverUrl !== null) ? book.bookCoverUrl : bookDefault} 
                                                                alt={book.bookTitle} 
                                                                onClick={(evt) => this.handleImageClick(evt, index, book.bookId)}
                                                            />
                                                            <div className={(book.bookCoverUrl === null) ? "centeredText": "displayNone"}>
                                                                <LS msgId='no.image.avaliable' defaultMsg='No image encountered '/>
                                                            </div>
                                                            <GridListTileBar
                                                                key={'tileBar_' + book.bookId}
                                                                title={book.bookTitle}
                                                                subtitle={<span><LS msgId='what.book.by' defaultMsg='By: '/> {book.bookAuthor} </span>}
                                                                className="favouritesBookTitle"
                                                                actionIcon={
                                                                    <div>
                                                                        <Favorite style={this.heartType(-1)}/>
                                                                            <span className="whiteText">{" " + +book.bookLikes}</span>
                                                                        <IconButton>
                                                                            <Avatar src={(book.userAvatarUrl !== null) ? book.userAvatarUrl : avatarDefault }
                                                                                onClick={(evt) => this.handleAvatarClick(evt, book.userId)}
                                                                            />
                                                                        </IconButton>
                                                                    </div>
                                                                }
                                                            />
                                                        </GridListTile>
                                                    </div>
                                                );
                                            })}
                                        </GridList>
                                    </div>
                                    <Divider/>
                                    {this.tableActionButtons()}
                                </Grid>
                                <Grid item sm={4} xs={12}>
                                    { (this.state.selectedBook != null)? (
                                        <div className="favouritesGridRight">
                                            <div>
                                                <Typography gutterBottom variant='headline' className="inlineBlockButton">
                                                    {data[this.state.selectedCell * (this.state.page + 1)].bookTitle}
                                                </Typography>
                                                <IconButton style={material_styles.inlineBlock} onClick={(evt) => {this.handleImageClick(evt, null, null)}}>
                                                    <Close/>
                                                </IconButton>
                                                <br/>
                                                <div className="writtenBy"><LS msgId='what.book.by' defaultMsg='By: '/></div><Typography gutterBottom variant='title' className="inlineBlock">
                                                    {data[this.state.selectedCell * (this.state.page + 1)].bookAuthor}
                                                </Typography>
                                                <h3 style={(data[this.state.selectedCell * (this.state.page + 1)].bookDescription)? {marginBottom: '5px'}: {display: 'none'}}>
                                                    <LS msgId='what.book.about' defaultMsg='Explanation about the book'/>
                                                </h3>
                                                {data[this.state.selectedCell * (this.state.page + 1)].bookDescription}
                                                <br/>
                                                <h4 style={(data[this.state.selectedCell * (this.state.page + 1)].bookReview)? {marginBottom: '5px'}: {display: 'none'}}>
                                                    <LS msgId='what.book.opinion' defaultMsg='Opinion by the book owner'/>
                                                </h4>
                                                {data[this.state.selectedCell * (this.state.page + 1)].bookReview}
                                                <br/>
                                                <Divider/>
                                                <h3 style={{marginBottom: '15px'}}>
                                                    <LS msgId='commentaries' defaultMsg='Let´s see people´s opinion:'/>
                                                </h3>
                                            </div>
                                            <div className="favouritesCommentDiv">
                                                <CommentsGrid bookId={this.state.selectedBook} commentFatherId={null} isFavorite={true}/>
                                            </div>
                                        </div>
                                        ) : (
                                        <div>
                                            <Typography gutterBottom variant='headline'>
                                                Haz clic sobre una imgen para ver su contenido...
                                            </Typography>
                                        </div>
                                        )
                                    }
                                </Grid>                  
                            </Grid>
                            <ProfilePreviewModal previewUser={this.state.previewUser}/>
                        </div>
                    )
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
        loadingProcesses: appState.getLoadingProcesses(state)
    }),
    (dispatch) => ({
        fetchFavourites: (userId, page, booksPerPage) => dispatch(fetchFavourites(userId, page, booksPerPage)),
        openProfilePreview: (isOpen) => dispatch(setIsOpenProfilePreview(isOpen))
    })
)(FavouritesView);