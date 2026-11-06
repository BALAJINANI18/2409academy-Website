package com.academy.security;

import com.academy.user.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

  @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}

  @Bean SecurityFilterChain filterChain(HttpSecurity http, JwtService jwt, UserRepository users) throws Exception {
    return http.csrf(csrf->csrf.disable())
      .cors(Customizer.withDefaults())
      .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(a->a
        .requestMatchers("/api/auth/**","/actuator/health").permitAll()
        .requestMatchers("/api/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated())
      .exceptionHandling(e->e
        .authenticationEntryPoint((req,res,ex)->writeJson(res,401,"Please log in to continue."))
        .accessDeniedHandler((req,res,ex)->writeJson(res,403,"You do not have permission to do that.")))
      .addFilterBefore(new JwtAuthFilter(jwt,users), UsernamePasswordAuthenticationFilter.class)
      .httpBasic(b->b.disable()).formLogin(f->f.disable()).build();
  }

  private static void writeJson(HttpServletResponse res, int status, String message) throws IOException {
    res.setStatus(status);
    res.setContentType("application/json");
    res.getWriter().write("{\"message\":\"" + message + "\"}");
  }

  @Bean CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origin-patterns:http://localhost:5173,http://127.0.0.1:5173}") String origins){
    CorsConfiguration c=new CorsConfiguration();
    c.setAllowedOriginPatterns(Arrays.stream(origins.split(",")).map(String::trim).filter(o->!o.isEmpty()).toList());
    c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    c.setAllowedHeaders(List.of("Authorization","Content-Type"));
    c.setAllowCredentials(false);
    UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource(); s.registerCorsConfiguration("/**",c); return s;
  }
}
