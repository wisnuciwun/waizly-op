
const defaultState = {
    token: '',
    user: [],
    menu: [],
    firstLogin: false,
};

export default function authReducer(
    state = defaultState,
    action
) {
    switch (action.type) {
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.token
            };
        case 'SET_FIRST_LOGIN': 
            return {
                ...state,
                firstLogin: action.firstLogin
            };
        case 'SET_USER':
            return {
                ...state,
                user: action.user
            };
        case 'SET_MENU':
            return {
                ...state,
                menu: action.menu
            };
        default:
            return state;
    }
}