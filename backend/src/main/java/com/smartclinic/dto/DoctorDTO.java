package com.smartclinic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO {
    private Long id;
    private String name;
    private String email;
    private String specialty;
    private String phone;
    private String availableTimes;
    private String bio;
    private Integer yearsOfExperience;
    private Double consultationFee;
    private Boolean isActive;
    private Double rating;
}
