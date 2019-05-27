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
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Collapse from '@material-ui/core/Collapse';
import Favorite from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Avatar, Divider } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import CommentsGrid from '../common/CommentsGrid';
import * as constantes from '../../constants/appConstants';
import libroDefault from '../../resources/libroDefault.gif';
import material_styles from './material_styles';

class FavouritesView extends Component {

    initilState = {
        estadoCarga: constantes.REST_DEFAULT,
        expanded: false,
        pagina: 0,
        total: 15,
        filasPorPagina: constantes.ROWS_PER_PAGE,
        librosPorPagina: constantes.BOOKS_PER_PAGE,
        librosPorFila: constantes.BOOKS_PER_PAGE / constantes.ROWS_PER_PAGE,
        celdaLibroSeleccionado: null,
        libroSeleccionado: null
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initilState };
    };

    librosExample = [
        {
            bookId: 12,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 0, 
        },
        {
            bookId: 13,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 1, 
        },
        {
            bookId: 14,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 2, 
        },
        {
            bookId: 15,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            bookId: 16,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            bookId: 17,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            bookId: 18,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            bookId: 19,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            bookId: 22,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            bookId: 33,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            bookId: 34,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            bookId: 35,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            bookId: 36,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            bookId: 44,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            bookId: 54,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        }
    ]

    // Ciclo de vida de react
    componentDidMount() {
//        this.props.fetchBooks(0, [], true);
    }

    componentWillReceiveProps(newProps) {
//        this.cargarLibroActualFromProps (newProps);
    }

    // Handlers tabla
    // Eventos tabla
    handleFirstPageButtonClick (event) {
        //this.props.onChangePage(event, this.state.pagina + 1);
        this.handleChangePagina(event, 0)
    };

    handleBackButtonClick (event) {
        this.handleChangePagina(event, this.state.pagina - 1);
    };

    handleNextButtonClick (event) {
        //this.props.onChangePage(event, this.state.pagina + 1);
        this.handleChangePagina(event, this.state.pagina + 1)
    };

    handleLastPageButtonClick (event) {
        this.handleChangePagina(event, Math.ceil(this.state.total / this.state.filasPorPagina) - 1);
        /* this.props.onChangePage(
            event,
            Math.max(0, Math.ceil(this.state.total / this.state.filasPorPagina) - 1),
        ); */
    };

    handleChangePagina = (event, pagina) => {
        this.setState({ ...this.state, pagina: pagina });
    };

    // funcion de carga de pie de tabla
    actionButtonsTabla () {
        const { total, pagina, librosPorPagina } = this.state;

        return (
          <div className="paginadoFavoritos">
            <span>Página: {this.state.pagina + 1} de {Math.floor(this.state.total/this.state.librosPorPagina) + 1} </span>
            <IconButton
              onClick= {(evt) => {this.handleFirstPageButtonClick(evt)}}
              disabled={pagina === 0}
              aria-label="Primera página"
            >
              <FirstPageIcon />
            </IconButton>
            <IconButton
              onClick={(evt) => {this.handleBackButtonClick(evt)}}
              disabled={pagina === 0}
              aria-label="Página anterior"
            >
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              onClick={(evt) => {this.handleNextButtonClick(evt)}}
              disabled={pagina >= Math.ceil(total / librosPorPagina) - 1}
              aria-label="Página siguiente"
            >
              <KeyboardArrowRight />
            </IconButton>
            <IconButton
              onClick={(evt) => {this.handleLastPageButtonClick(evt)}}
              disabled={pagina >= Math.ceil(total / librosPorPagina) - 1}
              aria-label="Última página"
            >
              <LastPageIcon />
            </IconButton>
          </div>
        );
    }

    // likes sobre los libros
    handleLike(evt) {
        if (!this.state.likeLibro) {
            const cerrarCorazon = () => {
                setTimeout(()=>{
                    this.setState(
                        {
                            ...this.state,
                            libroActual: { ...this.state.libroActual, likes: this.state.libroActual.likes +1},
                            mostrarCorazon: 0,
                            likeLibro: true,
                        }
                    )
                }, 1000);
            }
    
            this.setState(
                {
                    ...this.state,
                    mostrarCorazon: 1
                }, cerrarCorazon
            )
    
            // TODO: this.props.setLikeLibro(bookId, true)
        }
    }

    handleUnlike(evt) {
        if (this.state.likeLibro) {
            const cerrarCorazon = () => {
                setTimeout(()=>{
                    this.setState(
                        {
                            ...this.state,
                            libroActual: { ...this.state.libroActual, likes: this.state.libroActual.likes -1},
                            mostrarCorazon: 0,
                            likeLibro: false
                        }
                    )
                }, 1000);
            }
    
            this.setState(
                {
                    ...this.state,
                    mostrarCorazon: 2
                }, cerrarCorazon
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

    handleClickImagen(evt, numeroRecuadro, bookId) {
        let nextState = {
            ...this.state, 
            celdaLibroSeleccionado: numeroRecuadro, 
            libroSeleccionado: bookId
        };

        for (let i in nextState) {
            if (Number.isInteger(+i) && +i >= 0 && +i <= nextState.librosPorPagina) {
                nextState[i] = null;
            }
        }

        if (numeroRecuadro && bookId) {
            if (numeroRecuadro && !this.state[numeroRecuadro]) {
                nextState[numeroRecuadro] = true;
            }
    
            if (numeroRecuadro && this.state[numeroRecuadro]) {
                nextState.celdaLibroSeleccionado = null;
                nextState.libroSeleccionado = null;
            }
        }
        this.setState(nextState);        
    }

    // Devuelve el estilo de doble click sobre la imagen
    tipoDeCorazon = (idTipo) => {
        switch (idTipo) {
            case 0:
                return (constantes.DISPLAY_NONE);
        
            case 1:
                return ({ ...material_styles.styleCorazon, fill: 'red' });

            case 2:
                return (material_styles.styleCorazon)
                
            default:
                return ({ ...material_styles.styleCorazon, fill: 'red', fontSize:'15px' });
        }
    }

    render() {
        const {total, filasPorPagina, pagina , librosPorPagina, librosPorFila} = this.state;
        const data = this.librosExample;

        //const filasVacias = filasPorPagina - Math.min(filasPorPagina, data.length - pagina * filasPorPagina);
    
        return (
            <div>
                <Grid container spacing={24} style={material_styles.alturaFavoritos}>
                    <Grid item sm={8} xs={12} >
                        <div className="gridDiv">
                            <GridList cellHeight={'auto'} cols={3} spacing={0} style={material_styles.gridList}>
                                {data.slice(pagina * librosPorPagina, pagina * librosPorPagina + librosPorPagina).map((libro, index, lista) => {
                                    return (
                                        <div>
                                            <GridListTile key={libro.bookId} style={(!this.state[index])? material_styles.grbookId: material_styles.grbookIdSeleccionado}>
                                                <img style={material_styles.imagenesFavoritos} src={libroDefault} alt={libro.titulo} onClick={(evt) => this.handleClickImagen(evt, index, libro.bookId)}/>
                                                <GridListTileBar
                                                title={libro.titulo}
                                                subtitle={<span>Escrito por: {libro.autor}</span>}
                                                actionIcon={
                                                    <div>
                                                        <Favorite style={this.tipoDeCorazon(-1)}/>
                                                            <span className="textoBlanco">{" " + libro.likes}</span>
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
                    {this.actionButtonsTabla()}
                    </Grid>
                    <Grid item sm={4} xs={12}>
                        { (this.state.libroSeleccionado != null)? (
                            <div>
                                <Typography gutterBottom variant='headline' style={material_styles.inlineConBoton}>
                                    {data[this.state.celdaLibroSeleccionado * (this.state.pagina + 1)].titulo}
                                </Typography>
                                <IconButton style={material_styles.inlineBlock} onClick={(evt) => {this.handleClickImagen(evt, null, null)}}>
                                    <Close/>
                                </IconButton>
                                <br/>
                                <div className="escritoPor">de:  </div><Typography gutterBottom variant='title' style={material_styles.inlineBlock}>
                                    {data[this.state.celdaLibroSeleccionado * (this.state.pagina + 1)].autor}
                                </Typography>
                                <h3 style={(data[this.state.celdaLibroSeleccionado * (this.state.pagina + 1)].argumento)? {marginBottom: '5px'}: {display: 'none'}}>De qué va la cosa...</h3>
                                {data[this.state.celdaLibroSeleccionado * (this.state.pagina + 1)].argumento}
                                <br/>
                                <h4 style={(data[this.state.celdaLibroSeleccionado * (this.state.pagina + 1)].opinion)? {marginBottom: '5px'}: {display: 'none'}}>Qué opina...</h4>
                                {data[this.state.celdaLibroSeleccionado * (this.state.pagina + 1)].opinion}
                                <Divider/>
                                <CommentsGrid bookId={this.state.libroSeleccionado} isFavorite={true}/>    
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
        librosMostrados: appState.getLibros(state),
        success_libro: appState.getLibroSuccess(state),
    }),
    (dispatch) => ({
        //fetchBooksPorGusto: (lastBookId, primeraVez) => dispatch(fetchBooksPorGusto(lastBookId, primeraVez)),
        //fetchBooksPropios: (lastBookId, primeraVez) => dispatch(fetchBooksPorGusto(lastBookId, primeraVez)),
    })
)(FavouritesView);