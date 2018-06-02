import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchLibros } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
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
import { Avatar } from '@material-ui/core';
import CommentsGrid from '../common/CommentsGrid';
import * as constantes from '../../constants/appConstants';
import libroDefault from '../../resources/libroDefault.gif';
import material_styles from './material_styles';
import { color } from '@material-ui/core/colors';

class FavouritesView extends Component {

    initilState = {
        estadoCarga: constantes.REST_DEFAULT,
        expanded: false,
        pagina: 0,
        total: 1,
        filasPorPagina: constantes.FILAS_POR_PAGINA,
        librosPorPagina: constantes.LIBROS_POR_PAGINA,
        librosPorFila: constantes.LIBROS_POR_PAGINA / constantes.FILAS_POR_PAGINA,
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initilState };
    };

    librosExample = [
        {
            idLibro: 12,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 0, 
        },
        {
            idLibro: 13,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 1, 
        },
        {
            idLibro: 14,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 2, 
        },
        {
            idLibro: 15,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            idLibro: 16,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            idLibro: 17,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            idLibro: 18,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        },
        {
            idLibro: 19,
            autor: "Curro Jimenez",
            titulo: "Mil y una noches",
            opinion: "No muy bien",
            likes: 3, 
        }
    ]

    // Ciclo de vida de react
    componentDidMount() {
//        this.props.fetchLibros(0, [], true);
    }

    componentWillReceiveProps(newProps) {
//        this.cargarLibroActualFromProps (newProps);
    }

    // Handlers tabla
    // Eventos tabla
    handleBackButtonClick (event) {
        this.props.onChangePage(event, this.state.pagina - 1);
    };

    handleNextButtonClick (event) {
        this.props.onChangePage(event, this.state.pagina + 1);
    };

    handleLastPageButtonClick (event) {
    this.props.onChangePage(
            event,
            Math.max(0, Math.ceil(this.state.total / this.state.filasPorPagina) - 1),
        );
    };

    handleChangePage = (event, pagina) => {
        this.setState({ pagina });
    };
    
    handleChangefilasPorPagina = event => {
        this.setState({ filasPorPagina: event.target.value });
    };

    // funcion de carga de pie de tabla
    actionButtonsTabla () {
        const { total, pagina, filasPorPagina } = this.state;

        return (
          <div className="paginadoFavoritos">
            <span>Página: {this.state.pagina + 1} de {Math.floor(this.state.total/this.state.librosPorPagina) + 1} </span>
            <IconButton
              onClick={this.handleFirstPageButtonClick}
              disabled={pagina === 0}
              aria-label="Primera página"
            >
              <FirstPageIcon />
            </IconButton>
            <IconButton
              onClick={this.handleBackButtonClick}
              disabled={pagina === 0}
              aria-label="Página anterior"
            >
              <KeyboardArrowRight />
            </IconButton>
            <IconButton
              onClick={this.handleNextButtonClick}
              disabled={pagina >= Math.ceil(total / filasPorPagina) - 1}
              aria-label="Página siguiente"
            >
              <KeyboardArrowRight />
            </IconButton>
            <IconButton
              onClick={this.handleLastPageButtonClick}
              disabled={pagina >= Math.ceil(total / filasPorPagina) - 1}
              aria-label="Última página"
            >
              <LastPageIcon />
            </IconButton>
          </div>
        );
    }

    // likes sobre los libros
    handleLike(evt) {
        if (!this.state.meGustaLibro) {
            const cerrarCorazon = () => {
                setTimeout(()=>{
                    this.setState(
                        {
                            ...this.state,
                            libroActual: { ...this.state.libroActual, likes: this.state.libroActual.likes +1},
                            mostrarCorazon: 0,
                            meGustaLibro: true,
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
    
            // TODO: this.props.setLikeLibro(idLibro, true)
        }
    }

    handleUnlike(evt) {
        if (this.state.meGustaLibro) {
            const cerrarCorazon = () => {
                setTimeout(()=>{
                    this.setState(
                        {
                            ...this.state,
                            libroActual: { ...this.state.libroActual, likes: this.state.libroActual.likes -1},
                            mostrarCorazon: 0,
                            meGustaLibro: false
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
            // TODO: this.props.setLikeLibro(idLibro, false)
        }        
    }

    handleCollapse(evt) {
        this.setState({
            ...this.state,
            expanded: !this.state.expanded
        })
    }

    handleClickImagen(evt, numeroRecuadro) {
        if (numeroRecuadro && !this.state[numeroRecuadro]) {
            let nextState = {...this.state};
            nextState[numeroRecuadro] = true;
            this.setState(nextState);
        }

        if (numeroRecuadro && this.state[numeroRecuadro]) {
            let nextState = {...this.state};
            nextState[numeroRecuadro] = null;
            this.setState(nextState);
        }
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
        const data = this.props.librosMostrados;

        //const filasVacias = filasPorPagina - Math.min(filasPorPagina, data.length - pagina * filasPorPagina);
    
        return (
            <div>
                <div className="gridDiv">
                    <GridList cellHeight={'auto'} cols={3} spacing={0} style={material_styles.gridList}>
                        {this.librosExample/*props.librosMostrados*/.slice(pagina * librosPorPagina, pagina * librosPorPagina + librosPorPagina).map((libro, index, lista) => {
                            let indexCelda = 'celda' + index;
                            return (
                                <div>
                                    <GridListTile key={libro.idLibro} style={(!this.state[indexCelda])? material_styles.gridLibro: material_styles.gridLibroSeleccionado}>
                                        <img style={material_styles.imagenesFavoritos} src={libroDefault} alt={libro.titulo} onClick={(evt) => this.handleClickImagen(evt, indexCelda)}/>
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
                {this.actionButtonsTabla()}
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
        //fetchLibrosPorGusto: (idUltimo, primeraVez) => dispatch(fetchLibrosPorGusto(idUltimo, primeraVez)),
        //fetchLibrosPropios: (idUltimo, primeraVez) => dispatch(fetchLibrosPorGusto(idUltimo, primeraVez)),
    })
)(FavouritesView);