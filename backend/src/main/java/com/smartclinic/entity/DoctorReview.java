package com.smartclinic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing patient reviews for doctors
 */
@Entity
@Table(name = "doctor_reviews", indexes = {
    @Index(name = "idx_reviews_doctor", columnList = "doctor_id"),
    @Index(name = "idx_reviews_rating", columnList = "doctor_id, rating")
}, uniqueConstraints = {
    @UniqueConstraint(name = "unique_appointment_review", columnNames = "appointment_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorReview {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;
    
    @Column(nullable = false)
    private Integer rating; // 1-5
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Column(name = "doctor_response", columnDefinition = "TEXT")
    private String doctorResponse;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
