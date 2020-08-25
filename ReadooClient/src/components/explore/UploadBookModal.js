import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionTypes, setIsOpenAddBook, uploadBook, resetProccess } from '../../app_state/actions';
import * as appState from '../../app_state/reducers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import RootRef from '@material-ui/core/RootRef';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LS from '../LanguageSelector';
import GenreSelector from '../common/GenreSelector';
import { DISPLAY_NONE, REST_FAILURE, REST_DEFAULT, REST_SUCCESS } from '../../constants/appConstants';
import { getProccessStatus, excedsLimit } from '../../utils/AppUtils';

const COMPLETE_FIELD = LS.getStringMsg('complete.field', 'Complete this field');

const coverPreview = {
    height: '300px',
    maxHeight: '100%'
};

const LOADING_BOOK_UPLOAD = 0;
const RUNNING_BOOK_UPLOAD = 1;

class UploadBookModal extends Component {

    initialState = {
        disabledButton: false,
        disabledText: 'loading',
        addBookTitle: "",
        addBookAuthor: "",
        addBookDescription: "",
        addBookReview: "",
        addBookGenre: null,
        addBookCover: null,
        addBookCoverFile: null,

        error: {
            addBookTitle: "",
            addBookAuthor: "",
            addBookDescription: "",
            addBookReview: "",
            addBookGenre: "",
            addBookCover: false,
            coverSize: false
        },

        runningStatus: RUNNING_BOOK_UPLOAD
    };

    genreItems = [];

    constructor(props) {
        super(props);
        this.uploadBookGridRef = React.createRef();
        this.uploadBookGridHeight = 0;
        this.uploadBookGridWidth = 0;
        this.state = { ...this.initialState };
    };

