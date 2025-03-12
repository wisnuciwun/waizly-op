
const defaultState = {
    email: '',
    seconds: 60,
};

export default function registerReducer(
    state = defaultState,
    action
) {
    switch (action.type) {
        case 'SET_EMAIL':
            return {
                ...state,
                email: action.email
            };
        default:
            return state;
    }
}
