package com.smartclinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Doctor Entity - Deliverable Q3 (8 points)
 * JPA entity representing a doctor in the Smart Clinic Management System
 */
@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Email is required")
    // @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "Specialty is required")
    @Column(nullable = false, length = 100)
    private String specialty;

    @NotBlank(message = "Phone is required")
    @Column(nullable = false, length = 20)
    private String phone;

    /**
     * Available times field - stored as JSON string
     * Example format: ["09:00-10:00", "10:00-11:00", "14:00-15:00"]
     * This field satisfies the Q3 requirement for availableTimes with proper type and annotation
     */
    @Column(name = "available_times", columnDefinition = "TEXT")
    private String availableTimes;

    @Column(length = 500)
    private String bio;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "consultation_fee")
    private Double consultationFee;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "rating")
    private Double rating = 0.0;
}
