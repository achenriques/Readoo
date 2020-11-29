import { initialState } from './index';
import { actionTypes } from '../actions';
import { loadingType, successType, failureType } from '../../utils/appUtils';
import * as constants from '../../constants/appConstants';

/**
 * Reducer for books and its options
 */
export default (state = initialState.books, { type, payload, data }) => {
    switch (type) {
        case successType(actionTypes.I_LIKE_BOOK):
            if (payload.bookId && payload.like !== undefined && state.shownBooks && state.shownBooks.length) {
                let nextBooks = state.shownBooks.map(b => {
                    if (+b.bookId === +payload.bookId) {
                        b.bookLikes = (true == payload.like) ? (b.bookLikes + 1) : (b.bookLikes - 1);
                        b.userLikesBook = (true == payload.like);
                    }
                    return b;
                });
                return {
                    ...state,
                    shownBooks: nextBooks
                };
            } else {
                return state;
            }
            
        case loadingType(actionTypes.NEXT_BOOK):
            let toRet = {};
            if (state.currentBook +1 < state.shownBooks.length) {
                toRet = {
                    ...state,
                    currentBook: state.currentBook + 1,
                };
            } else if (state.currentBook + 1 === state.shownBooks.length
                && state.shownBooks.length === constants.NUM_OF_BOOKS) {
                toRet = {
                    ...state,
                    shownBooks: state.loaded.slice(0),
                    currentBook: 0,
                };
            } else if (state.currentBook + 1 === state.shownBooks.length
                && state.shownBooks.length < constants.NUM_OF_BOOKS) {
                toRet = {
                    ...state,
                    shownBooks: [ state.bookDefault ],
                    currentBook: 0,
                };
            }
            return toRet;      

        case successType(actionTypes.FETCH_BOOKS):
            if (payload.firstTime) {
                if (data.data.length) {
                    return {
                        ...state,
                        shownBooks: data.data,
                        loaded: data.data,
                        success_fetch: true,
                    };
                } else {
                    // If no books returned
                    return {
                        ...state,
                        shownBooks: [state.bookDefault],
                        loaded: [],
                        success_fetch: true,
                    };
                }
                
            } else {
                return {
                    ...state,
                    loaded: data.data,
                    success_fetch: true,
                };
            }

        case failureType(actionTypes.FETCH_BOOKS):
            return {
                ...state,
                shownBooks: [ state.bookFailure ],
                success_fetch: false,
            };

        case actionTypes.SET_FAVOURITE_LOAD_PAGE:
            if (payload.nPage !== undefined) {
                return {
                    ...state,
                    favourites: {
                        ...state.favourites,
                        loadingPage: +payload.nPage
                    }
                }
            }
            
        case successType(actionTypes.FETCH_FAVOURITES):
            if (payload.page === 0) {
                if (data && data.data !== undefined && data.data.total !== undefined) {
                    let totalFavourites = data.data.total;
                    let currentAndPrevious = data.data.data.slice(0, (payload.booksPerPage < totalFavourites) ? payload.booksPerPage : totalFavourites);
                    let nextPage = (totalFavourites > payload.booksPerPage) 
                            ? data.data.data.slice(payload.booksPerPage, ((payload.booksPerPage * 2) < totalFavourites) 
                                    ? payload.booksPerPage * 2 : totalFavourites)
                            : [];
                    let lastPage = nextPage;
                    if (nextPage.length && totalFavourites > (payload.booksPerPage * 2)) {
                        lastPage = data.data.data.slice(
                                payload.booksPerPage * 2, 
                                ((payload.booksPerPage * 3) < totalFavourites) 
                                        ? payload.booksPerPage * 3 
                                        : totalFavourites)
                    }
                    return {
                        ...state,
                        favouritesTotal: data.data.total,
                        favourites: {
                            firstPage: currentAndPrevious,
                            beforePage: currentAndPrevious,
                            currentPage: currentAndPrevious,
                            nextPage: nextPage,
                            lastPage: lastPage,
                            loadingPage: null
                        },
                        favourites_success_fetch: true,
                    };
                } else {
                    // If no books returned
                    return state;
                }
            } else {
                switch (payload.buttonCode) {
                    case constants.NEXT_PAGE:
                        return {
                            ...state,
                            favouritesTotal: data.data.total,
                            favourites: {
                                ...state.favourites,
                                // beforePage: state.favourites.currentPage.slice(),
                                // currentPage: state.favourites.nextPage.slice(),
                                nextPage: data.data.data,
                                loadingPage: null
                            }
                        };

                    case constants.BEFORE_PAGE:
                        return {
                            ...state,
                            favouritesTotal: data.data.total,
                            favourites: {
                                ...state.favourites,
                                beforePage: data.data.data,
                                // currentPage: state.favourites.beforePage.slice(),
                                // nextPage: state.favourites.currentPage.slice(),
                                loadingPage: null
                            }
                        };

                    case constants.LAST_PAGE:
                        return {
                            ...state,
                            favouritesTotal: data.data.total,
                            favourites: {
                                ...state.favourites,
                                beforePage: data.data.data,
                                // currentPage: state.favourites.lastPage.slice(),
                                loadingPage: null
                            }
                        };

                    case constants.FIRST_PAGE:
                        return {
                            ...state,
                            favouritesTotal: data.data.total,
                            favourites: {
                                ...state.favourites,
                                nextPage: data.data.data,
                                // currentPage: state.favourites.firstPage.slice(),
                                loadingPage: null
                            }
                        };
                
                    default:
                        return {
                            ...state,
                            favouritesTotal: data.data.total,
                            favourites: {
                                ...state.favourites,
                                currentPage: data.data.data,
                                loadingPage: null
                            }
                        };
                }
            }

        case failureType(actionTypes.FETCH_FAVOURITES):
            return {
                ...state,
                favourites: {
                    ...state.favourites,
                    currentPage: null,
                    loadingPage: null
                },
                favourites_success_fetch: false,
            };

        case(actionTypes.FAVOURITE_PAGE_REQUEST):
            let loadingPage = (payload.fetchData && payload.loadingPage !== undefined) ? +payload.loadingPage : null;
            switch (payload.buttonCode) { 
                case constants.NEXT_PAGE:
                    return {
                        ...state,
                        favourites: {
                            ...state.favourites,
                            beforePage: state.favourites.currentPage.slice(),
                            currentPage: state.favourites.nextPage.slice(),
                            loadingPage: loadingPage
                        }
                    };

                case constants.BEFORE_PAGE:
                    return {
                        ...state,
                        favourites: {
                            ...state.favourites,
                            nextPage: state.favourites.currentPage.slice(),
                            currentPage: state.favourites.beforePage.slice(),
                            loadingPage: loadingPage
                        }
                    };

                case constants.LAST_PAGE:
                    return {
                        ...state,
                        favourites: {
                            ...state.favourites,
                            currentPage: state.favourites.lastPage.slice(),
                            loadingPage: loadingPage
                        }
                    };

                case constants.FIRST_PAGE:
                    return {
                        ...state,
                        favourites: {
                            ...state.favourites,
                            currentPage: state.favourites.firstPage.slice(),
                            loadingPage: loadingPage
                        }
                    };
            
                default:
                    return state;
            }

        default:
            return state;
    }
}