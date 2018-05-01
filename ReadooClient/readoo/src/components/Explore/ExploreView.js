import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setIsOpenAddLibro, fetchLibros, pasarLibro, controllerLibroDefault } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import Favorite from 'material-ui/svg-icons/action/favorite';
import { NUM_LIBROS, DISPLAY_NONE } from '../../constants/appConstants';
import libroDefault from '../../resources/libroDefault.gif';

const styleFavorite = {
    height: '1em',
}

const styleCard = {
    position: 'relative',
    width: '99%',
    maxHeight: '500px',
    minHeight: '100px',
    textAlign: 'center'
}

const styleLeftArrow = {
    position: 'absolute',
    height: '100%',
    width: '77px',
    //top: '50%',
    left: '20px'
}

const styleRightArrow = {
    position: 'absolute',
    height: '100%',
    width: '77px',
    //top: '50%',
    right: '20px'
}
const styleArrows = {
    position: 'relative',
    height: '75px',
    width: '75px',
    color: 'rgba(150, 150, 150, 0.5)'
}

class ExploreView extends Component {

    initilState = {
        estoyLibroAtras: false,
        libroAtras : null,
        libroActual: {
            titulo: '',
            autor: '',
            portada: null,
            argumento: '',
            historia: '',
            likes: 0,
        },
        errorImgLibro: false,
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
        this.props.fetchLibros(0, []);
    }

    componentWillReceiveProps(newProps) {
        this.cargarLibroActualFromProps (newProps);
    }

    handleBack(evt) {
        this.setState({
            ...this.state,
            errorImgLibro: (!this.state.libroAtras.coverUrl)? "Oh oh! No se ha cargado la imagen. Que mal!": '',
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

    render() {        
        return (
            <div>
                <Card>
                    <CardMedia style={styleCard}
                    //overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
                    >
                    <div className='imageExplore'>
                        <IconButton onClick={this.handleBack.bind(this)} iconStyle={(this.state.libroAtras)? styleArrows: DISPLAY_NONE} style={styleLeftArrow} disabled={(this.state.libroAtras)? false: true}>
                            <ArrowLeft viewBox="7 5 15 15"/>
                        </IconButton>
                        <IconButton onClick={this.handleForward.bind(this)} iconStyle={(this.props.librosMostrados.length > 1)? styleArrows: DISPLAY_NONE} style={styleRightArrow} disabled={this.props.librosMostrados.length === 1}>
                            <ArrowRight viewBox="7 5 15 15"/>
                        </IconButton >
                        <div style= {(this.state.errorImgLibro.length)? { color: 'red', paddingTop: '1em' }: DISPLAY_NONE}>
                            { this.state.errorImgLibro }
                        </div>
                        <img src={this.state.libroActual.portada} alt="" className="imageExplore"/>
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
                        Son {this.state.libroActual.likes} los que piensan que este libro mola
                        <Favorite style={styleFavorite} />
                    </CardText>
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
    }),
    (dispatch) => ({
        fetchLibros: (idUltimo, categorias) => dispatch(fetchLibros(idUltimo, categorias)),
        pasarLibro:() => dispatch(pasarLibro())
        //openAddLibro: (isOpen) => dispatch(setIsOpenAddLibro(isOpen)),
        //listenedUploadLibro: () => dispatch(controllerLibroDefault())
    })
)(ExploreView);