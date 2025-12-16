package com.smartclinic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity representing patient's medical history and chronic conditions
 */
@Entity
@Table(name = "medical_history", indexes = {
    @Index(name = "idx_medical_history_patient", columnList = "patient_id"),
    @Index(name = "idx_medical_history_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @Column(name = "condition_name", nullable = false, length = 200)
    private String conditionName;
    
    @Column(name = "diagnosed_date")
    private LocalDate diagnosedDate;
    
    @Column(length = 50, nullable = false)
    private String status = "ACTIVE"; // ACTIVE, RESOLVED, CHRONIC
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "ACTIVE";
        }
    }
}
