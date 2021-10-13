import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { GiSightDisabled, IoMdEye, MdFace } from 'react-icons/all';
import { FaChalkboardTeacher, FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { setDisabledDepartment, setEnabledDepartment } from '../../actions/departments';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import Card from '../../share/Card/Card';
import {
    clearDepartment,
    createDepartmentService,
    deleteDepartmentsService,
    getAllDepartmentsService,
    getDepartmentByIdService,
    getDisabledDepartmentsService,
    setDisabledDepartmentService,
    setEnabledDepartmentService,
    updateDepartmentService,
} from '../../services/departmentService';
import AddDepartment from '../../components/AddDepartmentForm/AddDepartmentForm';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import { CustomDialog, ShowDepartmentDataDialog } from '../../share/DialogWindows';
import { dialogTypes } from '../../constants/dialogs';
import { disabledCard } from '../../constants/disabledCard';
import { navigation, navigationNames } from '../../constants/navigation';
import NavigationPage from '../../components/Navigation/NavigationPage';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import { getAllTeachersByDepartmentId } from '../../actions/teachers';
import { showAllPublicTeachersByDepartmentService } from '../../services/scheduleService';

function DepartmentPage(props) {
    const { t } = useTranslation('formElements');
    const { departments, disabledDepartments } = props;
    const [isDisabled, setIsDisabled] = useState(false);
    const [term, setTerm] = useState('');
    const [openSubDialog, setOpenSubDialog] = useState(false);
    const [subDialogType, setSubDialogType] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [hideDialog, setHideDialog] = useState(null);
    const [department, setDepartment] = useState({});
    const [teacherDialog, setTeacherDialog] = useState(false);
    const [editDepartment, setEditDepartment] = useState(false);
    const { isSnackbarOpen, snackbarType, snackbarMessage, teachers } = props;
    useEffect(() => clearDepartmentForm(), []);
    const visibleDepartments = isDisabled
        ? search(disabledDepartments, term, ['name'])
        : search(departments, term, ['name']);
    const SearchChange = setTerm;
    const changeDisable = () => {
        setIsDisabled((prev) => !prev);
    };
    const submit = (data) => {
        data.id === undefined ? createDepartmentService(data) : updateDepartmentService(data);
    };
    const clearDepartmentForm = () => {
        clearDepartment();
    };
    const deleteDepartment = (id) => {
        setDepartmentId(id);
        setOpenSubDialog(true);
    };
    const setDisabled = (department) => {
        const disabledDepartment = { ...department, disabled: true };
        setDisabledDepartmentService(disabledDepartment);
    };
    const setEnabled = (department) => {
        setDepartmentId(department.id);
        setOpenSubDialog(true);
        const enabledDepartment = { ...department, disabled: false };
        setEnabledDepartment(enabledDepartment);
    };
    const setDepartmentIntoForm = (id) => {
        getDepartmentByIdService(id);
    };
    const closeTeacherDialog = () => {
        setTeacherDialog(false);
    };
    const handleClose = (id) => {
        if (!id) return;
        switch (subDialogType) {
            case dialogTypes.DELETE_CONFIRM:
                deleteDepartmentsService(departmentId);
                break;
            case dialogTypes.SET_VISIBILITY_DISABLED:
                {
                    const { id, name } = department;
                    const enabledDepartment = { id, name, disable: true };
                    setDisabledDepartmentService(enabledDepartment);
                }
                break;
            case dialogTypes.SET_VISIBILITY_ENABLED:
                {
                    const { id, name } = department;
                    const enabledDepartment = { id, name, disable: false };
                    setEnabledDepartmentService(enabledDepartment);
                }
                break;
            default:
                break;
        }
        setOpenSubDialog(false);
    };
    useEffect(() => getAllDepartmentsService(), [isDisabled]);
    useEffect(() => {
        if (isDisabled) getDisabledDepartmentsService();
    }, []);
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        handleSnackbarCloseService();
    };
    return (
        <>
            <NavigationPage name={navigationNames.DEPARTMENTS} val={navigation.DEPARTMENTS} />
            <CustomDialog
                type={subDialogType}
                cardId={departmentId}
                whatDelete="department"
                open={openSubDialog}
                onClose={handleClose}
            />
            <ShowDepartmentDataDialog
                isHide={hideDialog}
                cardId={departmentId}
                open={teacherDialog}
                onClose={closeTeacherDialog}
                teachers={teachers}
            />
            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={changeDisable} />
                    {isDisabled ? (
                        ''
                    ) : (
                        <AddDepartment
                            onSubmit={submit}
                            clear={clearDepartmentForm}
                            editDepartment={editDepartment}
                        />
                    )}
                </aside>
                <section className="container-flex-wrap wrapper">
                    {visibleDepartments.length === 0 && <NotFound name={t('department_y_label')} />}
                    {visibleDepartments.map((department) => (
                        <Card key={department.id} class="subject-card department-card">
                            <h2 className="subject-card__name">{department.name}</h2>
                            <div className="cards-btns">
                                {isDisabled ? (
                                    <IoMdEye
                                        className="svg-btn copy-btn"
                                        title={t('common:set_enabled')}
                                        onClick={() => {
                                            setSubDialogType(dialogTypes.SET_VISIBILITY_ENABLED);
                                            deleteDepartment(department.id);
                                            setDepartment(department);
                                        }}
                                    />
                                ) : (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t('common:set_disabled')}
                                            onClick={() => {
                                                // setDisabled(department)
                                                setSubDialogType(
                                                    dialogTypes.SET_VISIBILITY_DISABLED,
                                                );
                                                deleteDepartment(department.id);
                                                setDepartment(department);
                                            }}
                                        />

                                        <FaEdit
                                            className="svg-btn edit-btn"
                                            title={t('edit_title')}
                                            onClick={() => {
                                                setEditDepartment(true);
                                                setDepartmentIntoForm(department.id);
                                            }}
                                        />
                                    </>
                                )}

                                <MdDelete
                                    className="svg-btn delete-btn"
                                    title={t('delete_title')}
                                    onClick={() => {
                                        setDepartment({});
                                        setSubDialogType(dialogTypes.DELETE_CONFIRM);
                                        deleteDepartment(department.id);
                                    }}
                                />
                                <FaChalkboardTeacher
                                    className="svg-btn delete-btn"
                                    title={t('show_teacher_title')}
                                    onClick={() => {
                                        showAllPublicTeachersByDepartmentService(department.id);
                                        getDepartmentByIdService(department.id);
                                        setDepartmentIntoForm(department.id);
                                        setTeacherDialog(true);
                                    }}
                                />
                            </div>
                        </Card>
                    ))}
                </section>
            </div>
            <SnackbarComponent
                message={snackbarMessage}
                type={snackbarType}
                isOpen={isSnackbarOpen}
                handleSnackbarClose={handleSnackbarClose}
            />
        </>
    );
}

const mapStateToProps = (state) => ({
    departments: state.departments.departments,
    disabledDepartments: state.departments.disabledDepartments,
    department: state.departments.department,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    teachers: state.teachers.teachers,
});

export default connect(mapStateToProps, {})(DepartmentPage);
