import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../../app_state/reducers';
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
import CommentsGrid from '../common/CommentsGrid';
import * as constants from '../../constants/appConstants';
import bookDefault from '../../resources/bookDefault.gif';
import material_styles from './material_styles';

class FavouritesView extends Component {

    initilState = {
        loadingState: constants.REST_DEFAULT,
        expanded: false,
        page: 0,
        total: 15,
        rowsPerPage: constants.ROWS_PER_PAGE,
        booksPerPage: constants.BOOKS_PER_PAGE,
        booksPerRow: constants.BOOKS_PER_PAGE / constants.ROWS_PER_PAGE,
        selectedCell: null,
        selectedBook: null
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initilState };
    };

    librosExample = [
        {
            bookId: 12,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 0, 
        },
        {
            bookId: 13,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 1, 
        },
        {
            bookId: 14,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 2, 
        },
        {
            bookId: 15,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 3, 
        },
        {
            bookId: 16,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 3, 
        },
        {
            bookId: 17,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 3, 
        },
        {
            bookId: 18,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 3, 
        },
        {
            bookId: 19,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 3, 
        },
        {
            bookId: 22,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 3, 
        },
        {
            bookId: 33,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 3, 
        },
        {
            bookId: 34,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 3, 
        },
        {
            bookId: 35,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 3, 
        },
        {
            bookId: 36,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 3, 
        },
        {
            bookId: 44,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 3, 
        },
        {
            bookId: 54,
            bookAuthor: "Curro Jimenez",
            bookTitle: "Mil y una noches",
            bookReview: "No muy bien",
            bookLikes: 3, 
        }
    ]

    // Ciclo de vida de react
    componentDidMount() {
//        this.props.fetchBooks(0, [], true);
    }

    componentWillReceiveProps(newProps) {
//        this.loadCurrentBookFromProps (newProps);
    }

    // Handlers tabla
    // Eventos tabla
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
        let nextState = {
            ...this.state, 
            selectedCell: cellNumber, 
            selectedBook: bookId
        };

        for (let i in nextState) {
            if (Number.isInteger(+i) && +i >= 0 && +i <= nextState.booksPerPage) {
                nextState[i] = null;
            }
        }

        if (cellNumber && bookId) {
            if (cellNumber && !this.state[cellNumber]) {
                nextState[cellNumber] = true;
            }
    
            if (cellNumber && this.state[cellNumber]) {
                nextState.selectedCell = null;
                nextState.selectedBook = null;
            }
        }
        this.setState(nextState);        
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

    render() {
        const {total, rowsPerPage, page , booksPerPage, booksPerRow} = this.state;
        const data = this.librosExample;

        //const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    
        return (
            <div>
                <Grid container spacing={24} style={material_styles.favouriteHight}>
                    <Grid item sm={8} xs={12} >
                        <div className="gridDiv">
                            <GridList cellHeight={'auto'} cols={3} spacing={0} style={material_styles.gridList}>
                                {data.slice(page * booksPerPage, page * booksPerPage + booksPerPage).map((book, index, list) => {
                                    return (
                                        <div>
                                            <GridListTile key={book.bookId} style={(!this.state[index])? material_styles.grbookId: material_styles.grSelectedBookId}>
                                                <img style={material_styles.imagenesFavoritos} src={bookDefault} alt={book.bookTitle} onClick={(evt) => this.handleImageClick(evt, index, book.bookId)}/>
                                                <GridListTileBar
                                                title={book.bookTitle}
                                                subtitle={<span>Escrito por: {book.bookAuthor}</span>}
                                                actionIcon={
                                                    <div>
                                                        <Favorite style={this.heartType(-1)}/>
                                                            <span className="textoBlanco">{" " + book.bookLikes}</span>
                                                        <IconButton>
                                                            <Avatar src=""/>
                                                        </IconButton>
                                                    </div>
                                                }
                                                style={material_styles.imagenesFavoritosTitulo}
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
                            <div>
                                <Typography gutterBottom variant='headline' style={material_styles.inlineConBoton}>
                                    {data[this.state.selectedCell * (this.state.page + 1)].bookTitle}
                                </Typography>
                                <IconButton style={material_styles.inlineBlock} onClick={(evt) => {this.handleImageClick(evt, null, null)}}>
                                    <Close/>
                                </IconButton>
                                <br/>
                                <div className="writtenBy">de:  </div><Typography gutterBottom variant='title' style={material_styles.inlineBlock}>
                                    {data[this.state.selectedCell * (this.state.page + 1)].bookAuthor}
                                </Typography>
                                <h3 style={(data[this.state.selectedCell * (this.state.page + 1)].bookDescription)? {marginBottom: '5px'}: {display: 'none'}}>De qué va la cosa...</h3>
                                {data[this.state.selectedCell * (this.state.page + 1)].bookDescription}
                                <br/>
                                <h4 style={(data[this.state.selectedCell * (this.state.page + 1)].bookReview)? {marginBottom: '5px'}: {display: 'none'}}>Qué opina...</h4>
                                {data[this.state.selectedCell * (this.state.page + 1)].bookReview}
                                <Divider/>
                                <CommentsGrid bookId={this.state.selectedBook} isFavorite={true}/>    
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
            </div>
        )
    }
}

export default connect(
    (state) => ({
        shownBooks: appState.getBooks(state),
    }),
    (dispatch) => ({
        //fetchBooksPorGusto: (lastBookId, primeraVez) => dispatch(fetchBooksPorGusto(lastBookId, primeraVez)),
        //fetchBooksPropios: (lastBookId, primeraVez) => dispatch(fetchBooksPorGusto(lastBookId, primeraVez)),
    })
)(FavouritesView);