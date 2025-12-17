package com.smartclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Appointment Entity
 * JPA entity representing an appointment in the Smart Clinic Management System
 */
@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Many-to-One relationship with Doctor
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    @NotNull(message = "Doctor is required")
    private Doctor doctor;

    /**
     * Many-to-One relationship with Patient
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    @NotNull(message = "Patient is required")
    private Patient patient;

    /**
     * Appointment time field of type LocalDateTime
     */
    @NotNull(message = "Appointment time is required")
    @Column(name = "appointment_time", nullable = false)
    private LocalDateTime appointmentTime;

    @Column(length = 20)
    private String status = "SCHEDULED"; // SCHEDULED, COMPLETED, CANCELLED

    @Column(length = 500)
    private String notes;

    @Column(length = 500)
    private String symptoms;

    @Column(name = "cancellation_reason", length = 500)
    private String cancellationReason;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus; // PENDING, PAID, PARTIAL, REFUNDED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
