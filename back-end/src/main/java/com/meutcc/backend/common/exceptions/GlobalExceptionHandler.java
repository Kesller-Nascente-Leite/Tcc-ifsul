package com.meutcc.backend.common.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice // Esta anotação é o que faz o Spring "ouvir" os erros
public class GlobalExceptionHandler extends RuntimeException {

    //Criar exceções e definir o codigo http que elas irão retornar
    @ExceptionHandler(UserAlreadyExistException.class)
    public ResponseEntity<String> handleUserExist(UserAlreadyExistException createUserException) {
        //exemplo esse que retorna 409 Conflict com a mensagem "Email já cadastrado"
        return ResponseEntity.status(HttpStatus.CONFLICT).body(createUserException.getMessage());
    }
}
