package com.smartclinic.service;

import com.smartclinic.entity.Payment;
import com.smartclinic.entity.Appointment;
import com.smartclinic.entity.Patient;
import com.smartclinic.repository.PaymentRepository;
import com.smartclinic.repository.AppointmentRepository;
import com.smartclinic.repository.PatientRepository;
import com.smartclinic.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for managing payments
 */
@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    /**
     * Create a new payment
     */
    public Payment createPayment(Long appointmentId, Long patientId, BigDecimal amount, 
                                 String paymentMethod) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));
        
        Payment payment = new Payment();
        payment.setAppointment(appointment);
        payment.setPatient(patient);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentStatus("PENDING");
        payment.setCurrency("USD");
        payment.setCreatedAt(LocalDateTime.now());
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Process payment (mark as completed)
     */
    public Payment processPayment(Long paymentId, String transactionId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));
        
        payment.setPaymentStatus("COMPLETED");
        payment.setTransactionId(transactionId);
        payment.setPaidAt(LocalDateTime.now());
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Mark payment as failed
     */
    public Payment markPaymentFailed(Long paymentId, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));
        
        payment.setPaymentStatus("FAILED");
        payment.setNotes(reason);
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Process refund
     */
    public Payment refundPayment(Long paymentId, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));
        
        if (!"COMPLETED".equals(payment.getPaymentStatus())) {
            throw new IllegalStateException("Can only refund completed payments");
        }
        
        payment.setPaymentStatus("REFUNDED");
        payment.setNotes(reason);
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Get payment for an appointment
     */
    public Payment getPaymentByAppointment(Long appointmentId) {
        return paymentRepository.findByAppointmentId(appointmentId).orElse(null);
    }
    
    /**
     * Get all payments for a patient
     */
    public List<Payment> getPatientPayments(Long patientId) {
        return paymentRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }
    
    /**
     * Get payment by ID
     */
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
    }
    
    /**
     * Get total revenue
     */
    public BigDecimal getTotalRevenue() {
        BigDecimal revenue = paymentRepository.getTotalRevenue();
        return revenue != null ? revenue : BigDecimal.ZERO;
    }
    
    /**
     * Get monthly revenue
     */
    public BigDecimal getMonthlyRevenue(int year, int month) {
        BigDecimal revenue = paymentRepository.getMonthlyRevenue(year, month);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }
    
    /**
     * Get payments by status
     */
    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepository.findByPaymentStatusOrderByCreatedAtDesc(status);
    }
}
