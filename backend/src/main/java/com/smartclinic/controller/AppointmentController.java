package com.smartclinic.controller;

import com.smartclinic.dto.AppointmentDTO;
import com.smartclinic.dto.LoginDTO;
import com.smartclinic.entity.Appointment;
import com.smartclinic.service.AppointmentService;
import com.smartclinic.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AppointmentController
 * REST controller for appointment-related endpoints
 */
@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
@Tag(name = "Appointments", description = "Appointment management APIs")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private TokenService tokenService;
Operation(summary = "Book appointment", description = "Books a new appointment")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Appointment booked successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping
    public ResponseEntity<Map<String, Object>> bookAppointment(
            @Valid @RequestBody AppointmentDTO appointmentDTO,
            @Parameter(hidden = true) @Valid @RequestBody AppointmentDTO appointmentDTO,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        
        Map<String, Object> response = new HashMap<>();
        
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
        
        try {
            Appointment appointment = appointmentService.bookAppointment(appointmentDTO);
            
            response.put("success", true);
            response.put("message", "Appointment booked successfully");
            response.put("appointmentId", appointment.getId());
            response.put("appointment", appointment);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
     Operation(summary = "Get doctor appointments", description = "Retrieves appointments for a specific doctor")
    @       response.put("success", false);
            response.put("message", "Error booking appointment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(
            @PathVariable Long doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        System.out.println("DEBUG: Request for Doctor ID: " + doctorId + " Date: " + date);
        List<Appointment> appointments;
        
        if (date != null) {
            appointments = appointmentService.getAppointmentsByDoctorAndDate(doctorId, date);
        } else {
     Operation(summary = "Get patient appointments", description = "Retrieves appointments for a specific patient")
    @       appointments = appointmentService.getAppointmentsByDoctor(doctorId);
        }
        System.out.println("DEBUG: Found " + appointments.size() + " appointments");
        
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(
            @PathVariable Long patientId,
            @RequestParam(required = false, defaultValue = "false") boolean upcoming) {
        
        List<Appointment> appointments;
        if (upcoming) {
            appointments = appointmentService.getUpcomingAppointmentsByPatient(patientId);
        } else {
            appointments = appointmentService.getAppointmentsByPatient(patientId);
        }
        
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        
        try {
            Appointment appointment = appointmentService.updateAppointmentStatus(id, status);
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<?> rescheduleAppointment(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newTime) {
        try {
            Appointment appointment = appointmentService.rescheduleAppointment(id, newTime);
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        try {
            Appointment appointment = appointmentService.cancelAppointment(id, reason != null ? reason : "Cancelled by patient");
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @GetMapping("/debug/all")
    public ResponseEntity<List<Appointment>> getAllAppointmentsDebug() {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsDebug());
    }
}
