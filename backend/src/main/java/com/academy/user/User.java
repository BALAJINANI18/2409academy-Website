package com.academy.user;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name="users")
public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name="user_id") private Long userId;
  @Column(name="full_name", nullable=false, length=100) private String fullName;
  @Column(nullable=false, unique=true, length=150) private String email;
  @Column(name="password_hash", nullable=false, length=255) private String passwordHash;
  @Column(nullable=false, length=20) private String role="STUDENT";
  @Column(name="created_at") private LocalDateTime createdAt;
  @PrePersist void onCreate(){ if(createdAt==null) createdAt=LocalDateTime.now(); }
  public Long getUserId(){return userId;} public String getFullName(){return fullName;}
  public void setFullName(String v){fullName=v;} public String getEmail(){return email;}
  public void setEmail(String v){email=v;} public String getPasswordHash(){return passwordHash;}
  public void setPasswordHash(String v){passwordHash=v;} public String getRole(){return role;} public void setRole(String v){role=v;}
  public LocalDateTime getCreatedAt(){return createdAt;}
}