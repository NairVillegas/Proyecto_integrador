// src/main/java/com/flamabrava/config/GlobalExceptionHandler.java

package com.flamabrava.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String,Object>> handleAllExceptions(Exception ex) {
    Map<String,Object> body = new HashMap<>();
    body.put("error", ex.getClass().getName());
    body.put("message", ex.getMessage());
    StringWriter sw = new StringWriter();
    ex.printStackTrace(new PrintWriter(sw));
    body.put("trace", sw.toString());
    return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
