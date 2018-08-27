import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setIsOpenAddLibro, uploadLibro, fetchCategorias } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { DISPLAY_NONE } from '../../constants/appConstants';

const COMPLETA_CAMPO = "Debes completar este campo";
const SELECCIONA_CAMPO = "Debes seleccionar al menos una categoría";

const customDialog = {
    maxWidth: 'none',
    maxHeight: '85%',
    width: '85%',
    height: '75%'
};

const portadaPreview = {
    height: '300px',
    maxHeight: '100%'
};

class SubirLibroModal extends Component {

    initialState = {
        disabledButton: false,
        add_libro_titulo: "",
        add_libro_autor: "",
        add_libro_historia: "",
        add_libro_opinion: "",
        add_libro_categoria: null,
        add_libro_imagen: null,
        add_libro_imagen_file: null,
        categoria_items: [],

        error: {
            add_libro_titulo: "",
            add_libro_autor: "",
            add_libro_historia: "",
            add_libro_opinion: "",
            add_libro_categoria: "",
            add_libro_imagen: false
        },
    };

    categoria_items = [];

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
        props.fetchCategorias();
    };

    // CICLO DE VIDA
    componentWillReceiveProps(nextProps) {
        if (nextProps.uploadLibroSuccess) {
            this.setState({
                ...this.state,
                disabledButton: false
            })
        }

        if (nextProps.categorias) {
            let menuItems = nextProps.categorias.map((i) => {
                return <MenuItem key={i.idCategoria} value={i.idCategoria} primaryText={i.tipo} />;
            });
            this.categoria_items = menuItems;
            this.setState({
                ...this.state,
                categoria_items: menuItems
            })
        }
    }

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
                add_libro_categoria: this.state.add_libro_categoria === null || this.state.add_libro_categoria === "",
                add_libro_imagen: (this.state.add_libro_imagen == null) ? true : false,
            }
        });

        if (this.state.add_libro_titulo && this.state.add_libro_autor
            && this.state.add_libro_historia && this.state.add_libro_imagen != null) {
            this.setState({
                ...this.state,
                disabledButton: true,
            });

            var formData = new FormData();
            formData.set('titulo', this.state.add_libro_titulo);
            formData.set('autor', this.state.add_libro_autor);
            formData.set('descripcion', this.state.add_libro_historia);
            formData.set('opinion', this.state.add_libro_opinion);
            formData.set('portada', this.state.add_libro_imagen_file);
            formData.set('usuario', 2);     // TODO : cambiar
            formData.set('categoria', this.state.add_libro_categoria);

            this.props.uploadLibro({
                form: formData
            });
        }
    }

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
        this.setState({ 
            ...this.initialState,
            disabledButton: false,
            categoria_items: this.categoria_items
        }, this.props.openAddLibro.bind(this, false));
    }

    handleCategoria = (event, index, value) => {
        const callState = () => {
            if (this.state.error.add_libro_categoria !== "") {
                this.setState({
                    ...this.state,
                    error: {
                        ...this.state.error,
                        add_libro_categoria: ""
                    }
                });
            }
        };

        this.setState({
            ...this.state,
            add_libro_categoria: value
        }, callState);
    }

    render() {
        /* const items = [
            <MenuItem key={1} value={1} primaryText="Never" />,
            <MenuItem key={2} value={2} primaryText="Every Night" />,
            <MenuItem key={3} value={3} primaryText="Weeknights" />,
            <MenuItem key={4} value={4} primaryText="Weekends" />,
            <MenuItem key={5} value={5} primaryText="Weekly" />,
        ]; */

        return (
            <Dialog
                title="Subir mi libro"
                open={this.props.isOpenModal}
                //onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
                classes={{
                    paper: 'dialogUploadBook'
                }}
            >
                <DialogTitle>Subir mi libro</DialogTitle>
                <DialogContent fullWidth>
                    <Grid container>
                            <Grid item sm={6} className="uploadBookLeftGrid">
                                <TextField
                                    name="add_libro_titulo"
                                    id="addTituloLibro"
                                    label="Título del libro"
                                    fullWidth
                                    inputProps={{
                                        maxLength: 45
                                    }}
                                    required
                                    error={this.state.error.add_libro_titulo != ""}
                                    errorText={this.state.error.add_libro_titulo}
                                    onChange={this.oChangeInput.bind(this)}
                                    className="paddingTextFields"
                                /><br />
                                <TextField
                                    name="add_libro_autor"
                                    id="addAutorLibro"
                                    label="Título del libro"
                                    fullWidth
                                    inputProps={{
                                        maxLength: 45
                                    }}
                                    required
                                    error={this.state.error.add_libro_autor != ""}
                                    errorText={this.state.error.add_libro_autor}
                                    onChange={this.oChangeInput.bind(this)}
                                    className="paddingTextFields"
                                /><br />
                                <TextField
                                    name="add_libro_historia"
                                    id="addDescripcionLibro"
                                    label="Describe un poco la historia, no lo cuentes TODO!"
                                    multiline
                                    rowsMax="4"
                                    fullWidth
                                    inputProps={{
                                        maxLength: 140,
                                    }}
                                    required
                                    error={this.state.error.add_libro_historia != ""}
                                    errorText={this.state.error.add_libro_historia}
                                    onChange={this.oChangeInput.bind(this)}
                                    className="paddingTextFields"
                                /><br />
                                <TextField
                                    name="add_libro_opinion"
                                    id="addOpinionLibro"
                                    label="Escribe tu opinión personal"
                                    multiline
                                    rowsMax="4"
                                    fullWidth
                                    inputProps={{
                                        maxLength: 140,
                                    }}
                                    required
                                    onChange={this.oChangeInput.bind(this)}
                                    className="paddingTextFields"
                                /><br />
                                <FormControl /*className={classes.formControl}*/>
                                    <InputLabel htmlFor="selectCategoriasSubir">Selecciona una categoria</InputLabel>
                                    <Select
                                        multiple
                                        value={this.state.add_libro_categoria}
                                        onChange={this.handleCategoria}
                                        input={<Input id="selectCategoriasSubir" />}
                                        renderValue={selected => selected.join(', ')}
                                        style={{ width: '100%' }}
                                    >
                                        {this.state.categoria_items.map((name, index, list) => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox checked={this.state.name.indexOf(name) > -1} />
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                        ))}
                                    </Select>
                                    <p id="error_add_category" className="errorInput" hidden={!this.state.error.add_libro_categoria}>
                                        Debes eligir al menos una categoría
                                    </p>
                                </FormControl>
                            </Grid>
                            <Grid item sm={6} className="uploadBookLeftGrid">
                                <Paper zDepth={4} rounded={false} style={portadaPreview}>
                                    <img src={this.state.add_libro_imagen} alt="Necesitas una imagen" className="imagenPortadaPreview" />
                                </Paper>
                                <br />
                                <div className="divBotonSubirAvatar">
                                    <input
                                        id="botonSubirLibro"
                                        accept="image/*"
                                        type="file"
                                        style={DISPLAY_NONE} 
                                        className="imageInput" 
                                        onChange={this.cargarImagenPortada.bind(this)} 
                                    />
                                    <label htmlFor="botonSubirLibro">
                                        <Button variant="outlined" component="span" className="" fullWidth>
                                            AÑADE UNA IMAGEN DE PORTADA
                                        </Button>
                                    </label>
                                </div>
                                <p id="error_add_img" className="errorInput" hidden={!this.state.error.add_libro_imagen}>
                                    Debes añadir una imagen de la portada
                                </p>
                            </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button variant="contained" color="primary"
                            onClick={this.handleClose.bind(this)}
                        >
                            CANCELAR
                        </Button>
                        <Button variant="contained" color="primary" 
                            disabled={this.state.disabledButton}
                            onClick={this.subirLibro_aceptar.bind(this)}
                        >
                            SÚBELO
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        );
    }
}

export default connect(
    (state) => ({
        isOpenModal: appState.getIsOpenModal(state).isOpenAddLibro,
        selectedIndex: appState.getCurrentTabID(state),
        uploadLibroSuccess: appState.libroSuccessUpload(state),
        categorias: appState.allCategorias(state)
    }),
    (dispatch) => ({
        openAddLibro: (isOpen) => dispatch(setIsOpenAddLibro(isOpen)),
        uploadLibro: (datosLibro) => dispatch(uploadLibro(datosLibro)),
        fetchCategorias: () => dispatch(fetchCategorias())
    })
)(SubirLibroModal);