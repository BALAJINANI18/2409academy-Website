package com.academy.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Turns common failures into a JSON body of the form {"message": "..."},
 * which is exactly what the React login/signup form reads and displays.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

  public record ErrorBody(String message) {}

  /** Bean-validation failure (bad email, short password, blank name...). */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorBody> invalidInput(MethodArgumentNotValidException ex) {
    FieldError error = ex.getBindingResult().getFieldError();
    String field = error == null ? "" : error.getField();
    String message = switch (field) {
      case "email" -> "Please enter a valid email address.";
      case "password" -> "Password must be between 8 and 72 characters.";
      case "fullName" -> "Please enter your full name (up to 100 characters).";
      default -> "Please check the details you entered.";
    };
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorBody(message));
  }

  /** Missing or malformed JSON body. */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorBody> unreadableBody(HttpMessageNotReadableException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ErrorBody("Invalid request. Please fill in all the fields."));
  }

  /** Unique-constraint hit, e.g. two people registering the same email at the same moment. */
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorBody> duplicate(DataIntegrityViolationException ex) {
    log.warn("Data integrity violation: {}", ex.getMostSpecificCause().getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(new ErrorBody("An account with this email already exists."));
  }

  /** Database unreachable or any other data-access problem. */
  @ExceptionHandler(DataAccessException.class)
  public ResponseEntity<ErrorBody> database(DataAccessException ex) {
    log.error("Database error", ex);
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
        .body(new ErrorBody("The database is not reachable right now. Please try again shortly."));
  }
}
