package com.smartclinic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing system notifications for users (doctors, patients, admins)
 */
@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notifications_user", columnList = "user_type, user_id, is_read"),
    @Index(name = "idx_notifications_created", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_type", nullable = false, length = 20)
    private String userType; // DOCTOR, PATIENT, ADMIN
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(nullable = false, length = 50)
    private String type; // APPOINTMENT, PRESCRIPTION, SYSTEM, REMINDER
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;
    
    @PrePersist
    protected void onCreate() {
        if (isRead == null) {
            isRead = false;
        }
    }
}
