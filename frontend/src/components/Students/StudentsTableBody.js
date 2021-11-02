import React, { useEffect, useState } from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { useTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import { FaEdit } from 'react-icons/all';
import { Delete } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import '../../helper/renderStudentTable.scss';
import { getTeacherFullName } from '../../helper/renderTeacher';
import {
    STUDENT_LINK,
    EDIT_LINK,
    DELETE_LINK,
    GROUP_LINK,
    GROUP_LIST_LINK,
} from '../../constants/links';
import {
    EDIT_TITLE,
    SEND_LETTER_LABEL,
    SELECT_STUDENT,
    DELETE_TITLE_LABEL,
} from '../../constants/translationLabels/formElements';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

export const StudentsTableBody = (props) => {
    const ALL_ROWS = -1;
    const { students, group, setIsOpenConfirmDialog, setIsGroupButtonDisabled } = props;
    const [page, setPage] = useState(0);
    const [student, setStudent] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [checkBoxStudents, setCheckBoxStudents] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);
    const { t } = useTranslation('formElements');
    const handleEdit = (curentStudent) => {
        setIsOpenEditDialog(true);
        setStudent(curentStudent);
    };

    const setSelectDisabled = () => {
        setIsGroupButtonDisabled(checkBoxStudents.every((item) => item.checked));
    };
    const parseStudentToCheckBox = () => {
        const res = students.map((item) => {
            return { ...item, checked: false };
        });
        setCheckBoxStudents(res);
    };

    useEffect(() => {
        parseStudentToCheckBox();
        setSelectDisabled();
    }, [props.students]);

    const handleCheckElement = (event) => {
        setCheckBoxStudents(
            checkBoxStudents.map((item) => {
                const checkbox = item;
                if (item.id === Number(event.target.value)) {
                    checkbox.checked = event.target.checked;
                }
                return checkbox;
            }),
        );
    };

    const handleAllCheckedBtn = (pageItemsCount, page, rowsPerPage) => {
        let start = page * rowsPerPage;
        const finish = pageItemsCount + page * rowsPerPage;
        while (start < finish) {
            if (checkBoxStudents[start].checked) {
                start += 1;
            } else {
                break;
            }
        }
        setCheckedAll(start === finish && start !== 0);
    };
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, students.length - page * rowsPerPage);

    const sendMail = (email) => {
        const mailto = `mailto:${email}`;
        window.location.href = mailto;
    };

    const getCorrectRowCount = (pageItemsCount) => {
        const resRows = checkBoxStudents.length - pageItemsCount * page;
        if (pageItemsCount > resRows || pageItemsCount === ALL_ROWS) {
            return resRows;
        }
        return pageItemsCount;
    };
    const detectCheckingCheckAllBtn = () => {
        const rowsCount = getCorrectRowCount(rowsPerPage);
        handleAllCheckedBtn(rowsCount, page, rowsPerPage);
    };

    const handleCheckElem = (event) => {
        handleCheckElement(event);
        detectCheckingCheckAllBtn();
    };
    useEffect(() => {
        detectCheckingCheckAllBtn();
    }, [page]);

    return (
        <TableBody>
            {(rowsPerPage > 0
                ? checkBoxStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : checkBoxStudents
            ).map((singleStudent) => (
                <StyledTableRow key={singleStudent.id}>
                    <StyledTableCell component="th" scope="row" align="center">
                        <input
                            key={singleStudent.id}
                            onClick={handleCheckElem}
                            type="checkbox"
                            checked={singleStudent.checked}
                            value={singleStudent.id}
                            className="checked-box"
                            title={`${t(SELECT_STUDENT)} ${getTeacherFullName(singleStudent)}`}
                        />
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="center">
                        {getTeacherFullName(singleStudent)}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="center">
                        <span>
                            <button
                                className="send-letter-button"
                                title={`${t(SEND_LETTER_LABEL)} ${singleStudent.email}`}
                                onClick={() => sendMail(singleStudent.email)}
                                type="button"
                            >
                                {singleStudent.email}
                            </button>
                        </span>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="center">
                        <span className="edit-cell">
                            <Link
                                to={`${GROUP_LIST_LINK}${GROUP_LINK}/${group.id}${STUDENT_LINK}/${singleStudent.id}${EDIT_LINK}`}
                            >
                                <FaEdit
                                    className="edit-button"
                                    title={t(EDIT_TITLE)}
                                    onClick={() => handleEdit(singleStudent)}
                                />
                            </Link>
                            <Link
                                to={`${GROUP_LIST_LINK}${GROUP_LINK}/${group.id}${STUDENT_LINK}/${singleStudent.id}${DELETE_LINK}`}
                            >
                                <Delete
                                    title={t(DELETE_TITLE_LABEL)}
                                    className="delete-button"
                                    onClick={() => setIsOpenConfirmDialog(true)}
                                />
                            </Link>
                        </span>
                    </StyledTableCell>
                </StyledTableRow>
            ))}

            {emptyRows > 0 && (
                <StyledTableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                </StyledTableRow>
            )}
        </TableBody>
    );
};
