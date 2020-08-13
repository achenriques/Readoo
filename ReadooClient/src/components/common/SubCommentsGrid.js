import React, { Component } from 'react';
import CommentsGrid from './CommentsGrid';

class SubCommentsGrid extends Component {

    initialState = {};

    constructor(props) {
        super(props);
        this.state = { ...this.initialState };
    };

    render = () => {
        return (
            <CommentsGrid bookId={this.props.bookId} commentFatherId={this.props.commentFatherId}/>
        );
    }
}

export default SubCommentsGrid;