package com.academy.auth;

import com.academy.common.ApiExceptionHandler;
import com.academy.user.User;
import com.academy.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Returns the currently logged-in user (verified from the JWT) with their up-to-date role. */
@RestController
public class MeController {

  private final UserRepository users;

  public MeController(UserRepository users) {
    this.users = users;
  }

  @GetMapping("/api/me")
  public ResponseEntity<?> me(Authentication auth) {
    User u = users.findByEmailIgnoreCase(auth.getName()).orElse(null);
    if (u == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiExceptionHandler.ErrorBody("Please log in to continue."));
    }
    return ResponseEntity.ok(new AuthDtos.UserView(u.getUserId(), u.getFullName(), u.getEmail(), u.getRole()));
  }
}
