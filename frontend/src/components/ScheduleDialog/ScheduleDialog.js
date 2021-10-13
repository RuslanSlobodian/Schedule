import React, { useState } from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import { CustomDialog } from '../../share/DialogWindows';

import '../../share/DialogWindows/dialog.scss';
import './ScheduleDialog.scss';


const groupByAvailability = (arr) => {
    arr.sort((x, y) => {
        if (x === y) {
            return 0;
        }
        if (x) {
            return 1;
        }
        return -1;
    });
    return arr;
};

const ScheduleDialog = (props) => {
    const { onClose, itemData, open, rooms, availability, translation, isLoading } = props;

    const [room, setRoom] = useState('');
    const [sure, setSure] = useState(true);

    const getOptionLabel = (option) => {
        if (option && option.available) {
            return `${option.name} (${translation('common:available')})`;
        }
        if (option) return `${option.name} (${translation('common:unavailable')})`;
        return '';
    };

    const chooseClickHandle = () => {
        if (!room) return;

        if (
            !room.available ||
            !availability.teacherAvailable ||
            !availability.classSuitsToTeacher
        ) {
            setSure(false);
            return;
        }
        onClose({ itemData, room });
        setRoom(null);
    };

    const defaultProps = {
        options: availability.rooms ? groupByAvailability(availability.rooms) : rooms,
        getOptionLabel,
    };

    if (sure && isLoading)
        return (
            <div className="circular-progress-dialog">
                <CircularProgress />
            </div>
        );

    return (
        <CustomDialog
            title={translation('common:schedule_dialog_title')}
            open={open}
            onClose={() => onClose()}
        >
            {sure ? (
                <>
                    {isLoading ? (
                        <div className="circular-progress-dialog">
                            <CircularProgress />
                        </div>
                    ) : (
                        <>
                            <DialogTitle id="simple-dialog-title">
                                {translation('common:schedule_dialog_title')}
                            </DialogTitle>
                            <div className="availability-info">
                                {!availability.classSuitsToTeacher ? (
                                    <p className="availability-warning">
                                        {translation('common:class_does_not_suit_for_teacher')}
                                    </p>
                                ) : (
                                    ''
                                )}
                                {!availability.teacherAvailable ? (
                                    <p className="availability-warning">
                                        {translation('common:teacher_is_unavailable')}{' '}
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>
                            <Autocomplete
                                {...defaultProps}
                                id="group"
                                clearOnEscape
                                openOnFocus
                                className="room-field"
                                onChange={(event, newValue) => {
                                    setRoom(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={translation('formElements:room_label')}
                                        margin="normal"
                                    />
                                )}
                            />
                            <div className="buttons-container">
                                <Button
                                    className="dialog-button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => chooseClickHandle()}
                                >
                                    {translation('formElements:choose_button_title')}
                                </Button>
                                <Button
                                    className="dialog-button"
                                    variant="contained"
                                    onClick={() => onClose()}
                                >
                                    {translation('formElements:cancel_button_title')}
                                </Button>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <DialogTitle id="simple-dialog-title">
                        <p className="availability-warning">
                            {!room.available
                                ? `${translation('common:room_is_unavailable')}. `
                                : ''}
                        </p>
                        <p className="availability-warning">
                            {!availability.teacherAvailable
                                ? `${translation('common:teacher_is_unavailable')}. `
                                : ''}
                        </p>

                        <p className="availability-warning">
                            {!availability.classSuitsToTeacher
                                ? `${translation('common:class_does_not_suit_for_teacher')}. `
                                : ''}
                        </p>

                        {translation('common:are_you_sure')}
                    </DialogTitle>
                    <div className="buttons-container">
                        <Button
                            className="dialog-button"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                onClose({ itemData, room });
                                setSure(true);
                            }}
                        >
                            {translation('common:yes_button_title')}
                        </Button>
                        <Button
                            className="dialog-button"
                            variant="contained"
                            onClick={() => setSure(true)}
                        >
                            {translation('common:no_button_title')}
                        </Button>
                    </div>
                </>
            )}
        </CustomDialog>
    );
};

ScheduleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    rooms: PropTypes.array.isRequired,
    availability: PropTypes.object.isRequired,
};

export default ScheduleDialog;