    // CICLO DE VIDA
    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.state.disabledButton && this.state.runningStatus === LOADING_BOOK_UPLOAD && this.props.failedProcesses && this.props.succeedProcesses && this.props.loadingProcesses) {
            let statusOfSaveBook = getProccessStatus(actionTypes.UPLOAD_BOOK, this.props.loadingProcesses, this.props.failedProcesses, this.props.succeedProcesses, 
                () => { this.props.resetProccessStatus(actionTypes.UPLOAD_BOOK)});
            
            // Return to normal status of running
            let callbackDefault = () => { 
                setTimeout(() => {
                    (this.state.disabledText === 'saved.successfully') && this.handleClose();
                    this.setState({
                        ...this.state,
                        disabledText: 'loading',
                        disabledButton: false
                    });
                }, 3000); // Hide message after 3 seconds
            }

            switch (statusOfSaveBook) {
                case REST_SUCCESS:
                    this.setState({
                        ...this.state,
                        runningStatus: RUNNING_BOOK_UPLOAD,
                        disabledText: 'saved.successfully'
                    }, /*CALLBACK*/ callbackDefault);
                    break;

                case REST_FAILURE:
                    this.setState({
                        ...this.state,
                        runningStatus: RUNNING_BOOK_UPLOAD,
                        disabledText: 'failed.save'
                    }, /*CALLBACK*/ callbackDefault);
                    break;
           
                default:
                    break;
            }
            let statusOfDeleteUser = getProccessStatus(actionTypes.DELETE_USER, this.props.loadingProcesses, this.props.failedProcesses, this.props.succeedProcesses, () => { this.props.resetProccessStatus(actionTypes.SAVE_USER_DATA)});
            switch (statusOfDeleteUser) {
                case REST_SUCCESS:
                    let callbackSuccessDeleteUser = () => {
                        setTimeout(() => {
                            this.props.doLogOut();
                        }, 3000); // Hide message after 3 seconds
                    };

                    this.setState({
                        ...this.state,
                        loadingProfile: RUNNING_BOOK_UPLOAD,
                        disabledText: 'saved.successfully'
                    }, /*CALLBACK*/ callbackDefault);
                    break;

                case REST_FAILURE:
                    this.setState({
                        ...this.state,
                        loadingProfile: RUNNING_BOOK_UPLOAD,
                        disabledText: 'failed.save'
                    }, /*CALLBACK*/ callbackDefault);
                    break;
           
                default:
                    break;
            }
        }
        return;
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
        this.setState({
            ...this.state,
            error: {
                addBookTitle: (this.state.addBookTitle === "") ? COMPLETE_FIELD : "",
                addBookAuthor: (this.state.addBookAuthor === "") ? COMPLETE_FIELD : "",
                addBookDescription: (this.state.addBookDescription === "") ? COMPLETE_FIELD : "",
                addBookGenre: (this.state.addBookGenre === null || this.state.addBookGenre.length === 0) ? COMPLETE_FIELD : "" ,
                addBookCover: (this.state.addBookCover == null) ? true : false,
            }
        });

        if (this.state.addBookTitle && this.state.addBookAuthor
                && this.state.addBookDescription && this.state.addBookGenre 
                && this.state.addBookCover != null) {
            this.setState({
                ...this.state,
                disabledButton: true,
                runningStatus: LOADING_BOOK_UPLOAD
            });

            this.uploadBookGridHeight = this.uploadBookGridRef.current.getBoundingClientRect().height;
            this.uploadBookGridWidth = this.uploadBookGridRef.current.getBoundingClientRect().width;

            var formData = new FormData();
            formData.set('bookTitle', this.state.addBookTitle);
            formData.set('bookAuthor', this.state.addBookAuthor);
            formData.set('bookDescription', this.state.addBookDescription);
            formData.set('bookReview', this.state.addBookReview);
            formData.set('userId', this.props.currentUserId);
            formData.set('genreId', this.state.addBookGenre[0]);
            formData.set('bookCoverUrl', this.state.addBookCoverFile);

            this.props.uploadBook({
                form: formData
            });
        }
    }

    changeCoverImage = (evt) => {
        if (evt.target.files[0]) {
            if (!excedsLimit(evt.target.files[0])) {
                this.setState({
                    ...this.state,
                    addBookCover: (URL.createObjectURL(evt.target.files[0])) ? URL.createObjectURL(evt.target.files[0]) : null,
                    addBookCoverFile: evt.target.files[0] ? evt.target.files[0] : null,
                    error: {
                        ...this.state.error,
                        coverSize: false,
                        addBookCover: false
                    }
                });
            } else {
                this.setState({
                    ...this.state,
                    error: {
                        ...this.state.error,
                        coverSize: true
                    }
                });
            }
        }
    }

    handleClose = () => {
        this.setState({ 
            ...this.initialState,
            disabledButton: false,
            runningStatus: RUNNING_BOOK_UPLOAD
        }, this.props.openAddBook.bind(this, false));
    }

    onChangeGenre = (selected) => {
        if (selected) {
            this.setState({
                ...this.state,
                error: {
                    ...this.state.error,
                    addBookGenre: ""
                },
                addBookGenre: selected.map((genre) => genre.genreId)
            })
        }
    }

    render() {
        return (
            <Dialog
                title={LS.getStringMsg('upload.my.book', 'Upload Book')}
                open={this.props.isOpenModal}
                aria-labelledby="responsive-dialog-title"
                classes={{
                    paper: 'dialogUploadBook'
                }}
            >
                <DialogTitle><LS msgId='upload.my.book' defaultMsg='Upload Book'/></DialogTitle>
                <DialogContent /* fullWidth */>
                    <Paper elevation={16}
                        style={(this.state.disabledButton) 
                                ? { position: 'absolute', 
                                    zIndex: 10, 
                                    textAlign: 'center', 
                                    height: this.uploadBookGridHeight, 
                                    width: this.uploadBookGridWidth,
                                } 
                                : DISPLAY_NONE}>
                        <h3 className="marginAuto"><LS msgId={this.state.disabledText} defaultMsg='Loading...' params={[Math.floor(Math.random() * 1000)]} /></h3>
                    </Paper>
                    <RootRef rootRef={this.uploadBookGridRef}>
                        <Grid container>
                                <Grid item sm={6} className="uploadBookLeftGrid">
                                    <TextField
                                        name="addBookTitle"
                                        id="addBookTitle"
                                        label={<LS msgId='book.title' defaultMsg='Book title'/>}
                                        fullWidth
                                        inputProps={{
                                            maxLength: 45
                                        }}
                                        required
                                        error={this.state.error.addBookTitle != ""}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="paddingTextFields"
                                    /><br />
                                    <TextField
                                        name="addBookAuthor"
                                        id="addBookAuthor"
                                        label={<LS msgId='book.author' defaultMsg='Book author'/>}
                                        fullWidth
                                        inputProps={{
                                            maxLength: 45
                                        }}
                                        required
                                        error={this.state.error.addBookAuthor != ""}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="paddingTextFields"
                                    /><br />
                                    <GenreSelector
                                        genresSelected={this.state.addBookGenre}
                                        error={this.state.error.addBookGenre !== ""}
                                        onChange={this.onChangeGenre.bind(this)}
                                    /><br />                                
                                    <TextField
                                        name="addBookDescription"
                                        id="addBookDescription"
                                        label={<LS msgId='book.description' defaultMsg='Book description' params={(this.state.addBookDescription != null) ? [140 - this.state.addBookDescription.length] : [140]}/>}
                                        rowsMax="4"
                                        fullWidth
                                        inputProps={{
                                            maxLength: 140,
                                        }}
                                        required
                                        error={this.state.error.addBookDescription != ""}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="paddingTextFields"
                                    /><br />
                                    <TextField
                                        name="addBookReview"
                                        id="addBookReview"
                                        label={<LS msgId='book.personal' defaultMsg='Personal opinion' params={(this.state.addBookReview != null) ? [140 - this.state.addBookReview.length] : [140]}/>}
                                        multiline
                                        rowsMax="4"
                                        fullWidth
                                        inputProps={{
                                            maxLength: 140,
                                        }}
                                        onChange={this.oChangeInput.bind(this)}
                                        className="paddingTextFields"
                                    />
                                </Grid>
                                <Grid item sm={6} className="uploadBookRightGrid">
                                    <Paper elevation={4} square style={coverPreview}>
                                        <img src={this.state.addBookCover} crossOrigin='http://localhost:3030' alt={LS.getStringMsg('book.need.image', 'Need an image!')} className="coverImagePreview" />
                                    </Paper>
                                    <br />
                                    <div className="divUploadAvatarButton">
                                        <input
                                            id="uploadBookButton"
                                            accept="image/*"
                                            type="file"
                                            style={DISPLAY_NONE} 
                                            className="imageInput" 
                                            onChange={this.changeCoverImage.bind(this)} 
                                        />
                                        <label htmlFor="uploadBookButton">
                                            <Button variant="outlined" component="span" className="" fullWidth>
                                                <LS msgId='book.add.cover.image' defaultMsg='Add a cover'/>
                                            </Button>
                                        </label>
                                    </div>
                                    <p id="error_add_img" className="errorInput" hidden={!this.state.error.addBookCover}>
                                        <LS msgId='book.must.add.cover.image' defaultMsg='You must add a cover'/>
                                    </p>
                                    <p id="error_add_img" className="errorInput" hidden={!this.state.error.coverSize}>
                                        <LS msgId='image.exceds.limit' defaultMsg='The image exceds the limit of 5MB'/>
                                    </p>
                                </Grid>
                        </Grid>
                    </RootRef>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button variant="contained" color="primary"
                            onClick={this.handleClose.bind(this)}
                            className="primaryButton"
                        >
                            <LS msgId='cancel' defaultMsg='Cancel'/>
                        </Button>
                        <Button variant="contained" color="primary" 
                            disabled={this.state.disabledButton}
                            onClick={this.acceptUploadBook.bind(this)}
                            className="primaryButton"
                        >
                            <LS msgId='upload' defaultMsg='Upload Book'/>
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
        currentUserId: appState.getUserId(state),
        loadingProcesses: appState.getLoadingProcesses(state),
        succeedProcesses: appState.getSucceedProcesses(state),
        failedProcesses: appState.getFailedProcesses(state)
    }),
    (dispatch) => ({
        openAddBook: (isOpen) => dispatch(setIsOpenAddBook(isOpen)),
        uploadBook: (bookData) => dispatch(uploadBook(bookData)),
        resetProccessStatus: (proccessName) => dispatch(resetProccess(proccessName))
    })
)(UploadBookModal);