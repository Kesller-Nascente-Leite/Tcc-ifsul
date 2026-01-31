package com.meutcc.backend.common.exceptions;

public class NonExistentUserException extends RuntimeException {
    public NonExistentUserException(String message) {
        super(message);
    }
}
