package com.academy.auth;
import com.academy.user.*;
import com.academy.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
  public AuthController(UserRepository users,PasswordEncoder encoder,JwtService jwt){this.users=users;this.encoder=encoder;this.jwt=jwt;}
  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody AuthDtos.RegisterRequest req){
    String email=req.email().trim().toLowerCase();
    if(users.existsByEmailIgnoreCase(email)) return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorBody("An account with this email already exists."));
    User u=new User(); u.setFullName(req.fullName().trim()); u.setEmail(email); u.setPasswordHash(encoder.encode(req.password()));
    User saved=users.save(u);
    return ResponseEntity.status(HttpStatus.CREATED).body(new AuthDtos.AuthResponse(jwt.createToken(saved.getEmail()),view(saved),"Account created successfully."));
  }
  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody AuthDtos.LoginRequest req){
    User u=users.findByEmailIgnoreCase(req.email().trim()).orElse(null);
    if(u==null || !encoder.matches(req.password(),u.getPasswordHash())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorBody("Invalid email or password."));
    return ResponseEntity.ok(new AuthDtos.AuthResponse(jwt.createToken(u.getEmail()),view(u),"Login successful."));
  }
  private AuthDtos.UserView view(User u){return new AuthDtos.UserView(u.getUserId(),u.getFullName(),u.getEmail(),u.getRole());}
  public record ErrorBody(String message){}
}