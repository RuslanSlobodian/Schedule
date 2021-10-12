import {
    CLEAR_BUTTON_LABEL,
    CANCEL_BUTTON_TITLE,
} from '../constants/translationLabels/formElements';

export const setDisableButton = (pristine, submitting, id) => {
    if (id !== undefined) {
        return false;
    }
    if (!pristine) {
        return false;
    }
    if (submitting) {
        return true;
    }
    if (id === undefined) {
        return true;
    }
};
export const getClearOrCancelTitle = (id, t) => {
    return id === undefined ? t(CLEAR_BUTTON_LABEL) : t(CANCEL_BUTTON_TITLE);
};
