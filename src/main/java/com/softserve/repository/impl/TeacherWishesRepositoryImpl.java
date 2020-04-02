package com.softserve.repository.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.github.fge.jackson.JsonLoader;
import com.github.fge.jsonschema.core.report.ProcessingReport;
import com.github.fge.jsonschema.main.JsonSchema;
import com.github.fge.jsonschema.main.JsonSchemaFactory;
import com.softserve.entity.TeacherWishes;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.repository.TeacherWishesRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.time.DayOfWeek;


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
    public TeacherWishes update(TeacherWishes entity) {
        log.info("Enter into update method of {} with entity:{}", getClass().getName(), entity);
        sessionFactory.getCurrentSession().clear();
        return super.update(entity);
    }

    /**
     * Modified update method, which merge entity before updating it
     *
     * @param entity teacher wishes is going to be updated
     * @return Teacher Wishes
     */
    @Override
    public TeacherWishes save(TeacherWishes entity) {
        log.info("Enter into update method of {} with entity:{}", getClass().getName(), entity);
       entity = (TeacherWishes)sessionFactory.getCurrentSession().merge(entity);
        sessionFactory.getCurrentSession().save(entity);
        return entity;
    }

    public void validateTeacherWish(JsonNode teacherWish){
        try {
                final JsonNode fstabSchema = loadResource("/wish-shema.json");
                final JsonSchemaFactory factory = JsonSchemaFactory.byDefault();
                final JsonSchema schema = factory.getJsonSchema(fstabSchema);
                schema.validate(teacherWish);
        }catch (Exception e) {
           // throw new IncorrectWishException("Wish is incorrect, "+ teacherWish.toString());
            e.printStackTrace();
        }
    }

    /**
     * Load one resource from the current package as a {@link JsonNode}
     *
     * @param name name of the resource (<b>MUST</b> start with {@code /}
     * @return a JSON document
     * @throws IOException resource not found
     */
    public static JsonNode loadResource(final String name)
            throws IOException
    {
        return JsonLoader.fromResource(name);
    }

    private boolean isClassSuits(long teacher_id, Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId){

        return true;
    }
}
