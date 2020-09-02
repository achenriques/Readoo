import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import LS from '../LanguageSelector';
import { MY_FAVOURITES, MY_BOOKS } from '../../constants/appConstants';
import '../../styles/Common.css';

class FavouritesSelector extends Component {

    initialState = {
        arrayToShow: [MY_FAVOURITES, MY_BOOKS],
        selectedValue: MY_FAVOURITES,
    }

    constructor(props) {
        super(props);
        this.state = {
            ...this.initialState,
            selectedValue: (this.props.firstOption !== undefined) ? this.props.firstOption : MY_FAVOURITES
        };
    };

    handleValueChange = (evt) => {
        if (this.props.onChangeFavourite !== undefined && typeof this.props.onChangeFavourite === "function") {
            this.setState({
                ...this.state,
                selectedValue: evt.target.value
            }, () => this.props.onChangeFavourite(evt, evt.target.value));
        } else {
            console.error("You must set ther prop (onChangeFavourite) for the FavouriteSelector component");
        }
    }

    render = () => {
        return (
            <FormControl className="favouritesSelect" disabled={(this.props.disabled !== undefined) ? this.props.disabled : false}>
                <Select
                    id={"favouritesSelect"}
                    multiple={false}
                    value={this.state.selectedValue}
                    onChange={this.handleValueChange.bind(this)}
                >
                    {this.state.arrayToShow.map(val => (
                        <MenuItem key={val} value={val}>
                            <ListItemText primary={<LS msgId={'my.favourites.' + val} defaultMsg={'Books_' + 1}/>} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
}

export default FavouritesSelector;