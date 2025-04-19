package org.example.weare8eqd.controller;

import org.example.weare8eqd.dto.CantCreateTaskException;
import org.example.weare8eqd.dto.ExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TaskControllerAdvice {

    @ExceptionHandler(CantCreateTaskException.class)
    public ResponseEntity<ExceptionResponse> handleCantCreateTaskException(CantCreateTaskException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ExceptionResponse("can't create task without user: " + e.getMessage()));
    }
}
