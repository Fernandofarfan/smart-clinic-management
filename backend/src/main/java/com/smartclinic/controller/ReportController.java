package com.smartclinic.controller;

import com.smartclinic.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for analytics and reports
 */
@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "System analytics and reporting APIs")
@CrossOrigin(origins = "*") // Ensure CORS is handled
public class ReportController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping("/admin/dashboard")
    @Operation(summary = "Get admin dashboard statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminDashboardStats() {
        return ResponseEntity.ok(analyticsService.getAdminDashboardStats());
    }
    
    @GetMapping("/doctor/{doctorId}/performance")
    @Operation(summary = "Get doctor performance statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Map<String, Object>> getDoctorPerformanceStats(@PathVariable Long doctorId) {
        return ResponseEntity.ok(analyticsService.getDoctorPerformanceStats(doctorId));
    }

    @GetMapping("/patient/{patientId}/health")
    @Operation(summary = "Get patient health dashboard statistics")
    // @PreAuthorize("hasAnyRole('ADMIN', 'PATIENT')")
    public ResponseEntity<Map<String, Object>> getPatientHealthStats(@PathVariable Long patientId) {
        return ResponseEntity.ok(analyticsService.getPatientHealthStats(patientId));
    }
}
