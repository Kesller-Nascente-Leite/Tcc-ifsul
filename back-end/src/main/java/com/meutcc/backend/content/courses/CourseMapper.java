package com.meutcc.backend.content.courses;

import com.meutcc.backend.teacher.Teacher;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Named("toDTO")
    @Mapping(source = "teacher.id", target = "teacherId")
    @Mapping(source = "teacher.user.fullName", target = "teacherName")
    CourseDTO toDTO(Course course);

    @IterableMapping(qualifiedByName = "toDTO")
    List<CourseDTO> toDTOList(List<Course> courses);

    @Mapping(target = "teacher", ignore = true)
    Course toEntity(CourseDTO dto);

    Course toEntity(CourseDTO dto, Teacher teacher);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "private", source = "isPrivate")
    void updateEntity(@MappingTarget Course course, CourseDTO dto);
}