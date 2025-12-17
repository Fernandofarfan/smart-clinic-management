package com.smartclinic.service;

import com.smartclinic.dto.AppointmentDTO;
import com.smartclinic.entity.Appointment;
import com.smartclinic.entity.Doctor;
import com.smartclinic.entity.Patient;
import com.smartclinic.repository.AppointmentRepository;
import com.smartclinic.repository.DoctorRepository;
import com.smartclinic.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AppointmentService appointmentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void bookAppointment_ShouldSuccess_WhenValidData() {
        // Arrange
        AppointmentDTO dto = new AppointmentDTO();
        dto.setDoctorId(1L);
        dto.setPatientId(1L);
        // Set a fixed time: 2025-12-17 10:00 (Wednesday) to ensure it's within working hours
        dto.setAppointmentTime(LocalDateTime.of(2025, 12, 17, 10, 0));
        
        Doctor doctor = new Doctor();
        doctor.setId(1L);
        
        Patient patient = new Patient();
        patient.setId(1L);
        
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Appointment result = appointmentService.bookAppointment(dto);

        // Assert
        assertNotNull(result);
        assertEquals("SCHEDULED", result.getStatus());
        assertEquals(doctor, result.getDoctor());
        assertEquals(patient, result.getPatient());
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
    }

    @Test
    void cancelAppointment_ShouldSuccess_WhenScheduled() {
        // Arrange
        Long appointmentId = 1L;
        Appointment appointment = new Appointment();
        appointment.setId(appointmentId);
        appointment.setStatus("SCHEDULED");
        
        Patient patient = new Patient();
        patient.setEmail("test@example.com");
        appointment.setPatient(patient);
        
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArguments()[0]);
        
        // Act
        Appointment result = appointmentService.cancelAppointment(appointmentId, "Patient request");
        
        // Assert
        assertEquals("CANCELLED", result.getStatus());
        assertEquals("Patient request", result.getCancellationReason());
    }

    @Test
    void rescheduleAppointment_ShouldThrowException_WhenCompleted() {
        // Arrange
        Long appointmentId = 1L;
        Appointment appointment = new Appointment();
        appointment.setId(appointmentId);
        appointment.setStatus("COMPLETED");
        
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));
        
        // Act & Assert
        assertThrows(IllegalStateException.class, () -> {
            appointmentService.rescheduleAppointment(appointmentId, LocalDateTime.now().plusDays(2));
        });
    }
}
