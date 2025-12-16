package com.smartclinic.service;

import com.smartclinic.entity.Patient;
import com.smartclinic.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * PatientService
 * Service for patient-related business logic
 */
@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, Object> validateLogin(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Patient> patientOpt = patientRepository.findByEmail(email);
        
        if (patientOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        
        Patient patient = patientOpt.get();
        
        if (!passwordEncoder.matches(password, patient.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        
        if (!patient.getIsActive()) {
            response.put("success", false);
            response.put("message", "Account is inactive");
            return response;
        }
        
        String token = tokenService.generateToken(email, patient.getId(), "PATIENT");
        
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("patient", Map.of(
                "id", patient.getId(),
                "name", patient.getName(),
                "email", patient.getEmail()
        ));
        
        return response;
    }

    public Patient registerPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Optional<Patient> getPatientByEmail(String email) {
        return patientRepository.findByEmail(email);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient updatePatient(Long id, Patient patientDetails) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));

        if (patientDetails.getName() != null) patient.setName(patientDetails.getName());
        if (patientDetails.getPhone() != null) patient.setPhone(patientDetails.getPhone());
        if (patientDetails.getAddress() != null) patient.setAddress(patientDetails.getAddress());
        // For password updates, we should probably have a separate flow or check if it's not empty and encode it
        if (patientDetails.getPassword() != null && !patientDetails.getPassword().isEmpty()) {
             patient.setPassword(passwordEncoder.encode(patientDetails.getPassword()));
        }

        return patientRepository.save(patient);
    }
}
