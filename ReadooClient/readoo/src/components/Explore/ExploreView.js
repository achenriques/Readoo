import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchLibros, pasarLibro, enviarMeGusta, enviarNoMeGusta } from '../../app_state/actions';
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
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Favorite from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Divider from '@material-ui/core/Divider';
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
        expanded: false,
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
        if (this.state.libroActual && this.state.libroActual.idLibro > 0) {
            if (this.state.meGustaLibro) {
                this.handleUnlike(evt);
            } else {
                this.handleLike(evt);
            }
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

            (this.props.enviandoMegusta === false) && this.props.enviarMeGusta(this.state.libroActual.idLibro, 2); //FIXME TODO usuarios
            this.setState(
                {
                    ...this.state,
                    mostrarCorazon: 1
                }, cerrarCorazon
            )
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
            
            (this.props.enviandoMegusta === false) && this.props.enviarNoMeGusta(this.state.libroActual.idLibro, 2); //FIXME TODO usuarios
            this.setState(
                {
                    ...this.state,
                    mostrarCorazon: 2
                }, cerrarCorazon
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
    tipoDeCorazon = (idTipo) => {
        switch (idTipo) {
            case 0:
                return (DISPLAY_NONE);
        
            case 1:
                return ({ ...material_styles.styleCorazon, fill: 'red' });

            case 2:
                return (material_styles.styleCorazon)
                
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
                        <IconButton onClick={this.handleBack.bind(this)} style={material_styles.styleLeftArrow} disabled={(this.state.libroAtras)? false: true}>
                            <ArrowLeft style={(this.state.libroAtras)? material_styles.styleArrows: DISPLAY_NONE} />
                        </IconButton>
                        <IconButton onClick={this.handleForward.bind(this)} style={material_styles.styleRightArrow} disabled={this.props.librosMostrados.length === 1}>
                            <ArrowRight style={(this.props.librosMostrados.length > 1)? material_styles.styleArrows: DISPLAY_NONE} />
                        </IconButton >
                        <div style= {(this.state.errorImgLibro.length)? { color: 'red', paddingTop: '1em' }: DISPLAY_NONE}>
                            { this.state.errorImgLibro }
                        </div>
                        <img src={this.state.libroActual.portada} alt="" className="imageExplore" onDoubleClick={this.handleDbClickImage.bind(this)}/>
                        <Favorite style={ this.tipoDeCorazon(this.state.mostrarCorazon) } />
                    </div>
                    </CardMedia>
                    <CardContent style={material_styles.width50}>
                        <Divider/>
                        <Typography gutterBottom variant='headline'>
                            {this.state.libroActual.titulo}
                        </Typography>
                        <div className="escritoPor">de:  </div><Typography gutterBottom variant='title' style={material_styles.inlineBlock}>
                            {this.state.libroActual.autor}
                        </Typography>
                        <h3 style={(this.state.libroActual.argumento)? {marginBottom: '5px'}: {display: 'none'}}>De qué va la cosa...</h3>
                        {this.state.libroActual.argumento}
                        <br/>
                        <h4 style={(this.state.libroActual.opinion)? {marginBottom: '5px'}: {display: 'none'}}>Qué opina...</h4>
                        {this.state.libroActual.opinion}
                    </CardContent>
                    <CardActions>
                        {(this.state.libroActual.idLibro)
                            ? (<div>Son {this.state.libroActual.likes} los que piensan que este libro mola
                                <Button size='small' disableRipple disableFocusRipple variant='flat' onClick={this.handleDbClickImage.bind(this)} style={material_styles.backgroundTransparent}>
                                    <Favorite style={{...material_styles.styleFavorite, fill: (this.state.meGustaLibro)? 'red': ''}} />
                                </Button>
                                <Button disableRipple size="small" variant='flat' onClick={this.handleCollapse.bind(this)} style={material_styles.styleExpandComentarios}>{(this.state.expanded)? "Ocultar comentarios": "Ver Comentarios"}
                                    {(this.state.expanded)? (<ExpandLessIcon />): (<ExpandMoreIcon />)}
                                </Button >
                            </div>)
                            : (<div></div>)
                        }
                    </CardActions>
                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            { /* Grid de comentarios */ }
                            <CommentsGrid idLibro={this.state.libroActual.idLibro} />
                        </CardContent>
                    </Collapse>
                </Card>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        indexLibro: appState.getIndiceLibro(state),
        librosMostrados: appState.getLibros(state),
        success_libro: appState.getLibroSuccess(state),
        enviandoMegusta: appState.getEnviandoMeGusta(state)
    }),
    (dispatch) => ({
        fetchLibros: (idUltimo, categorias, primeraVez) => dispatch(fetchLibros(idUltimo, categorias, primeraVez)),
        pasarLibro: () => dispatch(pasarLibro()),
        enviarMeGusta: (idLibro, idUsuario) => dispatch(enviarMeGusta(idLibro, idUsuario)),
        enviarNoMeGusta: (idLibro, idUsuario) => dispatch(enviarNoMeGusta(idLibro, idUsuario)),
    })
)(ExploreView);