import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeTab, setIsOpenAddLibro, uploadLibro } from '../app_state/actions';
import * as appState from '../app_state/reducers';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Grid, Row, Col } from 'react-material-responsive-grid';
import '../styles/BodyContainer.css';

const COMPLETA_CAMPO = "Debes completar este campo";

const styleButton = {
    position: 'absolute',
    bottom: '50px',
    right: '50px',
}

const customDialog = {
    maxWidth: 'none',
    maxHeight: '85%',
    width: '85%',
    height: '75%'
};

const textAlginBottom = {
    verticalAlign: 'bottom'
};

const portadaPreview = {
    height: '75%',
};

class BodyContainer extends Component {

    initialState = {
        add_libro_titulo: "",
        add_libro_autor: "",
        add_libro_historia: "",
        add_libro_opinion: "",
        add_libro_imagen: null,

        error: {
            add_libro_titulo: "",
            add_libro_autor: "",
            add_libro_historia: "",
            add_libro_opinion: "",
            add_libro_imagen: false
        },
    };

    constructor(props) {
        super(props);
        this.state = {...this.initialState};
    };

    oChangeInput = (evt) => {
        const value = evt.target.value;
        const name = evt.target.name;

        const callState = () => {
            if (this.state.error[name] !== "") {
                this.setState({
                    ...this.state,
                    error: {
                        ...this.state.error,
                        [name]: ""
                    }
                });
            }
        };

        this.setState({
            ...this.state,
            [name]: value
        }, callState);
    }

    subirLibro_aceptar = () => {
        this.setState({
            ...this.state,
            error: {
                add_libro_titulo: (this.state.add_libro_titulo === "")? COMPLETA_CAMPO : "",
                add_libro_autor: (this.state.add_libro_autor === "")? COMPLETA_CAMPO : "",
                add_libro_historia: (this.state.add_libro_historia === "")? COMPLETA_CAMPO : "",
                add_libro_imagen: (this.state.add_libro_imagen == null)? true : false,
            }
        });

        if (this.state.add_libro_titulo && this.state.add_libro_autor 
            && this.state.add_libro_historia && this.state.add_libro_imagen != null) {
                this.props.uploadLibro({
                    titulo: this.state.add_libro_titulo,
                    autor: this.state.add_libro_autor,
                    historia: this.state.add_libro_historia,
                    opinion: this.state.add_libro_opinion,
                    img: this.state.add_libro_imagen
                }
            );
        }
    };

    cargarImagenPortada = (evt) => {
        const callState = () => {
            if (this.state.error.add_libro_imagen == true) {
                this.setState({
                    ...this.state,
                    error: {
                        ...this.state.error,
                        add_libro_imagen: false
                    }
                });
            }
        };

        if (evt.target.files[0]) {
            this.setState({
                add_libro_imagen: (URL.createObjectURL(evt.target.files[0]))? URL.createObjectURL(evt.target.files[0]): null
            }, callState);
        }
    }

    handleOpen = () => {
        this.props.openAddLibro(true);
    };

    handleClose = () => {
        this.setState({...this.initialState});
        this.props.openAddLibro(false);
    };

    render() {
        const actions = [
            <FlatButton
                label="Cancelar"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Súbelo"
                primary={true}
                //disabled={true}
                onClick={this.subirLibro_aceptar.bind(this)}
            />,
        ];

        switch (this.props.selectedIndex) {
            case 0:
                return (
                    <div>
                        <h1 align="center">
                            Soy un body
                        </h1>
                        <input type="button" onClick={this.pruebas} />
                        <FloatingActionButton onClick={this.handleOpen} style={styleButton}>
                            <ContentAdd />
                        </FloatingActionButton>
                        <Dialog
                            title="Subir mi libro"
                            actions={actions}
                            modal={true}
                            open={this.props.isOpenModal}
                            contentStyle={customDialog}
                        >
                            <Grid>
                                <Row>
                                    <Col sm={6}>
                                        <TextField
                                            name="add_libro_titulo"
                                            id="addTituloLibro"
                                            hintText="Título del libro"
                                            fullWidth
                                            maxLength="45"
                                            errorText={this.state.error.add_libro_titulo}
                                            onChange={this.oChangeInput.bind(this)}
                                        /><br />
                                        <TextField
                                            name="add_libro_autor"
                                            id="addAutorLibro"
                                            hintText="Título del libro"
                                            fullWidth
                                            maxLength="45"
                                            errorText={this.state.error.add_libro_autor}
                                            onChange={this.oChangeInput.bind(this)}
                                        /><br />
                                        <TextField
                                            name="add_libro_historia"
                                            id="addDescripcionLibro"
                                            hintText="Describe un poco la historia, no lo cuentes TODO!"
                                            multiLine={true}
                                            rows={2}
                                            rowsMax={4}
                                            fullWidth
                                            maxLength="140"
                                            style={textAlginBottom}
                                            errorText={this.state.error.add_libro_historia}
                                            onChange={this.oChangeInput.bind(this)}
                                        /><br />
                                        <TextField
                                            name="add_libro_opinion"
                                            id="addOpinionLibro"
                                            hintText="Escribe tu opinión personal"
                                            multiLine={true}
                                            rows={2}
                                            rowsMax={4}
                                            fullWidth
                                            maxLength="140"
                                            style={textAlginBottom}
                                            onChange={this.oChangeInput.bind(this)}
                                        /><br />
                                    </Col>
                                    <Col sm={6}>
                                        <Paper zDepth={4} rounded={false} style={portadaPreview}>
                                            <img src={this.state.add_libro_imagen} className="imagenPortadaPreview" />
                                        </Paper>
                                        <br />
                                        <RaisedButton
                                            label="Elige una imagen de la portada"
                                            labelPosition="before"
                                            containerElement="label"
                                            fullWidth
                                        >
                                            <input type="file" className="imageInput" accept="image/*" onChange={this.cargarImagenPortada.bind(this)} />
                                        </RaisedButton>
                                        <p id="error_add_img" className="errorInput" hidden={!this.state.error.add_libro_imagen}>
                                            Debes añadir una imagen de la portada
                                        </p>
                                    </Col>
                                </Row>
                            </Grid>
                        </Dialog>
                    </div>
                );

            case 1:
                return (
                    <div>
                        <h1 align="center">
                            Soy un body 2
                        </h1>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <h1 align="center">
                            Soy un body 3
                    </h1>
                    </div>
                );

            case 3:
                return (
                    <div>
                        <h1 align="center">
                            Soy un body 4
                    </h1>
                    </div>
                );

            default:
                break;
        }

    }
}

export default connect(
    (state) => ({
        isOpenModal: appState.getIsOpenModal(state).isOpenAddLibro,
        selectedIndex: appState.getCurrentTabID(state)
    }),
    (dispatch) => ({
        changeTab: (tabID) => dispatch(changeTab(tabID)),
        openAddLibro: (isOpen) => dispatch(setIsOpenAddLibro(isOpen)),
        uploadLibro: (datosLibro) => dispatch(uploadLibro(datosLibro))
    })
)(BodyContainer);