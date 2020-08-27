import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as appState from '../../app_state/reducers';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import LS from '../LanguageSelector';
import { fetchGenres } from '../../app_state/actions';
import { DISPLAY_NONE } from '../../constants/appConstants';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const genreMenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class GenreSelector extends Component {

    initialState = {
        genresToShow: [],
        genresSelected: [],
        selectText: '',
        readOnly: false
    }

    constructor(props) {
        super(props);
        this.state = { 
            ...this.initialState, 
            genresSelected: (props.genresSelected) ? props.genresSelected : [],
            readOnly: (props.readOnly) ? true : false
        };
    };

    componentDidMount = () => {
        this.props.fetchGenres();
    } 

    parseComponentText = (selectedGenres) => {
        let selectedText = [];
        let iterator = 0;
        while (iterator <2 && iterator < selectedGenres.length) {
            selectedText.push(LS.getStringMsg(selectedGenres[iterator].genre, selectedGenres[iterator].genre));
            iterator += 1;
        }
        if (selectedGenres.length > 2) {
            selectedText.push("...");
            selectedText.push(LS.getStringMsg('items.selected', "Selected", [selectedGenres.length]));
        }
        return selectedText.join(", ");
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.state.genresToShow.length === 0 && this.props.genres.length > 0) {
            let genresSelected = this.props.genres.filter(genre => this.state.genresSelected.includes(genre.genreId));
            // Set state
            this.setState({
                ...this.state,
                genresToShow: this.props.genres,
                selectText: this.parseComponentText(genresSelected)
            });
        }
    }

    handleGenreChange = (evt) => {
        if (!this.state.readOnly) {
            let value = (evt.target.value === null) ? [] : evt.target.value;   // list of ids type number
            if (!Array.isArray(value)) {
                value = [value]
            }
            let genresSelected = this.props.genres.filter(genre => value.includes(genre.genreId));
            // Set state
            this.setState({
                ...this.state,
                genresSelected: value.slice(),
                selectText: this.parseComponentText(genresSelected)
            });
    
            this.props.onChange(genresSelected);
        }
    }

    render = () => {
        return (
            (this.state.genresToShow.length) 
                    ? (
                        <FormControl className="userGenreSelect">
                            <InputLabel htmlFor="userGenreSelect" 
                                required
                                error={this.props.error}
                            >
                                <LS msgId='my.genres' defaultMsg='My favourite genres'/>
                            </InputLabel>
                            <Select
                                multiple={this.props.multiple !== undefined}
                                value={this.state.genresSelected}
                                onChange={this.handleGenreChange.bind(this)}
                                input={<Input id="userGenreSelect" />}
                                renderValue={() => this.state.selectText}
                                MenuProps={genreMenuProps}
                            >
                                {this.state.genresToShow.map(genre => (
                                    <MenuItem key={genre.genreId} value={genre.genreId}>
                                        <Checkbox checked={this.state.genresSelected.find((id) => +id === +genre.genreId) !== undefined} />
                                        <ListItemText primary={<LS msgId={genre.genre} defaultMsg={genre.genre}/>} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (<div style={DISPLAY_NONE}></div>)
        );
    }
}

export default connect(
    (state) => ({
        genres: appState.getGenres(state),
    }),
    (dispatch) => ({
        fetchGenres: () => dispatch(fetchGenres())
    })
)(GenreSelector);