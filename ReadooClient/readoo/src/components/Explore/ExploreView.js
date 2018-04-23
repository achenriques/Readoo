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
import { Grid, Row, Col } from 'react-material-responsive-grid';
import { NUM_LIBROS } from '../../constants/appConstants';

const styleFavorite = {
    height: '1em',
}

const styleCard = {
    position: 'relative',
    width: '99%',
    'max-height': '50%',
    'min-height': '100px',
    'text-align': 'center'
}

const styleLeftArrow = {
    position: 'absolute',
    top: '50%',
    left: '20px'
}

const styleRightArrow = {
    position: 'absolute',
    top: '50%',
    right: '20px'
}
const styleArrows = {
    position: 'relative',
    height: '100%',
    width: '75px',
    color: 'rgba(150, 150, 150, 0.5)'
}

class ExploreView extends Component {

    initilState = {
        libroActual: {
            titulo: '',
            autor: '',
            portada: null,
            argumento: '',
            historia: '',
            likes: 0,
        }
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initilState };
        this.props.fetchLibros(0, []);
    };

    componentWillReceiveProps(newProps) {   // TODO
        if (newProps.librosMostrados.length > 0 || newProps.indexLibro > -1) {
            this.setState({
                ...this.state,
                libroActual: {
                    titulo: newProps.librosMostrados[this.props.indexLibro].titulo,
                    autor: newProps.librosMostrados[this.props.indexLibro].autor,
                    portada: (newProps.librosMostrados[this.props.indexLibro].coverUrl)
                        ? 'data:image/png;base64, ' + newProps.librosMostrados[this.props.indexLibro].coverUrl 
                        : import('%PUBLIC_URL%/libroDefault.gif'),
                    argumento: newProps.librosMostrados[this.props.indexLibro].argumento,
                    opinion: newProps.librosMostrados[this.props.indexLibro].opinion,
                    likes: +newProps.librosMostrados[this.props.indexLibro].likes,
                }
            });
        } else {

        }
    }

    handleBack(evt) {
        
    }

    handleForward(evt) {
        this.props.pasarLibro();
    }

    render() {
        return (

            <div>
                <Card>
                    <CardMedia style={styleCard}
                    //overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
                    >
                    <div className='imageExplore'>
                        <IconButton onClick={this.handleBack.bind(this)} style={styleLeftArrow} >
                            <ArrowLeft/>
                        </IconButton>
                        <IconButton onClick={this.handleForward.bind(this)} style={styleRightArrow} >
                            <ArrowRight/>
                        </IconButton >
                        <img src={this.state.libroActual.portada} alt="" />
                    </div>
                    </CardMedia>
                    <CardTitle title={this.state.libroActual.titulo} subtitle={this.state.libroActual.autor} />
                    <CardText>
                        <h3>De que va la cosa...</h3>
                        {this.state.libroActual.argumento}
                    </CardText>
                    <CardText>
                        <h4>Qué opina...</h4>
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
        success_libro: appState.getLibroSuccess(state)
    }),
    (dispatch) => ({
        fetchLibros: (idUltimo, categorias) => dispatch(fetchLibros(idUltimo, categorias)),
        pasarLibro:() => dispatch(pasarLibro())
        //openAddLibro: (isOpen) => dispatch(setIsOpenAddLibro(isOpen)),
        //listenedUploadLibro: () => dispatch(controllerLibroDefault())
    })
)(ExploreView);