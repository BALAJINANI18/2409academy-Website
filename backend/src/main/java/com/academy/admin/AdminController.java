package com.academy.admin;

import com.academy.user.User;
import com.academy.user.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

/** Admin-only endpoints (the /api/admin/** path is restricted to the ADMIN role in SecurityConfig). */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

  private final UserRepository users;

  public AdminController(UserRepository users) {
    this.users = users;
  }

  public record AdminUserView(Long userId, String fullName, String email, String role, LocalDateTime createdAt) {}
  public record Stats(long totalUsers, long students, long admins) {}
  public record RoleChange(String role) {}
  public record Message(String message) {}

  private static AdminUserView view(User u) {
    return new AdminUserView(u.getUserId(), u.getFullName(), u.getEmail(), u.getRole(), u.getCreatedAt());
  }

  @GetMapping("/stats")
  public Stats stats() {
    return new Stats(users.count(), users.countByRole("STUDENT"), users.countByRole("ADMIN"));
  }

  @GetMapping("/users")
  public List<AdminUserView> listUsers() {
    return users.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream().map(AdminController::view).toList();
  }

  @PutMapping("/users/{id}/role")
  public ResponseEntity<?> changeRole(@PathVariable Long id, @RequestBody RoleChange body, Authentication auth) {
    String role = body.role() == null ? "" : body.role().trim().toUpperCase();
    if (!role.equals("STUDENT") && !role.equals("ADMIN")) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Message("Role must be STUDENT or ADMIN."));
    }
    User target = users.findById(id).orElse(null);
    if (target == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Message("User not found."));
    }
    if (target.getEmail().equalsIgnoreCase(auth.getName())) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(new Message("You cannot change your own role."));
    }
    target.setRole(role);
    return ResponseEntity.ok(view(users.save(target)));
  }

  @DeleteMapping("/users/{id}")
  public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication auth) {
    User target = users.findById(id).orElse(null);
    if (target == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Message("User not found."));
    }
    if (target.getEmail().equalsIgnoreCase(auth.getName())) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(new Message("You cannot delete your own account."));
    }
    users.delete(target);
    return ResponseEntity.ok(new Message("User deleted."));
  }
}
