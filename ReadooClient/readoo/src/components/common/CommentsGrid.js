import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchComentarios, enviarComentario } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Grid from '@material-ui/core/Grid';
// TODO change GridList
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
// FIXME borrar start
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import material_styles from './material_styles';
import { NUM_COMENTARIOS, REST_FAILURE, REST_SUCCESS, REST_DEFAULT } from '../../constants/appConstants';

class CommentsGrid extends Component {

    initialState = {
        cargadosComentarios: null,  // 1 para cargados, -1 para error
        comentariosLibros: [],
        nuevoComentario: '',
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.getfetchComentarioSuccess && REST_FAILURE === nextProps.getfetchComentarioSuccess) {
            return ({
                ...prevState,
                cargadosComentarios: REST_FAILURE
            });
        }

        if (nextProps.idLibro > 0 /*&& prevState.cargadosComentarios !== REST_DEFAULT*/) {
            let fechaUltimoComentario = null;
            if (prevState.comentariosLibros && prevState.comentariosLibros.length) {
                fechaUltimoComentario = new Date(Math.max.apply(null, prevState.comentariosLibros.map(function(e) {
                    return new Date(e.fecha);
                  })));
            }
            // todo fecha
            (nextProps.fetchComentarios) && nextProps.fetchComentarios(nextProps.idLibro, NUM_COMENTARIOS, fechaUltimoComentario);
            return ({ ...prevState, cargadosComentarios: REST_DEFAULT });
        } else
        if (nextProps.comentariosMostrados == null) {
            return ({
                ...prevState,
                cargadosComentarios: REST_FAILURE,
                comentariosLibros: null
            })
        } else
        if (nextProps.comentariosMostrados && prevState.cargadosComentarios === REST_DEFAULT) {
            return ({
                ...prevState.state,
                cargadosComentarios: REST_SUCCESS,
                comentarios: nextProps.comentariosMostrados
            })
        } else
        return null;
    }

    comentarios = [
        {   
            idComentario: 1,
            usuario: "Minervo",
            comentario: "Ou la la!",
            subComentarios: []
        },
        {   
            idComentario: 2,
            usuario: "Minervo",
            comentario: "Ou la la!",
            subComentarios: []
        },
        {   
            idComentario: 3,
            usuario: "Minervo",
            comentario: "Ou la lelo!",
            subComentarios: [ 
                {
                    idComentario: 13,
                    usuario: "Minervo",
                    comentario: "Me gusta lo que has dicho",
                },  {
                    idComentario: 14,
                    usuario: "Minerv1",
                    comentario: "Adios vella",
                } 
            ]
        },
        {   
            idComentario: 4,
            usuario: "Minervo",
            comentario: "Ou la la!",
            subComentarios: []
        },
        {   
            idComentario: 5,
            usuario: "Minervo",
            comentario: "Ou la la!",
            subComentarios: []
        },
        {   
            idComentario: 6,
            usuario: "Minervo",
            comentario: "Ou la la!",
            subComentarios: []
        },
    ]

    constructor(props) {
        super(props);
        this.state = { ...this.initilState };
    };

    colorAleatorio () {
        let ran = Math.round(Math.random() * 5);
        
        switch (ran) {
            case 0:
                return 'rgba(159, 159, 237, 0.8)'
                break;
        
            case 1:
                return 'rgba(242, 223, 215, 0.8)'
                break;

            case 2:
                return 'rgba(254, 249, 170, 0.8)'
                break;

            case 3:
                return 'rgba(72, 190, 255, 0.8)'
                break;

            case 4:
                return 'rgba(105, 234, 127, 0.8)'
                break;
            default:
                return 'rgba(255, 204, 102 , 0.8)'
                break;
        }
    }

    changeNuevoComentario (evt) {
        (evt) && this.setState({
            ...this.state,
            nuevoComentario: evt.currentTarget.value
        })
    }

    enviarComentario (evt, idComentario, idLibro) {
        if (this.state.nuevoComentario) {
            let textoComentario = this.state.nuevoComentario.trim();

            this.props.enviarComentario(idComentario, idLibro, 2, /* TODO: usuario*/ textoComentario);
        }
    }

    mostrarSubComentarios (comentario) {
        if (comentario.subComentarios.length) {
            return (
                <div>
                    <div className="respuestaComentario">
                        {(comentario.subComentarios.length > 1)? 'Respuestas': 'Respuesta'}
                    </div>
                    <div style={material_styles.styleChildren} >
                        <GridList
                            cols={1}
                            cellHeight='auto'
                            padding={10}
                            style={material_styles.styleChildrenList}
                        >
                        {comentario.subComentarios.map((subComment) => (
                            <Paper elevation={1} >
                                <GridTile
                                    key={subComment.idComentario}
                                    title={subComment.usuario}
                                    actionIcon={<IconButton><StarBorder color="white" style={{width: '30px', heigth: '30px' }}><Avatar src="" /></StarBorder></IconButton>}
                                    actionPosition="left"
                                    titlePosition="top"
                                    titleBackground={"linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(0, 0, 0 , 0.3) 50%,rgba(0,0,0,0) 100%)"}
                                    titleStyle={{color: 'black', heigth: '30px'}}
                                    cols={1}
                                    rows={1}
                                >
                                    <div className='divComentario'> {subComment.comentario} </div>
                                </GridTile>
                            </Paper>
                        ))}
                        </GridList>
                    </div>
                </div>
            )
        }
    }

    render() {
        switch (this.state.cargadosComentarios) {
            case -1:
                return (
                    <div className="cargandoComentarios">
                        <h3>Error en la carga de comentarios puede ser un problema de red o fallo del servidor...</h3>
                    </div>
                )
            case 0:
                return (
                    <div className="cargandoComentarios">
                        <h3>Cargando...</h3>
                    </div>
                )
                break;

            case 1:
                if (this.state.comentarios.length) {
                    return (
                        <div style={material_styles.styleRoot} >
                            <GridList
                                cols={2}
                                rows={1.5}
                                cellHeight='auto'
                                padding={15}
                                style={material_styles.styleGridList}
                            >
                            {/*this.props.comentarios*/this.props.comentarios.map((comentario) => (
                                <Paper elevation={4} >
                                    <GridTile
                                        key={comentario.idComentario}
                                        title={comentario.usuario}
                                        actionIcon={<IconButton><StarBorder color="white" ><Avatar src="" /></StarBorder></IconButton>}
                                        actionPosition="left"
                                        titlePosition="top"
                                        titleBackground={"linear-gradient(to bottom right, rgba(255,255,255,0.7) 0%, rgba(0, 0, 0 , 0.2) 50%,rgba(0,0,0,0) 100%)"}
                                        titleStyle={{color: 'black' }}
                                        style={{heigth: '30px'}}
                                        cols={1}
                                        rows={1}
                                    >
                                        <div>
                                            <div className='divComentario'> {comentario.comentario} </div>
                                            <Divider style={material_styles.styleCommentSeparator}/>
                                            {this.mostrarSubComentarios(comentario)}
                                            <div className="divRespuestaComentario">
                                                <Grid container spacing={24}>
                                                    <Grid item sm={10}>
                                                        <TextField
                                                            label="Escribe tu respuesta"
                                                            maxLength="140"
                                                            multiline
                                                            rowsMax="2"
                                                            fullWidth={true}
                                                            onChange={this.changeNuevoComentario.bind(this)}
                                                        />
                                                    </Grid>
                                                    <Grid item sm={1}>
                                                        <IconButton color="primary" onClick={() => {this.enviarComentario(this, null, this.props.idLibro)}} style={material_styles.styleSendButton}>
                                                            <Send/>
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </div>
                                    </GridTile>
                                </Paper>
                            ))}
                            </GridList>
                        </div>
                    );
                }

            default:
                if (this.props.idLibro > 0) {
                    return (
                        <div>
                            <h3 className="margenNoComentarios" >No hay ningún comentario. Sé tu el primero en romper el hielo...</h3>
                            <div className="divRespuestaComentario">
                                <Grid container spacing={24}>
                                    <Grid item sm={10}>
                                        <TextField
                                            label="Escribe un comentario digno de un gran lector"
                                            maxLength="140"
                                            multiline
                                            rowsMax="2"
                                            fullWidth={true}
                                            onChange={this.changeNuevoComentario.bind(this)}
                                        />
                                    </Grid>
                                    <Grid item sm={1} style={{position: 'relative'}}>
                                        <IconButton color="primary" onClick={() => {this.enviarComentario(this, null, this.props.idLibro)}} style={material_styles.styleSendButton}>
                                            <Send/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    );  
                } else {
                    return (
                        <h3 className="margenNoComentarios" >No contrates Jastel!</h3>
                    )
                }
                break;
        }
    }
}

export default connect(
    (state) => ({
        comentariosMostrados: appState.getComentarios(state),
        getfetchComentarioSuccess: appState.getfetchComentarioSuccess(state)
    }),
    (dispatch) => ({
        fetchComentarios: (idLibro, numComentarios, fechaUltimo) => dispatch(fetchComentarios(idLibro, numComentarios, fechaUltimo)),
        enviarComentario: (idComentario, idLibro, idUsuario, comentario) => dispatch(enviarComentario(idComentario, idLibro, idUsuario, comentario))
    })
)(CommentsGrid);
