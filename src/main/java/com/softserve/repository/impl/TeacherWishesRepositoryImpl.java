package com.softserve.repository.impl;

import com.softserve.entity.TeacherWishes;
import com.softserve.entity.Wishes;
import com.softserve.repository.TeacherWishesRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
@Slf4j
@SuppressWarnings("unchecked")
public class TeacherWishesRepositoryImpl extends BasicRepositoryImpl<TeacherWishes, Long> implements TeacherWishesRepository {

    /**
     * Modified update method, which merge entity before updating it
     *
     * @param entity teacher wishes is going to be updated
     * @return Teacher Wishes
     */
    @Override
    public TeacherWishes save(TeacherWishes entity) {
        log.info("Enter into save method  with entity:{}", entity);
        entity = (TeacherWishes)sessionFactory.getCurrentSession().merge(entity);
        sessionFactory.getCurrentSession().save(entity);
        return entity;
    }

    /**
     * Method get count wishes by teacher
     * @param teacherId
     * @return count wishes
     */
    @Override
    public int countWishesByTeacherId(Long teacherId) {
        log.info("Enter into countWishesByTeacherId method with teacherId: {}",  teacherId);
        return (int) sessionFactory.getCurrentSession().createQuery
                ("SELECT count (*) FROM TeacherWishes t WHERE t.teacher.id = :teacherId")
                .setParameter("teacherId", teacherId).getSingleResult();
    }


    /**
     * getWishByTeacherId method
     *
     * @param teacherId
     * @return Wishes
     */
    public List<Wishes> getWishByTeacherId(Long teacherId) {
        Wishes[]  teacherWishes = (Wishes[]) sessionFactory.getCurrentSession().createQuery("" +
                "select t.teacherWishesList from TeacherWishes t " +
                "where t.teacher.id = :teacherId")
                .setParameter("teacherId", teacherId)
                .getSingleResult();
       return  Arrays.asList(teacherWishes);
    }
}
