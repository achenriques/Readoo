export const SERVER_ENDPOINT = 'http://localhost:3030';

export const REST_FAILURE = -1;
export const REST_DEFAULT = 0;
export const REST_SUCCESS = 1;
export const REST_EMPTY = 2;
export const REST_BD_FAIL = -2;

export const pages = {
    LOGIN: -1,
    EXPLORE: 0,
    FAVOURITES: 1,
    CHAT: 2,
    PROFILE: 3
}

export const SHORTCUT_HEIGHT_PX = 60;

export const DEFAULT_BOOK_ID = -1;  // Default book id. Stored on client side
export const FAILURE_BOOK_ID = -2;  // Default book id in case of fetch failure. Stored on client side
export const NEW_CHAT_ID = -1;  // ID assigned to new chat conversartions

export const MIN_BOOK_ID = 1;
export const NUM_OF_BOOKS = 10;
export const NUM_OF_BOOKS_PER_REQUEST = NUM_OF_BOOKS / 2;
export const NUM_OF_COMENTARIES = 5; // MAX COMMENTARIES PER REQUEST. IMPORTANT TO CHANGE THIS NUMBER ALSO IN THE BACK APP (MAX_COMMENTARIES).

export const DISPLAY_NONE = {
    display: 'none'
}

// LIMIT OF IMAGE SIZE TO UPLOAD
export const FILE_BYTE_LIMIT = 5000000;

// FAVOURITES PAGES
export const ROWS_PER_PAGE = 3;
export const BOOKS_PER_PAGE = 6;
export const FIRST_PAGE = 'f';
export const BEFORE_PAGE = 'b';
export const NEXT_PAGE = 'n';
export const LAST_PAGE = 'l';

export const USER_HAS_EXPIRED = -1;
export const USER_NOT_IS_LOGGED = 0;
export const USER_IS_LOGGED = 1;
export const USER_FIRST_TIME_LOGGED = 2;

export const LANGUAGE_ENGLISH = 0;
export const LANGUAGE_SPANISH = 1;

export const MY_FAVOURITES = 0;
export const MY_BOOKS = 1;

export const CHAT_MESSAGES_EMPTY = [-1];

export const PROCCESS_STATUS_WORD_LENGTH = 8; // "_FAILURE".length = "_SUCCESS".length == "_LOADING".length

export const CODE_200 = 200;
export const CODE_203 = 203;

export const ERROR_401 = 401;
export const ERROR_403 = 403;