import { connect } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { MdDelete, MdDonutSmall, MdEdit } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import './SemesterPage.scss';
import Card from '../../share/Card/Card';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import ConfirmDialog from '../../share/modals/dialog';
import ModalWindow from '../../share/modals/modal/modal';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import SemesterForm from '../../components/SemesterForm/SemesterForm';
import SemesterCopyForm from '../../components/SemesterCopyForm/SemesterCopyForm';
import {
    clearSemesterService,
    getDisabledSemestersService,
    handleSemesterService,
    removeSemesterCardService,
    selectSemesterService,
    setDisabledSemestersService,
    setEnabledSemestersService,
    showAllSemestersService,
    semesterCopy,
    createArchiveSemesterService,
    getArchivedSemestersService,
    viewArchivedSemester, setDefaultSemesterById
} from '../../services/semesterService';
import { setScheduleTypeService } from '../../services/scheduleService';
import { disabledCard } from '../../constants/disabledCard';
import { GiSightDisabled, IoMdEye, FaCopy } from 'react-icons/all';
import { FaFileArchive } from 'react-icons/fa';

import GroupSchedulePage from '../../components/GroupSchedulePage/GroupSchedulePage';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';
import SetDefaultDialog from '../../share/modals/modal/setDefaultDialog';
import SetChangeDialog from '../../share/modals/modal/setDefaultDialog';

