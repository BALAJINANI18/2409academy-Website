package com.academy.security;

import com.academy.user.User;
import com.academy.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.dao.DataAccessException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Reads "Authorization: Bearer <token>", verifies it, and loads the user from the database
 * on every request. Because the role is read from the database (not from the token),
 * promoting, demoting or deleting a user takes effect immediately.
 */
public class JwtAuthFilter extends OncePerRequestFilter {

  private final JwtService jwt;
  private final UserRepository users;

  public JwtAuthFilter(JwtService jwt, UserRepository users) {
    this.jwt = jwt;
    this.users = users;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String header = request.getHeader("Authorization");
    if (header != null && header.startsWith("Bearer ")
        && SecurityContextHolder.getContext().getAuthentication() == null) {
      String email = jwt.subject(header.substring(7).trim());
      if (email != null) {
        try {
          User user = users.findByEmailIgnoreCase(email).orElse(null);
          if (user != null) {
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
            SecurityContextHolder.getContext().setAuthentication(auth);
          }
        } catch (DataAccessException ex) {
          // Database unavailable: continue unauthenticated; protected endpoints will answer 401.
        }
      }
    }
    chain.doFilter(request, response);
  }
}
