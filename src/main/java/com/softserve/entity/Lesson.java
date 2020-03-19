package com.softserve.entity;

import com.softserve.entity.enums.LessonType;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.io.Serializable;


@NoArgsConstructor
@Data
@Entity
@Table(name = "lessons")
public class Lesson implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;
    private int hours;

    @Column(name = "teacher_for_site")
    private String teacherForSite;

    @Column(name = "subject_for_site")
    private String subjectForSite;

    @Enumerated(EnumType.STRING)
    private LessonType lessonType;


    @ManyToOne(targetEntity = Teacher.class)
    @JoinColumn(name = "teacher_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Teacher teacher;


    @ManyToOne(targetEntity = Subject.class)
    @JoinColumn(name = "subject_id", insertable = false, updatable = false)
    //@OnDelete(action = OnDeleteAction.NO_ACTION)
    private Subject subject;

    @ManyToOne(targetEntity = Group.class)
    @JoinColumn(name = "group_id", insertable = false, updatable = false)
    //@OnDelete(action = OnDeleteAction.NO_ACTION)
    private Group group;

}
