package com.smartclinic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity for audit logging of system actions
 */
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_user", columnList = "user_type, user_id"),
    @Index(name = "idx_audit_entity", columnList = "entity_type, entity_id"),
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_created", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_type", length = 20)
    private String userType; // DOCTOR, PATIENT, ADMIN
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(nullable = false, length = 100)
    private String action; // CREATE, UPDATE, DELETE, LOGIN, LOGOUT
    
    @Column(name = "entity_type", length = 50)
    private String entityType; // DOCTOR, PATIENT, APPOINTMENT, PRESCRIPTION
    
    @Column(name = "entity_id")
    private Long entityId;
    
    @Column(name = "old_value", columnDefinition = "JSON")
    private String oldValue;
    
    @Column(name = "new_value", columnDefinition = "JSON")
    private String newValue;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
