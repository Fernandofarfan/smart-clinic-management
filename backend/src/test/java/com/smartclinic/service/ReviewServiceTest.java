package com.smartclinic.service;

import com.smartclinic.entity.Doctor;
import com.smartclinic.entity.DoctorReview;
import com.smartclinic.entity.Patient;
import com.smartclinic.entity.Appointment;
import com.smartclinic.repository.DoctorReviewRepository;
import com.smartclinic.repository.DoctorRepository;
import com.smartclinic.repository.PatientRepository;
import com.smartclinic.repository.AppointmentRepository;
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

class ReviewServiceTest {

    @Mock
    private DoctorReviewRepository reviewRepository;

    @Mock
    private DoctorRepository doctorRepository;
    
    @Mock
    private PatientRepository patientRepository;
    
    @Mock
    private AppointmentRepository appointmentRepository;

    @InjectMocks
    private ReviewService reviewService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createReview_ShouldSuccess_WhenValidData() {
        // Arrange
        Long doctorId = 1L;
        Long patientId = 1L;
        Long appointmentId = 1L;
        
        when(doctorRepository.findById(doctorId)).thenReturn(Optional.of(new Doctor()));
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(new Patient()));
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(new Appointment()));
        when(reviewRepository.findByAppointmentId(appointmentId)).thenReturn(Optional.empty());
        when(reviewRepository.save(any(DoctorReview.class))).thenAnswer(i -> i.getArguments()[0]);
        
        // Act
        DoctorReview result = reviewService.createReview(doctorId, patientId, appointmentId, 5, "Great doctor!");
        
        // Assert
        assertNotNull(result);
        assertEquals(5, result.getRating());
        assertEquals("Great doctor!", result.getComment());
        verify(reviewRepository).save(any(DoctorReview.class));
    }
    
    @Test
    void createReview_ShouldThrowException_WhenDuplicate() {
        // Arrange
        Long appointmentId = 1L;
        when(doctorRepository.findById(any())).thenReturn(Optional.of(new Doctor()));
        when(patientRepository.findById(any())).thenReturn(Optional.of(new Patient()));
        when(appointmentRepository.findById(any())).thenReturn(Optional.of(new Appointment()));
        when(reviewRepository.findByAppointmentId(appointmentId)).thenReturn(Optional.of(new DoctorReview()));
        
        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            reviewService.createReview(1L, 1L, appointmentId, 5, "Comment");
        });
    }
}
