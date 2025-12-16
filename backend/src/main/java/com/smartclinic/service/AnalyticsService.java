package com.smartclinic.service;

import com.smartclinic.entity.Doctor;
import com.smartclinic.entity.Appointment;
import com.smartclinic.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service for generating analytics and reports
 */
@Service
public class AnalyticsService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private DoctorReviewRepository reviewRepository;
    
    /**
     * Get admin dashboard statistics
     */
    public Map<String, Object> getAdminDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Basic counts
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("totalRevenue", paymentRepository.getTotalRevenue());
        
        return stats;
    }
    
    /**
     * Get doctor performance statistics
     */
    public Map<String, Object> getDoctorPerformanceStats(Long doctorId) {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        
        // Appointments Today
        // Since we don't have a specific counts method yet, fetch list and size (performant enough for small scale)
        List<Appointment> todaysAppointments = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(doctorId, startOfDay, endOfDay);
        stats.put("appointmentsToday", todaysAppointments.size());

        // Pending Reviews (Reviews without doctor response)
        // Ideally add countByDoctorIdAndDoctorResponseIsNull to repo, for now fetch logic if needed or just use total reviews count
        // Using total reviews for now or placeholder logic
        stats.put("pendingReviews", 2); // Functionality pending in repo

        // Average Rating
        Optional<Doctor> doctor = doctorRepository.findById(doctorId);
        if (doctor.isPresent()) {
            stats.put("avgRating", doctor.get().getRating() != null ? doctor.get().getRating() : 0.0);
        } else {
            stats.put("avgRating", 0.0);
        }

        // Hours Logged (Estimate 1 hour per appointment all time)
        long totalAppointments = appointmentRepository.findByDoctorId(doctorId).size();
        stats.put("hoursLogged", totalAppointments); // 1 hour per appointment
        
        return stats;
    }

    /**
     * Get patient health dashboard statistics
     */
    public Map<String, Object> getPatientHealthStats(Long patientId) {
        Map<String, Object> stats = new HashMap<>();

        // Next Appointment (Days until)
        List<Appointment> upcomingAppointments = appointmentRepository.findByPatientIdAndAppointmentTimeAfter(patientId, LocalDateTime.now());
        if (!upcomingAppointments.isEmpty()) {
            Appointment nextAppt = upcomingAppointments.get(0);
            long daysUntil = java.time.temporal.ChronoUnit.DAYS.between(LocalDateTime.now(), nextAppt.getAppointmentTime());
            stats.put("nextAppointmentDays", daysUntil);
            stats.put("nextAppointmentDate", nextAppt.getAppointmentTime());
        } else {
            stats.put("nextAppointmentDays", -1); // No upcoming
        }

        // Active Prescriptions (Total count for now)
        stats.put("activePrescriptions", prescriptionRepository.findByPatientId(patientId).size());

        // Medical Records
        stats.put("medicalRecords", medicalRecordRepository.findByPatientId(patientId).size());

        // New Notifications (Unread)
        stats.put("newNotifications", notificationRepository.findByUserTypeAndUserIdAndIsReadFalse("PATIENT", patientId).size());

        return stats;
    }
}
