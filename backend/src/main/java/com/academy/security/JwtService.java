package com.academy.security;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
@Service
public class JwtService {
  private final SecretKey key;
  public JwtService(@Value("${app.jwt.secret}") String secret) {
    if(secret.getBytes(StandardCharsets.UTF_8).length < 32) throw new IllegalArgumentException("APP_JWT_SECRET must be at least 32 characters");
    key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }
  /** Returns the email (subject) of a valid, unexpired token, or null if the token is invalid. */
  public String subject(String token) {
    try {
      return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
    } catch (JwtException | IllegalArgumentException e) {
      return null;
    }
  }
  public String createToken(String email) {
    long now=System.currentTimeMillis();
    return Jwts.builder().subject(email).issuedAt(new Date(now)).expiration(new Date(now+86400000))
      .signWith(key).compact();
  }
}