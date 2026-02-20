package com.meutcc.backend.common.exceptions;

public class CourseNotFound extends RuntimeException {
  public CourseNotFound(String message) {
    super(message);
  }
}
