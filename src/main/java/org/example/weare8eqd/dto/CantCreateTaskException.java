package org.example.weare8eqd.dto;

public class CantCreateTaskException extends RuntimeException {
    public CantCreateTaskException(String message) {
        super(message);
    }
}
