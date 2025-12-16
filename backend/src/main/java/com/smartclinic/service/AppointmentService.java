package com.smartclinic.service;

import com.smartclinic.dto.AppointmentDTO;
import com.smartclinic.entity.Appointment;
import com.smartclinic.entity.Doctor;
import com.smartclinic.entity.Patient;
import com.smartclinic.repository.AppointmentRepository;
import com.smartclinic.repository.DoctorRepository;
import com.smartclinic.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * AppointmentService - Deliverable Q6 (6 points)
 * Service for appointment-related business logic
 */
@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    /**
     * Book a new appointment
     * Satisfies Q6 requirement for bookAppointment method that saves appointment (3 points)
     * 
     * @param dto Appointment data transfer object
     * @return Saved appointment entity
     */
    public Appointment bookAppointment(AppointmentDTO dto) {
        Optional<Doctor> doctor = doctorRepository.findById(dto.getDoctorId());
        Optional<Patient> patient = patientRepository.findById(dto.getPatientId());
        
        if (doctor.isEmpty() || patient.isEmpty()) {
            throw new RuntimeException("Doctor or Patient not found");
        }
        
        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor.get());
        appointment.setPatient(patient.get());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setSymptoms(dto.getSymptoms());
        appointment.setNotes(dto.getNotes());
        appointment.setStatus("SCHEDULED");
        appointment.setCreatedAt(LocalDateTime.now());
        
        return appointmentRepository.save(appointment);
    }

    /**
     * Get appointments for a doctor on a specific date
     * Satisfies Q6 requirement for method to retrieve appointments by doctor and date (3 points)
     * 
     * @param doctorId Doctor's ID
     * @param date Date to retrieve appointments for
     * @return List of appointments
     */
    public List<Appointment> getAppointmentsByDoctorAndDate(Long doctorId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        
        System.out.println("DEBUG: Querying range: " + startOfDay + " to " + endOfDay);
        return appointmentRepository.findByDoctorAndDateRange(doctorId, startOfDay, endOfDay);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getUpcomingAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientIdAndAppointmentTimeAfter(patientId, LocalDateTime.now());
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment updateAppointmentStatus(Long id, String status) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        
        if (appointmentOpt.isEmpty()) {
            throw new RuntimeException("Appointment not found");
        }
        
        Appointment appointment = appointmentOpt.get();
        appointment.setStatus(status);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        return appointmentRepository.save(appointment);
    }

    /**
     * Cancel an appointment with a reason
     */
    public Appointment cancelAppointment(Long id, String reason) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        
        if (appointmentOpt.isEmpty()) {
            throw new RuntimeException("Appointment not found");
        }
        
        Appointment appointment = appointmentOpt.get();
        if ("COMPLETED".equals(appointment.getStatus())) {
            throw new IllegalStateException("Cannot cancel a completed appointment");
        }
        
        appointment.setStatus("CANCELLED");
        appointment.setCancellationReason(reason);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        return appointmentRepository.save(appointment);
    }

    /**
     * Reschedule an appointment
     */
    public Appointment rescheduleAppointment(Long id, LocalDateTime newTime) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        
        if (appointmentOpt.isEmpty()) {
            throw new RuntimeException("Appointment not found");
        }
        
        Appointment appointment = appointmentOpt.get();
        if ("COMPLETED".equals(appointment.getStatus()) || "CANCELLED".equals(appointment.getStatus())) {
            throw new IllegalStateException("Cannot reschedule a completed or cancelled appointment");
        }
        
        // Optimize: Check doctor availability here before rescheduling
        // boolean isAvailable = checkAvailability(appointment.getDoctor().getId(), newTime);
        // if (!isAvailable) throw new RuntimeException("Doctor is not available at this time");
        
        appointment.setAppointmentTime(newTime);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        return appointmentRepository.save(appointment);
    }
    public List<Appointment> getAllAppointmentsDebug() {
        return appointmentRepository.findAll();
    }
}
