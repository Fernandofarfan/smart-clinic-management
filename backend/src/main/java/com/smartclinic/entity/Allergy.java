package com.smartclinic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing patient allergies
 */
@Entity
@Table(name = "allergies", indexes = {
    @Index(name = "idx_allergies_patient", columnList = "patient_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Allergy {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @Column(nullable = false, length = 200)
    private String allergen;
    
    @Column(length = 20)
    private String severity; // MILD, MODERATE, SEVERE
    
    @Column(columnDefinition = "TEXT")
    private String reaction;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
