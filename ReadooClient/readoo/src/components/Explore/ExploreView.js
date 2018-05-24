import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setIsOpenAddLibro, fetchLibros, pasarLibro, controllerLibroDefault } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import Favorite from 'material-ui/svg-icons/action/favorite';
import CommentsGrid from '../common/CommentsGrid';
import { NUM_LIBROS, DISPLAY_NONE } from '../../constants/appConstants';
import libroDefault from '../../resources/libroDefault.gif';
import material_styles from './material_styles';

class ExploreView extends Component {

    initilState = {
        estoyLibroAtras: false,
        libroAtras : null,
        libroActual: {
            idLibro: null,
            titulo: '',
            autor: '',
            portada: null,
            argumento: '',
            historia: '',
            likes: 0,
        },
        meGustaLibro: false,
        errorImgLibro: false,
        mostrarCorazon: 0,  // 0 no mostrar, 1 red, 2 black
    };

    cargarLibroActualFromProps (props) {
        console.log(props.librosMostrados[props.indexLibro]);
        if (props.librosMostrados.length > 0 || props.indexLibro > -1) {
            let portada;
            if (props.librosMostrados.length === 1)
                portada = props.librosMostrados[props.indexLibro].coverUrl;
            else if (props.librosMostrados[props.indexLibro].coverUrl)
                portada = 'data:image/png;base64, ' + props.librosMostrados[props.indexLibro].coverUrl;
            else
                portada =  libroDefault;
            
            this.setState({
                ...this.state,
                libroActual: {
                    idLibro: props.librosMostrados[props.indexLibro].idLibro,
                    titulo: props.librosMostrados[props.indexLibro].titulo,
                    autor: props.librosMostrados[props.indexLibro].autor,
                    portada: portada,
                    argumento: props.librosMostrados[props.indexLibro].descripcion,
                    opinion: props.librosMostrados[props.indexLibro].review,
                    likes: +props.librosMostrados[props.indexLibro].likes,
                },
                errorImgLibro: (!props.librosMostrados[props.indexLibro].coverUrl)? "Oh oh! No se ha cargado la imagen. Que mal!": '',
            });
        } else {

        }
    }

    constructor(props) {
        super(props);
        this.state = { ...this.initilState };
    };

    componentDidMount() {
        this.props.fetchLibros(0, [], true);
    }

    componentWillReceiveProps(newProps) {
        this.cargarLibroActualFromProps (newProps);
    }

    handleBack(evt) {
        this.setState({
            ...this.state,
            errorImgLibro: (!this.state.libroAtras.portada)? "Oh oh! No se ha cargado la imagen. Que mal!": '',
            libroActual: { ...this.state.libroAtras },
            libroAtras: null,
            estoyLibroAtras: true,
        })
    }

    handleForward(evt) {
        if (this.props.indexLibro === NUM_LIBROS / 2) {
            this.props.fetchLibros(0, []);
            this.props.pasarLibro();
        }
        else if (this.state.estoyLibroAtras) {
            this.setState({
                ...this.state,
                estoyLibroAtras: false,
            }, () => { this.cargarLibroActualFromProps (this.props) });
        } else {
            this.setState({
                ...this.state,
                libroAtras: this.state.libroActual
            }, () => {
                this.props.pasarLibro();
            });
        }
    }

    handleDbClickImage(evt) {
        if (this.state.meGustaLibro) {
            this.handleUnlike(evt);
        } else {
            this.handleLike(evt);
        }
    }

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

    // Devuelve el estilo de doble click sobre la imagen
    tipoDeCorazon = (idTipo) => {
        switch (idTipo) {
            case 0:
                return (DISPLAY_NONE);
                break;
        
            case 1:
                return ({ ...material_styles.styleCorazon, fill: 'red' });
                break;

            case 2:
                return (material_styles.styleCorazon)
                break;
                
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
                        <IconButton onClick={this.handleBack.bind(this)} iconStyle={(this.state.libroAtras)? material_styles.styleArrows: DISPLAY_NONE} style={material_styles.styleLeftArrow} disabled={(this.state.libroAtras)? false: true}>
                            <ArrowLeft viewBox="7 5 15 15"/>
                        </IconButton>
                        <IconButton onClick={this.handleForward.bind(this)} iconStyle={(this.props.librosMostrados.length > 1)? material_styles.styleArrows: DISPLAY_NONE} style={material_styles.styleRightArrow} disabled={this.props.librosMostrados.length === 1}>
                            <ArrowRight viewBox="7 5 15 15"/>
                        </IconButton >
                        <div style= {(this.state.errorImgLibro.length)? { color: 'red', paddingTop: '1em' }: DISPLAY_NONE}>
                            { this.state.errorImgLibro }
                        </div>
                        <img src={this.state.libroActual.portada} alt="" className="imageExplore" onDoubleClick={this.handleDbClickImage.bind(this)}/>
                        <Favorite style={ this.tipoDeCorazon(this.state.mostrarCorazon) } />
                    </div>
                    </CardMedia>
                    <CardTitle title={this.state.libroActual.titulo} subtitle={this.state.libroActual.autor} />
                    <CardText>
                        <h3 style={(this.state.libroActual.argumento)? { }: {display: 'none'}}>De qué va la cosa...</h3>
                        {this.state.libroActual.argumento}
                    </CardText>
                    <CardText>
                        <h4 style={(this.state.libroActual.opinion)? { }: {display: 'none'}}>Qué opina...</h4>
                        {this.state.libroActual.opinion}
                    </CardText>
                    <CardText>
                        {(this.state.libroActual.idLibro)? (
                        <div>Son {this.state.libroActual.likes} los que piensan que este libro mola
                        <Favorite style={material_styles.styleFavorite} /></div>): (<div></div>)
                    }
                    </CardText>
                </Card>
                { /* Grid de comentarios */ console.log(this.contador += 1)}
                <CommentsGrid idLibro={this.state.libroActual.idLibro} />
            </div>
        );
    }
}

export default connect(
    (state) => ({
        indexLibro: appState.getIndiceLibro(state),
        librosMostrados: appState.getLibros(state),
        success_libro: appState.getLibroSuccess(state),
    }),
    (dispatch) => ({
        fetchLibros: (idUltimo, categorias, primeraVez) => dispatch(fetchLibros(idUltimo, categorias, primeraVez)),
        pasarLibro:() => dispatch(pasarLibro())
        //openAddLibro: (isOpen) => dispatch(setIsOpenAddLibro(isOpen)),
        //listenedUploadLibro: () => dispatch(controllerLibroDefault())
    })
)(ExploreView);