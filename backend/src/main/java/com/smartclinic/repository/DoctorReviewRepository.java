package com.smartclinic.repository;

import com.smartclinic.entity.DoctorReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorReviewRepository extends JpaRepository<DoctorReview, Long> {
    
    List<DoctorReview> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);
    
    List<DoctorReview> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    
    Optional<DoctorReview> findByAppointmentId(Long appointmentId);
    
    @Query("SELECT AVG(dr.rating) FROM DoctorReview dr WHERE dr.doctor.id = :doctorId")
    Double getAverageRatingByDoctorId(@Param("doctorId") Long doctorId);
    
    @Query("SELECT COUNT(dr) FROM DoctorReview dr WHERE dr.doctor.id = :doctorId")
    Long countByDoctorId(@Param("doctorId") Long doctorId);
}
