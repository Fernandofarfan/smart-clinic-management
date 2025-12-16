package com.smartclinic.controller;

import com.smartclinic.entity.Payment;
import com.smartclinic.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * REST controller for payment management
 */
@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Payment management APIs")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping
    @Operation(summary = "Create a new payment")
    public ResponseEntity<Payment> createPayment(@RequestBody CreatePaymentRequest request) {
        Payment payment = paymentService.createPayment(
                request.getAppointmentId(),
                request.getPatientId(),
                request.getAmount(),
                request.getPaymentMethod()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }
    
    @PutMapping("/{id}/process")
    @Operation(summary = "Process payment (mark as completed)")
    public ResponseEntity<Payment> processPayment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Payment payment = paymentService.processPayment(id, request.get("transactionId"));
        return ResponseEntity.ok(payment);
    }
    
    @PutMapping("/{id}/fail")
    @Operation(summary = "Mark payment as failed")
    public ResponseEntity<Payment> markPaymentFailed(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Payment payment = paymentService.markPaymentFailed(id, request.get("reason"));
        return ResponseEntity.ok(payment);
    }
    
    @PutMapping("/{id}/refund")
    @Operation(summary = "Process refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Payment> refundPayment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Payment payment = paymentService.refundPayment(id, request.get("reason"));
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping("/appointment/{appointmentId}")
    @Operation(summary = "Get payment for an appointment")
    public ResponseEntity<Payment> getPaymentByAppointment(@PathVariable Long appointmentId) {
        Payment payment = paymentService.getPaymentByAppointment(appointmentId);
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get all payments for a patient")
    public ResponseEntity<List<Payment>> getPatientPayments(@PathVariable Long patientId) {
        List<Payment> payments = paymentService.getPatientPayments(patientId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping("/revenue/total")
    @Operation(summary = "Get total revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, BigDecimal>> getTotalRevenue() {
        BigDecimal revenue = paymentService.getTotalRevenue();
        return ResponseEntity.ok(Map.of("totalRevenue", revenue));
    }
    
    @GetMapping("/revenue/monthly")
    @Operation(summary = "Get monthly revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlyRevenue(
            @RequestParam int year,
            @RequestParam int month) {
        BigDecimal revenue = paymentService.getMonthlyRevenue(year, month);
        return ResponseEntity.ok(Map.of("monthlyRevenue", revenue));
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get payments by status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable String status) {
        List<Payment> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(payments);
    }
}

/**
 * DTO for creating a payment
 */
class CreatePaymentRequest {
    private Long appointmentId;
    private Long patientId;
    private BigDecimal amount;
    private String paymentMethod;
    
    // Getters and setters
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
