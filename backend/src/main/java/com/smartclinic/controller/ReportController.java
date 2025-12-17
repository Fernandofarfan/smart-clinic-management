package com.smartclinic.controller;

import com.smartclinic.entity.Appointment;
import com.smartclinic.service.AnalyticsService;
import com.smartclinic.service.AppointmentService;
import com.smartclinic.service.PdfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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

    @Autowired
    private PdfService pdfService;

    @Autowired
    private AppointmentService appointmentService;
    
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

    @Operation(summary = "Download Appointment PDF", description = "Generates a PDF summary for a specific appointment")
    @GetMapping("/appointments/{id}/pdf")
    public ResponseEntity<byte[]> downloadAppointmentPdf(@PathVariable Long id) {
        Appointment appointment = appointmentService.getAppointmentById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        byte[] pdfBytes = pdfService.generateAppointmentSummary(appointment);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "appointment_" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
