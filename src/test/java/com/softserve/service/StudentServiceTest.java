package com.softserve.service;

import com.softserve.entity.Group;
import com.softserve.entity.Student;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.StudentRepository;
import com.softserve.service.impl.StudentServiceImpl;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@Category(UnitTestCategory.class)
@RunWith(MockitoJUnitRunner.class)
public class StudentServiceTest {

    @Mock
    StudentRepository studentRepository;

    @InjectMocks
    StudentServiceImpl studentService;

    @Test
    public void getAll() {
        Student student = new Student();
        student.setName("Name");
        student.setSurname("Surname");
        student.setPatronymic("Patronymic");
        student.setEmail("tempStudent@gmail.com");
        student.setUserId(1L);
        student.setGroup(new Group());

        when(studentRepository.getAll()).thenReturn(Arrays.asList(student));
        List<Student> actualList = studentService.getAll();

        assertEquals(1, actualList.size());
        assertSame(actualList.get(0), student);
    }

    @Test
    public void getById() {
        Student expectedStudent = new Student();
        expectedStudent.setId(1L);
        expectedStudent.setName("Name");
        expectedStudent.setSurname("Surname");
        expectedStudent.setPatronymic("Patronymic");
        expectedStudent.setEmail("tempStudent@gmail.com");
        expectedStudent.setUserId(1L);
        expectedStudent.setGroup(new Group());

        when(studentRepository.getById(anyLong())).thenReturn(expectedStudent);

        Student actualStudent = studentService.getById(expectedStudent.getId());

        assertSame(expectedStudent, actualStudent);
    }

    @Test
    public void save() {
        Group group = new Group();
        group.setId(1L);

        Student expectedStudent = new Student();
        expectedStudent.setId(1L);
        expectedStudent.setName("Name");
        expectedStudent.setSurname("Surname");
        expectedStudent.setPatronymic("Patronymic");
        expectedStudent.setEmail("tempStudent@gmail.com");
        expectedStudent.setUserId(1L);
        expectedStudent.setGroup(group);

        when(studentRepository.save(any(Student.class))).thenReturn(expectedStudent);

        Student actualStudent = studentService.save(expectedStudent);

        assertEquals(expectedStudent.getEmail(), actualStudent.getEmail());
    }

    @Test
    public void update() {
        Group group = new Group();
        group.setId(1L);

        Student oldStudent = new Student();
        oldStudent.setId(1L);
        oldStudent.setName("Name");
        oldStudent.setSurname("Surname");
        oldStudent.setPatronymic("Patronymic");
        oldStudent.setEmail("tempStudent@gmail.com");
        oldStudent.setUserId(1L);
        oldStudent.setGroup(group);

        Student updatedStudent = new Student();
        updatedStudent.setId(oldStudent.getId());
        updatedStudent.setName("Changed Name");
        updatedStudent.setSurname("Changed Surname");
        updatedStudent.setPatronymic("Changed Patronymic");
        updatedStudent.setEmail("changedTempStudent@gmail.com");
        updatedStudent.setUserId(oldStudent.getUserId());
        updatedStudent.setGroup(oldStudent.getGroup());

        when(studentRepository.update(any(Student.class))).thenReturn(updatedStudent);
        when(studentRepository.getById(anyLong())).thenReturn(oldStudent);

        oldStudent = studentService.update(updatedStudent);

        assertNotNull(oldStudent);
        assertEquals(updatedStudent, oldStudent);
    }

    @Test
    public void delete() {
        Student expectedStudent = new Student();
        expectedStudent.setId(1L);
        expectedStudent.setName("Name");
        expectedStudent.setSurname("Surname");
        expectedStudent.setPatronymic("Patronymic");
        expectedStudent.setEmail("tempStudent@gmail.com");
        expectedStudent.setUserId(1L);
        expectedStudent.setGroup(new Group());

        when(studentRepository.delete(any(Student.class))).thenReturn(expectedStudent);
        when(studentRepository.getById(anyLong())).thenReturn(expectedStudent);
        Student deletedStudent = studentService.delete(expectedStudent);

        assertNotNull(deletedStudent);
        assertEquals(expectedStudent, deletedStudent);
        verify(studentRepository).delete(any());
    }

    @Test
    public void getByEmail() {
        Student expectedStudent = new Student();
        expectedStudent.setId(1L);
        expectedStudent.setName("Name");
        expectedStudent.setSurname("Surname");
        expectedStudent.setPatronymic("Patronymic");
        expectedStudent.setEmail("tempStudent@gmail.com");
        expectedStudent.setUserId(1L);
        expectedStudent.setGroup(new Group());

        when(studentRepository.findByEmail(anyString())).thenReturn(expectedStudent);

        Student actualStudent = studentService.getByEmail(expectedStudent.getEmail());

        assertNotNull(actualStudent);
        assertEquals(expectedStudent, actualStudent);
    }

    @Test
    public void getByUserId() {
        Student expectedStudent = new Student();
        expectedStudent.setId(1L);
        expectedStudent.setName("Name");
        expectedStudent.setSurname("Surname");
        expectedStudent.setPatronymic("Patronymic");
        expectedStudent.setEmail("tempStudent@gmail.com");
        expectedStudent.setUserId(1L);
        expectedStudent.setGroup(new Group());

        when(studentRepository.findByUserId(anyLong())).thenReturn(expectedStudent);

        Student actualStudent = studentService.getByUserId(expectedStudent.getUserId());

        assertNotNull(actualStudent);
        assertEquals(expectedStudent, actualStudent);
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionWhenGetById() {
        when(studentRepository.getById(anyLong())).thenReturn(null);
        studentService.getById(anyLong());
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionWhenSave() {
        Student inputStudent = new Student();
        inputStudent.setEmail("tempStudent@gmail.com");

        Student existingStudent = new Student();
        inputStudent.setEmail("tempStudent@gmail.com");

        when(studentRepository.findByEmail(anyString())).thenReturn(existingStudent);
        studentService.save(inputStudent);
    }
}
