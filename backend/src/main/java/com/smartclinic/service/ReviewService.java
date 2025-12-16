package com.smartclinic.service;

import com.smartclinic.entity.DoctorReview;
import com.smartclinic.entity.Doctor;
import com.smartclinic.entity.Patient;
import com.smartclinic.entity.Appointment;
import com.smartclinic.repository.DoctorReviewRepository;
import com.smartclinic.repository.DoctorRepository;
import com.smartclinic.repository.PatientRepository;
import com.smartclinic.repository.AppointmentRepository;
import com.smartclinic.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for managing doctor reviews
 */
@Service
@Transactional
public class ReviewService {
    
    @Autowired
    private DoctorReviewRepository reviewRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    /**
     * Create a new review
     */
    public DoctorReview createReview(Long doctorId, Long patientId, Long appointmentId, 
                                     Integer rating, String comment) {
        // Validate entities exist
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));
        
        // Check if review already exists for this appointment
        if (reviewRepository.findByAppointmentId(appointmentId).isPresent()) {
            throw new RuntimeException("Review already exists for this appointment");
        }
        
        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        
        DoctorReview review = new DoctorReview();
        review.setDoctor(doctor);
        review.setPatient(patient);
        review.setAppointment(appointment);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());
        
        DoctorReview savedReview = reviewRepository.save(review);
        
        // Update doctor's average rating
        updateDoctorRating(doctorId);
        
        return savedReview;
    }
    
    /**
     * Get all reviews for a doctor
     */
    public List<DoctorReview> getDoctorReviews(Long doctorId) {
        return reviewRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
    }
    
    /**
     * Get all reviews by a patient
     */
    public List<DoctorReview> getPatientReviews(Long patientId) {
        return reviewRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }
    
    /**
     * Add doctor response to a review
     */
    public DoctorReview addDoctorResponse(Long reviewId, String response) {
        DoctorReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        
        review.setDoctorResponse(response);
        review.setUpdatedAt(LocalDateTime.now());
        
        return reviewRepository.save(review);
    }
    
    /**
     * Get doctor's average rating
     */
    public Double getDoctorAverageRating(Long doctorId) {
        Double average = reviewRepository.getAverageRatingByDoctorId(doctorId);
        return average != null ? Math.round(average * 10.0) / 10.0 : 0.0;
    }
    
    /**
     * Get total review count for a doctor
     */
    public Long getDoctorReviewCount(Long doctorId) {
        return reviewRepository.countByDoctorId(doctorId);
    }
    
    /**
     * Update doctor's cached rating and review count
     */
    private void updateDoctorRating(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        if (doctor != null) {
            Double avgRating = getDoctorAverageRating(doctorId);
            Long totalReviews = getDoctorReviewCount(doctorId);
            
            // Note: These fields need to be added to Doctor entity
            // doctor.setRating(avgRating);
            // doctor.setTotalReviews(totalReviews.intValue());
            // doctorRepository.save(doctor);
        }
    }
    
    /**
     * Delete a review
     */
    public void deleteReview(Long reviewId) {
        DoctorReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        
        Long doctorId = review.getDoctor().getId();
        reviewRepository.delete(review);
        
        // Update doctor's rating after deletion
        updateDoctorRating(doctorId);
    }
}
