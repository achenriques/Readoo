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
import { generateKeyPair } from 'crypto';

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
        selectText: ''
    }

    constructor(props) {
        super(props);
        this.state = { 
            ...this.initialState, 
            genresSelected: (props.genresSelected) ? props.genresSelected : [] 
        };
    };

    componentDidMount = () => {
        this.props.fetchGenres();
    } 

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.state.genresToShow.length === 0 && this.props.genres.length > 0) {
            let selectedGenres = this.props.genres.filter(genre => this.state.genresSelected.includes(genre.genreId));
            let selectedText = [];
            for (let i = 0; i < selectedGenres.length; i += 1) {
                if (i < 2) {
                    selectedText.push(<LS msgId={selectedGenres[i].genre} defaultMsg={selectedGenres[i].genre} />);
                } else {
                    break;
                }
            }
            if (selectedGenres.length > 2) {
                selectedText.push("...");
                selectedText.push(<LS msgId='items.selected' defaultMsg="Selected" params={[selectedGenres.length]} />);
            }
            // Set state
            this.setState({
                ...this.state,
                genresToShow: this.props.genres,
                selectText: selectedText.join(', ')
            });
        }
    }

    handleGenreChange = (evt) => {
        let value = evt.target.value;   // list of genres
        let genresSelected = [];
        let nextText = [];
        for (let i = 0, l = value.length; i < l; i += 1) {
            genresSelected.push(value[i].genreId);
            (i < 2) && nextText.push(LS.getStringMsg(value[i].genre, value[i].genre));
        }
        if (value.length > 2) {
            nextText.push("...");
            nextText.push(LS.getStringMsg('items.selected', '', [value.length]));
        }
        
        this.setState({
            ...this.state,
            genresSelected: value,
            selectText: nextText.join(", ")
        });

        this.props.onChange(genresSelected);
    }

    render = () => {
        return (
            (this.state.genresToShow.length) 
                    ? (
                        <FormControl className="userGenreSelect">
                            <InputLabel htmlFor="userGenreSelect">
                                <LS msgId='my.genres' defaultMsg='My favourite genres'/>
                            </InputLabel>
                            <Select
                                multiple
                                value={this.state.genresSelected}
                                onChange={this.handleGenreChange.bind(this)}
                                input={<Input id="userGenreSelect" />}
                                renderValue={() => this.state.selectText}
                                MenuProps={genreMenuProps}
                            >
                                {this.state.genresToShow.map(genre => (
                                    <MenuItem key={genre.genreId} value={genre}>
                                        <Checkbox checked={this.state.genresSelected.find((e) => e.genreId === genre.genreId) !== undefined} />
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