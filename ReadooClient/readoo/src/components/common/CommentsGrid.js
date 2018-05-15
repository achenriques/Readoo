import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchComentarios } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Avatar from 'material-ui/Avatar';
import material_styles from './material_styles';
import NUM_COMENTARIOS from '../../constants/appConstants';

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
        /*if (newProps.libroActual) {
            //this.fetchComentarios(newProps.libro, NUM_COMENTARIOS, fechaUltimoComentario) //DOING this
        }
        if (newProps.comentariosMostrados) {
            this.setState({
                ...this.state,
                cargadosComentarios: 1
            })
        }*/ //TODO
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
                <div style={material_styles.styleChildren}>
                {(comentario.subComentarios.length > 1)? 'Respuestas': 'Respuesta'}
                    <GridList
                        cols={1}
                        cellHeight='auto'
                        padding={10}
                        style={material_styles.styleChildrenList}
                    >
                    {comentario.subComentarios.map((subComment) => (
                        <GridTile
                            key={subComment.idComentario}
                            title={subComment.usuario}
                            actionIcon={<IconButton><StarBorder color="white" ><Avatar src="" /></StarBorder></IconButton>}
                            actionPosition="left"
                            titlePosition="top"
                            titleBackground={"linear-gradient(to bottom right, rgba(255,255,255,0.7) 0%, " + this.colorAleatorio() + " 50%,rgba(0,0,0,0) 100%)"}
                            titleStyle={{color: 'black'}}
                            style={{borderRadius: '20px', background: 'lightgrey'}}
                            cols={1}
                            rows={1}
                        >
                            <div className='divComentario'> {subComment.comentario} </div>
                        </GridTile>
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
                    <div style={material_styles.styleRoot}>
                        <GridList
                            cols={2}
                            rows={1.5}
                            cellHeight='auto'
                            padding={15}
                            style={material_styles.styleGridList}
                        >
                        {/*this.props.comentarios*/this.comentarios.map((comment) => (
                            <GridTile
                                key={comment.idComentario}
                                title={comment.usuario}
                                actionIcon={<IconButton><StarBorder color="white" ><Avatar src="" /></StarBorder></IconButton>}
                                actionPosition="left"
                                titlePosition="top"
                                titleStyle={{color: 'black'}}
                                titleBackground={"linear-gradient(to bottom right, rgba(255,255,255,0.7) 0%, " + this.colorAleatorio() + " 50%,rgba(0,0,0,0) 100%)"}
                                titleStyle={{color: 'black', borderRadius: '20px'}}
                                style={{borderRadius: '20px', background: 'lightgrey'}}
                                cols={1}
                                rows={1}
                            >
                                <div>
                                    <div className='divComentario'> {comment.comentario} </div>
                                    {this.mostrarSubComentarios(comment)}
                                    <TextField
                                        hintText="Escribe tu respuesta"
                                        maxLength="140"
                                        fullWidth={true}
                                    />
                                </div>
                            </GridTile>
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
        //comentariosMostrados: appState.getComentarios(state),
    }),
    (dispatch) => ({
        //fetchComentarios: (libro, numComentarios, fechaUltimo) => dispatch(fetchComentarios(libro, numComentarios, fechaUltimo)),
    })
)(CommentsGrid);
