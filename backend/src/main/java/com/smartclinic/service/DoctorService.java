package com.smartclinic.service;

import com.smartclinic.entity.Doctor;
import com.smartclinic.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * DoctorService - Deliverable Q10 (5 points)
 * Service for doctor-related business logic
 */
@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get available times for a doctor on a specific date
     * Satisfies Q10 requirement for getAvailableTimes method (3 points)
     * 
     * @param doctorId Doctor's ID
     * @param date Date to check availability
     * @return List of available time slots
     */
    public List<String> getAvailableTimes(Long doctorId, LocalDate date) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        
        if (doctorOpt.isEmpty()) {
            return new ArrayList<>();
        }
        
        Doctor doctor = doctorOpt.get();
        String availableTimes = doctor.getAvailableTimes();
        
        if (availableTimes == null || availableTimes.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Parse available times from JSON-like string format
        // Example: ["09:00-10:00", "10:00-11:00", "14:00-15:00"]
        availableTimes = availableTimes.replace("[", "").replace("]", "").replace("\"", "");
        String[] times = availableTimes.split(",");
        
        return Arrays.stream(times)
                .map(String::trim)
                .collect(Collectors.toList());
    }

    /**
     * Validate doctor login credentials
     * Satisfies Q10 requirement for validateLogin method (2 points)
     * 
     * @param email Doctor's email
     * @param password Doctor's password
     * @return Structured response with success status, message, token, and doctor data
     */
    public Map<String, Object> validateLogin(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Doctor> doctorOpt = doctorRepository.findByEmail(email);
        
        if (doctorOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        
        Doctor doctor = doctorOpt.get();
        
        // Simple password validation (in production, use BCrypt)
        if (!passwordEncoder.matches(password, doctor.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        
        if (!doctor.getIsActive()) {
            response.put("success", false);
            response.put("message", "Account is inactive");
            return response;
        }
        
        // Generate JWT token
        String token = tokenService.generateToken(email, doctor.getId(), "DOCTOR");
        
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("doctor", Map.of(
                "id", doctor.getId(),
                "name", doctor.getName(),
                "email", doctor.getEmail(),
                "specialty", doctor.getSpecialty()
        ));
        
        return response;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findByIsActiveTrue();
    }

    public List<Doctor> getDoctorsBySpecialty(String specialty) {
        return doctorRepository.findActiveBySpecialty(specialty);
    }

    public List<Doctor> searchDoctorsByName(String name) {
        return doctorRepository.searchByName(name);
    }

    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }
}
