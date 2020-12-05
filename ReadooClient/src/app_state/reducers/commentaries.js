import { initialState } from './index';
import { actionTypes } from '../actions';
import { successType, failureType } from '../../utils/appUtils';

/**
 * Reducer for commentaries and its options
 */
export default (state = initialState.commentaries, { type, payload, data }) => {
    switch (type) {
        case successType(actionTypes.FETCH_COMMENTARIES):
            let bookCommentaries = state.bookCommentaries;
            if (payload && payload.fetchMore) {
                bookCommentaries = bookCommentaries.concat(data.data);
            } else {
                bookCommentaries = data.data;
            }
            return {
                ...state,
                bookCommentaries,
            };

        case successType(actionTypes.FETCH_SUB_COMMENTARIES):
            let bookSubCommentaries = state.bookSubCommentaries;
            if (payload && payload.fetchMore) {
                bookSubCommentaries = bookSubCommentaries.concat(data.data);
            } else {
                bookSubCommentaries = data.data;
            }
            return {
                ...state,
                bookSubCommentaries,
            };
            

        case failureType(actionTypes.FETCH_COMMENTARIES):
            return {
                ...state,
                bookCommentaries: null,
            };

        case failureType(actionTypes.FETCH_SUB_COMMENTARIES):
            return {
                ...state,
                bookSubCommentaries: null,
            };

        case (actionTypes.WRITE_COMMENTARY):
            let copyOfCommentaries = state.bookCommentaries.slice();
            if (payload.newComment.commentFatherId === null) {
                copyOfCommentaries.unshift(payload.newComment);
                return {
                    ...state,
                    bookCommentaries: copyOfCommentaries,
                };
            } else {
                let copyOfSubCommentaries = state.bookSubCommentaries.slice();
                copyOfSubCommentaries.unshift(payload.newComment);
                let theFather = copyOfCommentaries.find((c => c.commentId === payload.newComment.commentFatherId));
                theFather.nSubCommentaries = +theFather.nSubCommentaries + 1;
                return {
                    ...state,
                    bookSubCommentaries: copyOfSubCommentaries,
                };
            }
        
        case successType(actionTypes.SEND_COMMENTARY):
            if (payload && +payload.newComment !== undefined && data && data.data !== undefined) {
                if (payload.newComment.commentFatherId === null) {
                    let copyOfCommentaries = state.bookCommentaries.map(c => {
                        if (c.commentId === payload.newComment.commentId) {
                            c.commentId = data.data.newId;
                        }
                        return c;
                    });
                    return {
                        ...state,
                        bookCommentaries: copyOfCommentaries
                    };
                } else{
                    let copyOfSubCommentaries = state.bookSubCommentaries.map(c => {
                        if (c.commentId === payload.newComment.commentId) {
                            c.commentId = data.data.newId;
                        }
                        return c;
                    });
                    return {
                        ...state,
                        bookSubCommentaries: copyOfSubCommentaries
                    };
                }
                
            }
        
        case failureType(actionTypes.SEND_COMMENTARY):
            if (payload.newComment.commentFatherId === null) {
                let copyOfCommentaries = state.bookCommentaries.filter((commentary) => commentary.commentId !== payload.newComment.commentId);
                return {
                    ...state,
                    bookSubCommentaries: copyOfCommentaries,
                };
            } else {
                let copyOfSubCommentaries = state.bookSubCommentaries.filter((commentary) => commentary.commentId !== payload.newComment.commentId);
                copyOfSubCommentaries.push(payload.newComment);
                return {
                    ...state,
                    bookSubCommentaries: copyOfSubCommentaries,
                };
            }

        default:
            return state;
    }
}