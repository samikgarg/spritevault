package com.spritevault.spritevault.exception;

import com.spritevault.spritevault.token.TokenRefreshException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException e) {
        log.warn("Bad credentials provided: {}", e.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("message", "Invalid email or password");
        error.put("error", "AUTHENTICATION_FAILED");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUsernameNotFound(UsernameNotFoundException e) {
        log.warn("Username not found: {}", e.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("message", "User not found");
        error.put("error", "USER_NOT_FOUND");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
        log.warn("Illegal argument: {}", e.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("message", e.getMessage());
        error.put("error", "VALIDATION_ERROR");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(TokenRefreshException.class)
    public ResponseEntity<Map<String, String>> handleTokenRefresh(TokenRefreshException e) {
        log.warn("Token refresh error: {}", e.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("message", e.getMessage());
        error.put("error", "TOKEN_REFRESH_ERROR");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception e) {
        log.error("Unexpected error occurred", e);
        Map<String, String> error = new HashMap<>();
        error.put("message", "An unexpected error occurred");
        error.put("error", "INTERNAL_SERVER_ERROR");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
