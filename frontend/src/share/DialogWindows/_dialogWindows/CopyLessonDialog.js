import React, { useState } from 'react';

import PropTypes from 'prop-types';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import {
    COPY_TO_SAME_GROUP_ERROR,
    CHOOSE_GROUP,
    COMMON_CHOOSE_GROUP,
} from '../../../constants/translationLabels/common';
import CustomDialog from '../../../containers/Dialogs/CustomDialog';
import { dialogCloseButton, dialogChooseButton } from '../../../constants/dialogs';

const useStyles = makeStyles(() => ({
    groupField: {
        '&': {
            margin: '0 auto',
            width: '90%',
        },
    },
}));

const CopyLessonDialog = (props) => {
    const { onClose, lesson, translation, groups, groupId, open } = props;
    const [group, setGroup] = useState('');
    const [error, setError] = useState('');

    const classes = useStyles();

    const chooseClickHandle = () => {
        if (!group) {
            return;
        }
        if (group.id === groupId) {
            setError(translation(COPY_TO_SAME_GROUP_ERROR));
            return;
        }
        onClose({ lesson, group });
    };

    const handleChangeAutocomplete = (event, newValue) => {
        setGroup(newValue);
        setError(null);
    };

    const defaultProps = {
        options: groups,
        getOptionLabel: (option) => (option ? option.title : ''),
    };
    return (
        <CustomDialog
            title={translation(CHOOSE_GROUP)}
            open={open}
            onClose={onClose}
            buttons={[dialogChooseButton(chooseClickHandle), dialogCloseButton(() => onClose(''))]}
        >
            <Autocomplete
                {...defaultProps}
                id="group"
                multiple
                clearOnEscape
                openOnFocus
                className={classes.groupField}
                onChange={handleChangeAutocomplete}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={translation(COMMON_CHOOSE_GROUP)}
                        error={!!error}
                        helperText={error || null}
                        margin="normal"
                    />
                )}
            />
        </CustomDialog>
    );
};
CopyLessonDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    lesson: PropTypes.object.isRequired,
    translation: PropTypes.func.isRequired,
    groupId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default CopyLessonDialog;