const SemesterPage = props => {
    const { t } = useTranslation('formElements');
    const [open, setOpen] = useState(false);
    const [openDefault, setOpenDefault] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [semesterId, setSemesterId] = useState(-1);
    const [term, setTerm] = useState('');
    const { isSnackbarOpen, snackbarType, snackbarMessage } = props;

    useEffect(() => showAllSemestersService(), []);
    useEffect(() => {
        getDisabledSemestersService();
    }, []);
    useEffect(() => getArchivedSemestersService(), []);

    const [hideDialog, setHideDialog] = useState(null);
    const [hideDialogModal, setHideDialogModal] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [archived, setArchived] = useState(false);

    setScheduleTypeService('archived');

    const SearchChange = setTerm;
    const handleFormReset = () => clearSemesterService();
    const submit = values => {
        console.log("SEMESTER page")
        handleSemesterService(values);
    };
    const handleEdit = semesterId => selectSemesterService(semesterId);
    const handleCreateArchive = semesterId =>
        createArchiveSemesterService(semesterId);

    const searchArr = ['year', 'description', 'startDay', 'endDay'];

    let visibleItems = [];
    if (disabled) {
        visibleItems = search(props.disabledSemesters, term, searchArr);
    } else if (archived) {
        visibleItems = search(props.archivedSemesters, term, searchArr);
    } else {
        visibleItems = search(props.semesters, term, searchArr);
    }

    const handleClickOpen = semesterId => {
        setSemesterId(semesterId);
        setOpen(true);
    };
    const handleClickOpenDefault = semesterId => {
        setSemesterId(semesterId);
        setOpenDefault(true);
    };
    const handleClickOpenModal = semesterId => {
        setSemesterId(semesterId);
        setOpenModal(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        handleSnackbarCloseService();
    };

    const handleCloseModal = (event, reason) => {
        setOpenModal(false);
        setHideDialogModal(null);
        if (reason === 'clickaway') return;
    };

    const handleClose = semesterId => {
        const setDelete=open;
        const setDefault=openDefault;
        setOpen(false);
        setOpenDefault(false);
        if (!semesterId) return;
        if (hideDialog) {
            if (disabled) {
                const semester = props.disabledSemesters.find(
                    semester => semester.id === semesterId
                );
                setEnabledSemestersService(semester);
            } else {
                const semester = props.semesters.find(
                    semester => semester.id === semesterId
                );
                setDisabledSemestersService(semester);
            }
        } else if(setDelete) {
            removeSemesterCardService(semesterId);
        }
        else if(setDefault){
           setDefaultSemesterById(semesterId)
        }
        setHideDialog(null);
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
        setArchived(false);
    };

    const showArchivedHandler = () => {
        setArchived(!archived);
        !archived === true
            ? setScheduleTypeService('archived')
            : setScheduleTypeService('default');
        setDisabled(false);
    };
    const handleSemesterCopySubmit = values => {
        semesterCopy({
            fromSemesterId: +semesterId,
            toSemesterId: +values.toSemesterId
        });
        setOpenModal(false);
        setHideDialogModal(null);
    };

    const handleSemesterArchivedPreview = semesterId => {
        viewArchivedSemester(+semesterId);
    };
    const setClassNameForDefaultSemester=semester=>{
        const defaultSemesterName="default";
        const className="svg-btn edit-btn";
        return semester.defaultSemester===true?`${className} ${defaultSemesterName}`:className;
    }

    return (
        <>
            <NavigationPage name={navigationNames.SEMESTER_PAGE} val={navigation.SEMESTERS}/>
            <ConfirmDialog
                cardId={semesterId}
                whatDelete={'semester'}
                isHide={hideDialog}
                open={open}
                onClose={handleClose}
            />
            <SetChangeDialog
                cardId={semesterId}
                isHide={hideDialog}
                open={openDefault}
                onClose={handleClose}
            />
            <ModalWindow
                whatDelete={'semester'}
                isHide={hideDialogModal}
                open={openModal}
                onClose={handleCloseModal}
                windowTitle={t('semester_copy_label')}
                isOkButton={false}
                isNoButton={true}
                noButtonLabel={t('close_label')}
            >
                <SemesterCopyForm
                    semesterId={semesterId}
                    onSubmit={handleSemesterCopySubmit}
                    submitButtonLabel={t('copy_label')}
                />
            </ModalWindow>
            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel
                        SearchChange={SearchChange}
                        showDisabled={showDisabledHandle}
                        showArchived={showArchivedHandler}
                    />
                    {disabled || archived ? (
                        ''
                    ) : (
                        <SemesterForm
                            className="form"
                            onSubmit={submit}
                            onReset={handleFormReset}
                        />
                    )}
                </aside>
                <section className="container-flex-wrap wrapper">
                    {visibleItems.length === 0 && (
                        <NotFound name={t('semestry_label')} />
                    )}
                    {visibleItems.map((semester, index) => {
                        const sem_days = [];

                        semester.semester_days.forEach(day =>
                            sem_days.push(t(`common:day_of_week_${day}`))
                        );
                        return (
                            <Card
                                key={index}
                                class={`semester-card done-card ${
                                    semester.currentSemester ? 'current' : ''
                                }`}
                            >
                                <div className="cards-btns">
                                    {!disabled && !archived ? (
                                        <>
                                            <GiSightDisabled
                                                className="svg-btn copy-btn"
                                                title={t('common:set_disabled')}
                                                onClick={() => {
                                                    setHideDialog(
                                                        disabledCard.HIDE
                                                    );
                                                    handleClickOpen(
                                                        semester.id
                                                    );
                                                }}
                                            />
                                            <FaEdit
                                                className="svg-btn edit-btn"
                                                title={t('edit_title')}
                                                onClick={() =>
                                                    handleEdit(semester.id)
                                                }
                                            />
                                            <FaCopy
                                                className="svg-btn copy-btn"
                                                title={t('copy_label')}
                                                onClick={() => {
                                                    handleClickOpenModal(
                                                        semester.id
                                                    );
                                                }}
                                            />
                                            {semester.currentSemester ? (
                                                ''
                                            ) : (
                                                <FaFileArchive
                                                    className="svg-btn archive-btn"
                                                    title={t(
                                                        'common:make_archive'
                                                    )}
                                                    onClick={() => {
                                                        handleCreateArchive(
                                                            semester.id
                                                        );
                                                    }}
                                                />
                                            )}
                                        </>
                                    ) : !archived ? (
                                        <IoMdEye
                                            className="svg-btn copy-btn"
                                            title={t('common:set_enabled')}
                                            onClick={() => {
                                                setHideDialog(
                                                    disabledCard.SHOW
                                                );
                                                handleClickOpen(semester.id);
                                            }}
                                        />
                                    ) : (
                                        <IoMdEye
                                            className="svg-btn copy-btn"
                                            title={t('common:preview')}
                                            onClick={() => {
                                                handleSemesterArchivedPreview(
                                                    semester.id
                                                );
                                            }}
                                        />
                                    )}
                                    <MdDelete
                                        className="svg-btn delete-btn"
                                        title={t('delete_title')}
                                        onClick={() =>
                                            handleClickOpen(semester.id)
                                        }
                                    />

                                        <MdDonutSmall
                                            className={setClassNameForDefaultSemester(semester)}
                                            title={t('set_default_title')}
                                            onClick={() =>
                                                handleClickOpenDefault(semester.id)
                                            }
                                        />


                                </div>

                                <p className="semester-card__description">
                                    <small>{t('semester_label') + ':'}</small>
                                    <b>{semester.description}</b>
                                    {' ( ' + semester.year + ' )'}
                                </p>
                                <p className="semester-card__description">
                                    <b>
                                        {semester.startDay} - {semester.endDay}
                                    </b>
                                </p>
                                <p className="semester-card__description">
                                    {t('common:days_label') + ': '}
                                    {sem_days.join(', ')}
                                </p>
                                <p className="semester-card__description">
                                    {t(
                                        'common:ClassSchedule_management_title'
                                    ) + ': '}
                                    {semester.semester_classes
                                        .map(classItem => {
                                            return classItem.class_name;
                                        })
                                        .join(', ')}
                                </p>
                            </Card>
                        );
                    })}
                </section>
            </div>
            <SnackbarComponent
                message={snackbarMessage}
                type={snackbarType}
                isOpen={isSnackbarOpen}
                handleSnackbarClose={handleSnackbarClose}
            />
            <GroupSchedulePage scheduleType="archived" />
        </>
    );
};
const mapStateToProps = state => ({
    semesters: state.semesters.semesters,
    disabledSemesters: state.semesters.disabledSemesters,
    archivedSemesters: state.semesters.archivedSemesters,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message
});

export default connect(mapStateToProps, {})(SemesterPage);
