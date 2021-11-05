import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { FormControl, TextField } from '@material-ui/core';
import { renderFromHelper } from '../share/renderedFields/error';

export const renderAutocompleteField = ({
    values,
    title,
    label,
    getItemTitle,
    input,
    getOptionLabel,
    meta: { touched, error },
    className,
    ...custom
}) => {
    const customTitle = input.value && getItemTitle(input.value);

    return (
        <Autocomplete
            label={label}
            options={values}
            placeholder={label}
            getOptionLabel={getOptionLabel}
            title={customTitle}
            {...input}
            {...custom}
            onChange={(_, value) => input.onChange(value)}
            onBlur={(_, value) => input.onBlur(value)}
            renderInput={(params) => (
                <FormControl error={touched && !!error}>
                    <TextField {...params} label={label} className={className} />
                    {renderFromHelper({ touched, error })}
                </FormControl>
            )}
        />
    );
};
