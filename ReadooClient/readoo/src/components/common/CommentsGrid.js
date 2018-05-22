import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchComentarios } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import { Grid, Row, Col } from 'react-material-responsive-grid';
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Send from 'material-ui/svg-icons/content/send';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import material_styles from './material_styles';
import { NUM_COMENTARIOS } from '../../constants/appConstants';

class CommentsGrid extends Component {

    initialState = {
        cargadosComentarios: 0,  // 1 para cargados, -1 para error
        comentariosLibros: []
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
    ]

    constructor(props) {
        super(props);
        this.state = { ...this.initilState };
    };

    componentWillReceiveProps(newProps) {
        if (newProps.idLibro > 0) {
            let fechaUltimoComentario = new Date();
            // todo fecha
            this.props.fetchComentarios(newProps.idLibro, NUM_COMENTARIOS, null)
        }
        if (newProps.comentariosMostrados) {
            this.setState({
                ...this.state,
                cargadosComentarios: 1,
                comentarios: newProps.comentariosMostrados
            })
        }
    }

    colorAleatorio() {
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

    mostrarSubComentarios = (comentario) => {
        if (comentario.subComentarios.length) {
            return (
                <div style={material_styles.styleChildren} >
                    <Divider style={material_styles.styleCommentSeparator}/>
                    <div className="respuestaComentario">
                        {(comentario.subComentarios.length > 1)? 'Respuestas': 'Respuesta'}
                    </div>
                    <GridList
                        cols={1}
                        cellHeight='auto'
                        padding={10}
                        style={material_styles.styleChildrenList}
                    >
                    {comentario.subComentarios.map((subComment) => (
                        <Paper zDepth={1} >
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
            )
        }
    }

    render() {
        switch (this.state.cargadosComentarios) {
            case 0:
                return (
                    <div>
                        <h3>Cargando...</h3>
                    </div>
                )
                break;

            default:
            //case 1:
                return (
                    <div style={material_styles.styleChildren} >
                        <GridList
                            cols={2}
                            rows={1.5}
                            cellHeight='auto'
                            padding={15}
                            style={material_styles.styleGridList}
                        >
                        {/*this.props.comentarios*/this.comentarios.map((comment) => (
                            <Paper zDepth={4} >
                                <GridTile
                                    key={comment.idComentario}
                                    title={comment.usuario}
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
                                        <div className='divComentario'> {comment.comentario} </div>
                                        {this.mostrarSubComentarios(comment)}
                                        <Divider style={material_styles.styleCommentSeparator}/>
                                        <Grid>
                                            <Row>
                                                <Col sm={10}>
                                                    <TextField
                                                        hintText="Escribe tu respuesta"
                                                        maxLength="140"
                                                        multiLine={true}
                                                        rows={1}
                                                        fullWidth={true}
                                                    />
                                                </Col>
                                                <Col sm={2}>
                                                    <IconButton style={material_styles.styleSendButton}><Send/></IconButton>
                                                </Col>
                                            </Row>
                                        </Grid>
                                    </div>
                                </GridTile>
                            </Paper>
                        ))}
                        </GridList>
                    </div>
                );
                break;
/*
            case -1:
                return (
                    <div>
                        <h3>Jope, ha ocurrido un error...</h3>
                    </div>
                );
                break;

            default:
                return (
                    <div>
                        <h3>Cargando...</h3>
                    </div>
                );  
                break;
*/
        }
    }
}

export default connect(
    (state) => ({
        comentariosMostrados: appState.getComentarios(state),
    }),
    (dispatch) => ({
        fetchComentarios: (idLibro, numComentarios, fechaUltimo) => dispatch(fetchComentarios(idLibro, numComentarios, fechaUltimo)),
    })
)(CommentsGrid);
