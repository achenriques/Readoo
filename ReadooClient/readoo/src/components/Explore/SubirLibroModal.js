import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setIsOpenAddLibro, uploadLibro } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Col } from 'react-material-responsive-grid';

const COMPLETA_CAMPO = "Debes completar este campo";
const SELECCIONA_CAMPO = "Debes seleccionar al menos una categoría";

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
    height: '300px',
    maxHeight: '100%'
};

class SubirLibroModal extends Component {

    initialState = {
        add_libro_titulo: "",
        add_libro_autor: "",
        add_libro_historia: "",
        add_libro_opinion: "",
        add_libro_categoria: null,
        add_libro_imagen: null,
        add_libro_imagen_file: null,

        error: {
            add_libro_titulo: "",
            add_libro_autor: "",
            add_libro_historia: "",
            add_libro_opinion: "",
            add_libro_categoria: "",
            add_libro_imagen: false
        },
    };

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
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
                add_libro_titulo: (this.state.add_libro_titulo === "") ? COMPLETA_CAMPO : "",
                add_libro_autor: (this.state.add_libro_autor === "") ? COMPLETA_CAMPO : "",
                add_libro_historia: (this.state.add_libro_historia === "") ? COMPLETA_CAMPO : "",
                add_libro_categoria: (this.state.add_libro_categoria === "") ? SELECCIONA_CAMPO : "",
                add_libro_imagen: (this.state.add_libro_imagen == null) ? true : false,
            }
        });

        if (this.state.add_libro_titulo && this.state.add_libro_autor
            && this.state.add_libro_historia && this.state.add_libro_imagen != null) {
            var formData = new FormData();
            formData.set('titulo', this.state.add_libro_titulo);
            formData.set('autor', this.state.add_libro_autor);
            formData.set('descripcion', this.state.add_libro_historia);
            formData.set('opinion', this.state.add_libro_opinion);
            formData.set('portada', this.state.add_libro_imagen_file);
            formData.set('usuario', 2);     // TODO : cambiar
            formData.set('categoria', 22);

            this.props.uploadLibro({
                form: formData
            }
            );
        }
    };

    cargarImagenPortada = (evt) => {
        const callState = () => {
            if (this.state.error.add_libro_imagen === true) {
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
                add_libro_imagen: (URL.createObjectURL(evt.target.files[0])) ? URL.createObjectURL(evt.target.files[0]) : null,
                add_libro_imagen_file: evt.target.files[0] ? evt.target.files[0] : null
            }, callState);
        }
    }

    handleClose = () => {
        this.setState({ ...this.initialState });
        this.props.openAddLibro(false);
    };

    render() {
        const items = [
            <MenuItem key={1} value={1} primaryText="Never" />,
            <MenuItem key={2} value={2} primaryText="Every Night" />,
            <MenuItem key={3} value={3} primaryText="Weeknights" />,
            <MenuItem key={4} value={4} primaryText="Weekends" />,
            <MenuItem key={5} value={5} primaryText="Weekly" />,
        ];

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

        return (
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
                            <SelectField
                                value={this.state.add_libro_categoria}
                                onChange={this.handleCategoria}
                                floatingLabelText="Selecciona una categoria"
                                errorText={this.state.error.add_libro_categoria}
                                fullWidth
                            >
                                {items}
                            </SelectField>
                        </Col>
                        <Col sm={6}>
                            <Paper zDepth={4} rounded={false} style={portadaPreview}>
                                <img src={this.state.add_libro_imagen} alt="Necesitas una imagen" className="imagenPortadaPreview" />
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
        );
    }
}

export default connect(
    (state) => ({
        isOpenModal: appState.getIsOpenModal(state).isOpenAddLibro,
        selectedIndex: appState.getCurrentTabID(state)
    }),
    (dispatch) => ({
        openAddLibro: (isOpen) => dispatch(setIsOpenAddLibro(isOpen)),
        uploadLibro: (datosLibro) => dispatch(uploadLibro(datosLibro))
    })
)(SubirLibroModal);
