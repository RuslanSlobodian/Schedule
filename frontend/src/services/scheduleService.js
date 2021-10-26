import { store } from '../store';

import axios from '../helper/axios';
import i18n from '../i18n';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import {
    deleteItemFromSchedule,
    setCurrentSemester,
    setFullSchedule,
    setGroupSchedule,
    setScheduleGroupId,
    setScheduleSemesterId,
    setScheduleTeacherId,
    setScheduleType,
    setTeacherSchedule,
    setTeacherRangeSchedule,
} from '../actions/index';

import { setLoadingService } from './loadingService';
import { handleSnackbarOpenService } from './snackbarService';
import {
    CURRENT_SEMESTER_URL,
    FULL_SCHEDULE_URL,
    GROUP_SCHEDULE_URL,
    SCHEDULE_ITEMS_URL,
    TEACHER_SCHEDULE_URL,
    FOR_TEACHER_SCHEDULE_URL,
    CLEAR_SCHEDULE_URL,
    SCHEDULE_ITEM_ROOM_CHANGE,
    SEND_PDF_TO_EMAIL,
} from '../constants/axios';
import { snackbarTypes } from '../constants/snackbarTypes';
import { showBusyRooms } from './busyRooms';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CLEARED_LABEL,
    SERVICE_MESSAGE_SENT_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_SCHEDULE_LABEL } from '../constants/translationLabels/formElements';
import {
    NO_CURRENT_SEMESTER_ERROR,
    COMMON_SCHEDULE_TITLE,
} from '../constants/translationLabels/common';
import { getScheduleItemsRequested } from '../actions/schedule';

export const getScheduleItemsService = () => {
    axios
        .get(CURRENT_SEMESTER_URL)
        .then((response) => {
            store.dispatch(setCurrentSemester(response.data));
            store.dispatch(getScheduleItemsRequested(response.data.id)); // saga
            showBusyRooms(response.data.id);
        })
        .catch(() => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, i18n.t(NO_CURRENT_SEMESTER_ERROR));
            setLoadingService(false);
        });
};

export const addItemToScheduleService = (item) => {
    axios
        .post(SCHEDULE_ITEMS_URL, item)
        .then(() => {
            getScheduleItemsService();
        })
        .catch((err) => errorHandler(err));
};

export const editRoomItemToScheduleService = (item) => {
    axios
        .put(`${SCHEDULE_ITEM_ROOM_CHANGE}?roomId=${item.roomId}&scheduleId=${item.itemId}`)
        .then(() => {
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(COMMON_SCHEDULE_TITLE),
                    actionType: i18n.t(UPDATED_LABEL),
                }),
            );
            getScheduleItemsService();
        })
        .catch((err) => errorHandler(err));
};

export const deleteItemFromScheduleService = (itemId) => {
    axios
        .delete(`${SCHEDULE_ITEMS_URL}/${itemId}`)
        .then(() => {
            store.dispatch(deleteItemFromSchedule(itemId));
            getScheduleItemsService();
        })
        .catch((err) => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const clearSchedule = (semesterId) => {
    axios
        .delete(`${CLEAR_SCHEDULE_URL}?semesterId=${semesterId}`)
        .then(() => {
            getScheduleItemsService();
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(COMMON_SCHEDULE_TITLE),
                    actionType: i18n.t(CLEARED_LABEL),
                }),
            );
        })
        .catch((err) => {
            errorHandler(err);
            setLoadingService(false);
        });
};

// ALERT GONNA BE DELETED
export const setScheduleSemesterIdService = (semesterId) => {
    store.dispatch(setScheduleSemesterId(semesterId));
};
// ALERT GONNA BE DELETED
export const setScheduleTypeService = (item) => {
    store.dispatch(setScheduleType(item));
};
// ALERT GONNA BE DELETED
export const setScheduleGroupIdService = (groupId) => {
    store.dispatch(setScheduleGroupId(groupId));
};
// ALERT GONNA BE DELETED
export const setScheduleTeacherIdService = (teacherId) => {
    store.dispatch(setScheduleTeacherId(teacherId));
};

export const getTeacherSchedule = (teacherId, semesterId) => {
    if (teacherId > 0) {
        axios
            .get(`${TEACHER_SCHEDULE_URL + semesterId}&teacherId=${teacherId}`)
            .then((response) => {
                store.dispatch(setTeacherSchedule(response.data));
                setLoadingService(false);
            })
            .catch((err) => errorHandler(err));
    }
};

export const getFullSchedule = (semesterId) => {
    if (semesterId !== undefined)
        axios
            .get(FULL_SCHEDULE_URL + semesterId)
            .then((response) => {
                store.dispatch(setFullSchedule(response.data));
                setLoadingService(false);
            })
            .catch((err) => errorHandler(err));
};

export const getGroupSchedule = (groupId, semesterId) => {
    if (groupId > 0) {
        axios
            .get(`${GROUP_SCHEDULE_URL + semesterId}&groupId=${groupId}`)
            .then((response) => {
                store.dispatch(setGroupSchedule(response.data));
                setLoadingService(false);
            })
            .catch((err) => errorHandler(err));
    }
};

export const getTeacherScheduleService = (values) => {
    axios
        .get(
            `${FOR_TEACHER_SCHEDULE_URL}?from=${values.startDay.replace(
                /\//g,
                '-',
            )}&to=${values.endDay.replace(/\//g, '-')}`,
        )
        .then((response) => {
            setLoadingService(false);
            store.dispatch(setTeacherRangeSchedule(response.data));
        })
        .catch((err) => {
            errorHandler(err);
            setLoadingService(false);
        });
};
