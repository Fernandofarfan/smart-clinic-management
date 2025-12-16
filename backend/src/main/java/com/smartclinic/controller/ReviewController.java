package com.smartclinic.controller;

import com.smartclinic.entity.DoctorReview;
import com.smartclinic.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for doctor review management
 */
@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews", description = "Doctor review management APIs")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @PostMapping
    @Operation(summary = "Create a new review")
    public ResponseEntity<DoctorReview> createReview(@RequestBody CreateReviewRequest request) {
        DoctorReview review = reviewService.createReview(
                request.getDoctorId(),
                request.getPatientId(),
                request.getAppointmentId(),
                request.getRating(),
                request.getComment()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }
    
    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get all reviews for a doctor")
    public ResponseEntity<List<DoctorReview>> getDoctorReviews(@PathVariable Long doctorId) {
        List<DoctorReview> reviews = reviewService.getDoctorReviews(doctorId);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get all reviews by a patient")
    public ResponseEntity<List<DoctorReview>> getPatientReviews(@PathVariable Long patientId) {
        List<DoctorReview> reviews = reviewService.getPatientReviews(patientId);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/doctor/{doctorId}/rating")
    @Operation(summary = "Get doctor's average rating")
    public ResponseEntity<Map<String, Object>> getDoctorRating(@PathVariable Long doctorId) {
        Double avgRating = reviewService.getDoctorAverageRating(doctorId);
        Long reviewCount = reviewService.getDoctorReviewCount(doctorId);
        
        return ResponseEntity.ok(Map.of(
                "doctorId", doctorId,
                "averageRating", avgRating,
                "totalReviews", reviewCount
        ));
    }
    
    @PutMapping("/{reviewId}/response")
    @Operation(summary = "Add doctor response to a review")
    public ResponseEntity<DoctorReview> addDoctorResponse(
            @PathVariable Long reviewId,
            @RequestBody Map<String, String> request) {
        DoctorReview review = reviewService.addDoctorResponse(reviewId, request.get("response"));
        return ResponseEntity.ok(review);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review")
    public ResponseEntity<Map<String, String>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }
}

/**
 * DTO for creating a review
 */
class CreateReviewRequest {
    private Long doctorId;
    private Long patientId;
    private Long appointmentId;
    private Integer rating;
    private String comment;
    
    // Getters and setters
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
