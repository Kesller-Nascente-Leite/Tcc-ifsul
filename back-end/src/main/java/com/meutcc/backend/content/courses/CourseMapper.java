package com.meutcc.backend.content.courses;

import com.meutcc.backend.teacher.Teacher;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface CourseMapper {

    @Named("toDTO")
    @Mapping(source = "teacher.id", target = "teacherId")
    @Mapping(source = "teacher.user.fullName", target = "teacherName")
    @Mapping(target = "isPrivate", expression = "java(course.isPrivate())")
    CourseDTO toDTO(Course course);

    @IterableMapping(qualifiedByName = "toDTO")
    List<CourseDTO> toDTOList(List<Course> courses);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "teacher", ignore = true)
    @Mapping(target = "modules", ignore = true)
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "private", expression = "java(dto.isPrivate())")
    Course toEntity(CourseDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "teacher", source = "teacher")
    @Mapping(target = "modules", ignore = true)
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "private", expression = "java(dto.isPrivate())")
    Course toEntity(CourseDTO dto, Teacher teacher);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "teacher", ignore = true)
    @Mapping(target = "modules", ignore = true)
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "private", expression = "java(dto.isPrivate())")
    void updateEntity(@MappingTarget Course course, CourseDTO dto);
}
