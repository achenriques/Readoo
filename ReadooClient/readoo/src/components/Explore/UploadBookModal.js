import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setIsOpenAddBook, uploadBook, fetchGenres } from '../../app_state/actions';
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

const coverPreview = {
    height: '300px',
    maxHeight: '100%'
};

class UploadBookModal extends Component {

    initialState = {
        disabledButton: false,
        addBookTitle: "",
        addBookAuthor: "",
        addBookDescription: "",
        addBookReview: "",
        addBookGenre: null,
        addBookCover: null,
        addBookCoverFile: null,
        genreItems: [],

        error: {
            addBookTitle: "",
            addBookAuthor: "",
            addBookDescription: "",
            addBookReview: "",
            addBookGenre: "",
            addBookCover: false
        },
    };

    genreItems = [];

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
        props.fetchGenres();
    };

    // CICLO DE VIDA
    componentWillReceiveProps(nextProps) {
        // TODO: revisar este if
        /* if (nextProps.uploadLibroSuccess) {
            this.setState({
                ...this.state,
                disabledButton: false
            })
        } */

        if (nextProps.genres) {
            let menuItems = nextProps.genres.map((i) => {
                return <MenuItem key={i.Gen} value={i.idCategoria} primaryText={i.tipo} />;
            });
            this.genreItems = menuItems;
            this.setState({
                ...this.state,
                genreItems: menuItems
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

    acceptUploadBook = () => {
        // TODO: mensajes
        this.setState({
            ...this.state,
            error: {
                addBookTitle: (this.state.addBookTitle === "") ? COMPLETA_CAMPO : "",
                addBookAuthor: (this.state.addBookAuthor === "") ? COMPLETA_CAMPO : "",
                addBookDescription: (this.state.addBookDescription === "") ? COMPLETA_CAMPO : "",
                addBookGenre: this.state.addBookGenre === null || this.state.addBookGenre === "",
                addBookCover: (this.state.addBookCover == null) ? true : false,
            }
        });

        if (this.state.addBookTitle && this.state.addBookAuthor
            && this.state.addBookDescription && this.state.addBookCover != null) {
            this.setState({
                ...this.state,
                disabledButton: true,
            });

            var formData = new FormData();
            formData.set('bookTittle', this.state.addBookTitle);
            formData.set('bookAuthor', this.state.addBookAuthor);
            formData.set('bookDescription', this.state.addBookDescription);
            formData.set('bookReview', this.state.addBookReview);
            formData.set('bookCoverUrl', this.state.addBookCoverFile);
            formData.set('userId', this.props.getCurrentUserId());     // TODO : cambiar
            formData.set('genreId', this.state.addBookGenre);

            this.props.uploadBook({
                form: formData
            });
        }
    }

    cargarImagenPortada = (evt) => {
        const callState = () => {
            if (this.state.error.addBookCover === true) {
                this.setState({
                    ...this.state,
                    error: {
                        ...this.state.error,
                        addBookCover: false
                    }
                });
            }
        };

        if (evt.target.files[0]) {
            this.setState({
                addBookCover: (URL.createObjectURL(evt.target.files[0])) ? URL.createObjectURL(evt.target.files[0]) : null,
                addBookCoverFile: evt.target.files[0] ? evt.target.files[0] : null
            }, callState);
        }
    }

    handleClose = () => {
        this.setState({ 
            ...this.initialState,
            disabledButton: false,
            genreItems: this.genreItems
        }, this.props.openAddBook.bind(this, false));
    }

    handleCategoria = (event, index, value) => {
        const callState = () => {
            if (this.state.error.addBookGenre !== "") {
                this.setState({
                    ...this.state,
                    error: {
                        ...this.state.error,
                        addBookGenre: ""
                    }
                });
            }
        };

        this.setState({
            ...this.state,
            addBookGenre: value
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
                                    name="addBookTitle"
                                    id="addBookTitle"
                                    label="Título del libro"
                                    fullWidth
                                    inputProps={{
                                        maxLength: 45
                                    }}
                                    required
                                    error={this.state.error.addBookTitle != ""}
                                    errorText={this.state.error.addBookTitle}
                                    onChange={this.oChangeInput.bind(this)}
                                    className="paddingTextFields"
                                /><br />
                                <TextField
                                    name="addBookAuthor"
                                    id="addBookAuthor"
                                    label="Título del libro"
                                    fullWidth
                                    inputProps={{
                                        maxLength: 45
                                    }}
                                    required
                                    error={this.state.error.addBookAuthor != ""}
                                    errorText={this.state.error.addBookAuthor}
                                    onChange={this.oChangeInput.bind(this)}
                                    className="paddingTextFields"
                                /><br />
                                <TextField
                                    name="addBookDescription"
                                    id="addBookDescription"
                                    label="Describe un poco la historia, no lo cuentes TODO!"
                                    multiline
                                    rowsMax="4"
                                    fullWidth
                                    inputProps={{
                                        maxLength: 140,
                                    }}
                                    required
                                    error={this.state.error.addBookDescription != ""}
                                    errorText={this.state.error.addBookDescription}
                                    onChange={this.oChangeInput.bind(this)}
                                    className="paddingTextFields"
                                /><br />
                                <TextField
                                    name="addBookReview"
                                    id="addBookReview"
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
                                    <InputLabel htmlFor="uploadBookGenreSelect">Selecciona una categoria</InputLabel>
                                    <Select
                                        multiple
                                        value={this.state.addBookGenre}
                                        onChange={this.handleCategoria}
                                        input={<Input id="uploadBookGenreSelect" />}
                                        renderValue={selected => selected.join(', ')}
                                        style={{ width: '100%' }}
                                    >
                                        {this.state.genreItems.map((name, index, list) => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox checked={this.state.name.indexOf(name) > -1} />
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                        ))}
                                    </Select>
                                    <p id="error_add_category" className="errorInput" hidden={!this.state.error.addBookGenre}>
                                        Debes eligir al menos una categoría
                                    </p>
                                </FormControl>
                            </Grid>
                            <Grid item sm={6} className="uploadBookLeftGrid">
                                <Paper zDepth={4} rounded={false} style={coverPreview}>
                                    <img src={this.state.addBookCover} alt="Necesitas una imagen" className="imagenPortadaPreview" />
                                </Paper>
                                <br />
                                <div className="divUploadAvatarButton">
                                    <input
                                        id="uploadBookButton"
                                        accept="image/*"
                                        type="file"
                                        style={DISPLAY_NONE} 
                                        className="imageInput" 
                                        onChange={this.cargarImagenPortada.bind(this)} 
                                    />
                                    <label htmlFor="uploadBookButton">
                                        <Button variant="outlined" component="span" className="" fullWidth>
                                            AÑADE UNA IMAGEN DE PORTADA
                                        </Button>
                                    </label>
                                </div>
                                <p id="error_add_img" className="errorInput" hidden={!this.state.error.addBookCover}>
                                    Debes añadir una imagen de la bookCover
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
                            onClick={this.acceptUploadBook.bind(this)}
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
        isOpenModal: appState.getIsOpenModal(state).isOpenAddBook,
        selectedIndex: appState.getCurrentTabID(state),
        genres: appState.getGenres(state),
        getCurrentUserId: appState.getUserId(state)
    }),
    (dispatch) => ({
        openAddBook: (isOpen) => dispatch(setIsOpenAddBook(isOpen)),
        uploadBook: (bookData) => dispatch(uploadBook(bookData)),
        fetchGenres: () => dispatch(fetchGenres())
    })
)(UploadBookModal);