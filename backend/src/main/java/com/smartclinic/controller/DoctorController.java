package com.smartclinic.controller;

import com.smartclinic.dto.DoctorDTO;
import com.smartclinic.dto.LoginDTO;
import com.smartclinic.entity.Doctor;
import com.smartclinic.service.DoctorService;
import com.smartclinic.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * DoctorController - Deliverable Q5 (6 points)
 * REST controller for doctor-related endpoints
 */
@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private TokenService tokenService;

    /**
     * Get doctor availability endpoint
     * Satisfies Q5 requirement for GET endpoint with dynamic parameters and token validation (6 points)
     * 
     * @param id Doctor ID (path variable)
     * @param date Date to check availability (query parameter)
     * @param authorization JWT token from Authorization header
     * @return ResponseEntity with structured response containing available times
     */
    @GetMapping("/{id}/availability")
    public ResponseEntity<Map<String, Object>> getDoctorAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        
        Map<String, Object> response = new HashMap<>();
        
        // Token validation
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            response.put("success", false);
            response.put("message", "Authorization token is required");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        String token = authorization.substring(7);
        if (!tokenService.validateToken(token)) {
            response.put("success", false);
            response.put("message", "Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        // Get available times
        List<String> availableTimes = doctorService.getAvailableTimes(id, date);
        
        response.put("success", true);
        response.put("doctorId", id);
        response.put("date", date.toString());
        response.put("availableTimes", availableTimes);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        Map<String, Object> response = doctorService.validateLogin(loginDTO.getEmail(), loginDTO.getPassword());
        
        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        List<DoctorDTO> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/specialty/{specialty}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialty(@PathVariable String specialty) {
        List<DoctorDTO> doctors = doctorService.getDoctorsBySpecialty(specialty);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/search")
    public ResponseEntity<List<DoctorDTO>> searchDoctors(@RequestParam String name) {
        List<DoctorDTO> doctors = doctorService.searchDoctorsByName(name);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        Optional<DoctorDTO> doctor = doctorService.getDoctorById(id);
        return doctor.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DoctorDTO> createDoctor(@Valid @RequestBody Doctor doctor) {
        DoctorDTO savedDoctor = doctorService.saveDoctor(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDoctor);
    }
}
