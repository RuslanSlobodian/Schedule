import {
    SUCCESSFUL_LOGIN_MESSAGE,
    SUCCESSFUL_REGISTERED_MESSAGE,
    SUCCESSFUL_RESET_PASSWORD_MESSAGE,
} from './translationLabels/common';

const authTypes = {
    LOGIN: 'LOGIN',
    GOOGLE: 'GOOGLE',
    REGISTRATION: 'REGISTRATION',
    RESET_PASSWORD: 'RESET_PASSWORD',
};
const successAuthMessages = {
    [authTypes.LOGIN]: SUCCESSFUL_LOGIN_MESSAGE,
    [authTypes.GOOGLE]: SUCCESSFUL_LOGIN_MESSAGE,
    [authTypes.REGISTRATION]: SUCCESSFUL_REGISTERED_MESSAGE,
    [authTypes.RESET_PASSWORD]: SUCCESSFUL_RESET_PASSWORD_MESSAGE,
};

export { authTypes, successAuthMessages };
