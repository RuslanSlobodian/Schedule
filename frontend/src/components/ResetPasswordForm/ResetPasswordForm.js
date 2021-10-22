import React from 'react';
import i18n from 'i18next';

import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Link } from 'react-router-dom';
import Card from '../../share/Card/Card';
import renderTextField from '../../share/renderedFields/input';

import { RESET_PASSWORD_FORM } from '../../constants/reduxForms';

import { email, required } from '../../validation/validateFields';
import { links } from '../../constants/links';
import { EMAIL_LABEL } from '../../constants/translationLabels/formElements';
import {
    LOGIN_TITLE,
    RESET_PASSWORD_PAGE_TITLE,
    RESET_PASSWORD_LABEL,
} from '../../constants/translationLabels/common';

const ResetPasswordForm = (props) => {
    const { handleSubmit, resetPasswordError, setError, isLoading } = props;

    const error = resetPasswordError;

    const emailValidate = { validate: [required, email] };

    const errorHandling = (value) => {
        if (required(value)) {
            setError(required(value));
        } else {
            setError(null);
        }
    };

    return (
        <Card additionClassName="auth-card">
            <h2 className="under-line">{i18n.t(RESET_PASSWORD_PAGE_TITLE)}</h2>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Field
                        name="email"
                        className="form-field"
                        component={renderTextField}
                        label={i18n.t(EMAIL_LABEL)}
                        {...(!error ? emailValidate : error)}
                        onChange={(e) => {
                            errorHandling(e.target.value);
                        }}
                    />
                    <Button
                        className="buttons-style"
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {i18n.t(RESET_PASSWORD_LABEL)}
                    </Button>
                    <div className="text-center">
                        <Link className="navLinks" to={links.LOGIN}>
                            {i18n.t(LOGIN_TITLE)}
                        </Link>
                    </div>
                </form>
            )}
        </Card>
    );
};

const ResetPasswordReduxForm = reduxForm({
    form: RESET_PASSWORD_FORM,
})(ResetPasswordForm);

export default ResetPasswordReduxForm;
