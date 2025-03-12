
export const setToken = (token: string | null) => {
    return {
        type: 'SET_TOKEN',
        token
    };
};

export const setUser = (user: any) => {
    return {
        type: 'SET_USER',
        user: user
    };
};

export const setMenu = (menu: any) => {
    return {
        type: 'SET_MENU',
        menu
    };
};

export const setFirstLogin = (firstLogin: boolean) => {
    return {
        type: 'SET_FIRST_LOGIN',
        firstLogin
    };
};