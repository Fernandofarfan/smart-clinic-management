package com.smartclinic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing payment transactions for appointments
 */
@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payments_status", columnList = "payment_status"),
    @Index(name = "idx_payments_patient", columnList = "patient_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(length = 3, nullable = false)
    private String currency = "USD";
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, CASH, INSURANCE
    
    @Column(name = "payment_status", length = 20, nullable = false)
    private String paymentStatus = "PENDING"; // PENDING, COMPLETED, FAILED, REFUNDED
    
    @Column(name = "transaction_id", length = 255)
    private String transactionId;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (currency == null) {
            currency = "USD";
        }
        if (paymentStatus == null) {
            paymentStatus = "PENDING";
        }
    }
}
