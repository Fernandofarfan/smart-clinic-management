package com.smartclinic.controller;

import com.smartclinic.dto.DoctorDTO;
import com.smartclinic.dto.LoginDTO;
import com.smartclinic.entity.Doctor;
import com.smartclinic.service.DoctorService;
import com.smartclinic.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
 * DoctorController
 * REST controller for doctor-related endpoints
 */
@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
@Tag(name = "Doctor Management", description = "Endpoints for managing doctors, availability, and authentication")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private TokenService tokenService;

    /**
     * Get doctor availability endpoint
     * 
     * @param id Doctor ID (path variable)
     * @param date Date to check availability (query parameter)
     * @param authorization JWT token from Authorization header
     * @return ResponseEntity with structured response containing available times
     */
    @Operation(summary = "Get doctor availability", description = "Retrieves available time slots for a specific doctor on a given date")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved availability", 
            content = @Content(schema = @Schema(implementation = Map.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token"),
        @ApiResponse(responseCode = "404", description = "Doctor not found")
    })
    @GetMapping("/{id}/availability")
    public ResponseEntity<Map<String, Object>> getDoctorAvailability(
            @Parameter(description = "ID of the doctor") @PathVariable Long id,
            @Parameter(description = "Date to check availability (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @Parameter(description = "JWT Bearer Token") @RequestHeader(value = "Authorization", required = false) String authorization) {
        
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

    @Operation(summary = "Doctor Login", description = "Authenticates a doctor and returns a JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials or inactive account")
    })
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        Map<String, Object> response = doctorService.validateLogin(loginDTO.getEmail(), loginDTO.getPassword());
        
        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @Operation(summary = "Get all doctors", description = "Retrieves a list of all active doctors")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list")
    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        List<DoctorDTO> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @Operation(summary = "Get doctors by specialty", description = "Retrieves doctors filtering by their specialty")
    @GetMapping("/specialty/{specialty}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialty(@PathVariable String specialty) {
        List<DoctorDTO> doctors = doctorService.getDoctorsBySpecialty(specialty);
        return ResponseEntity.ok(doctors);
    }

    @Operation(summary = "Search doctors", description = "Search doctors by name")
    @GetMapping("/search")
    public ResponseEntity<List<DoctorDTO>> searchDoctors(@RequestParam String name) {
        List<DoctorDTO> doctors = doctorService.searchDoctorsByName(name);
        return ResponseEntity.ok(doctors);
    }

    @Operation(summary = "Get doctor by ID", description = "Retrieves detailed information of a specific doctor")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Doctor found"),
        @ApiResponse(responseCode = "404", description = "Doctor not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        Optional<DoctorDTO> doctor = doctorService.getDoctorById(id);
        return doctor.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Register new doctor", description = "Creates a new doctor account")
    @ApiResponse(responseCode = "201", description = "Doctor created successfully")
    @PostMapping
    public ResponseEntity<DoctorDTO> createDoctor(@Valid @RequestBody Doctor doctor) {
        DoctorDTO savedDoctor = doctorService.saveDoctor(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDoctor);
    }
}
