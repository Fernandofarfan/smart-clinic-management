package com.smartclinic.service;

import com.smartclinic.entity.Patient;
import com.smartclinic.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public Map<String, Object> validateLogin(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Patient> patientOpt = patientRepository.findByEmail(email);
        
        if (patientOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        
        Patient patient = patientOpt.get();
        
        if (!patient.getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        
        if (!patient.getIsActive()) {
            response.put("success", false);
            response.put("message", "Account is inactive");
            return response;
        }
        
        String token = tokenService.generateToken(email);
        
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
}
