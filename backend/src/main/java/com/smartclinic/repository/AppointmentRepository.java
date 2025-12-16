package com.smartclinic.repository;

import com.smartclinic.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * AppointmentRepository
 * Repository interface for Appointment entity
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorIdAndAppointmentTimeBetween(Long doctorId, LocalDateTime start, LocalDateTime end);

    List<Appointment> findByPatientIdAndAppointmentTimeAfter(Long patientId, LocalDateTime time);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentTime BETWEEN :startDate AND :endDate")
    List<Appointment> findByDoctorAndDateRange(
            @Param("doctorId") Long doctorId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.appointmentTime BETWEEN :startDate AND :endDate")
    List<Appointment> findByPatientAndDateRange(
            @Param("patientId") Long patientId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.status = :status")
    List<Appointment> findByDoctorAndStatus(@Param("doctorId") Long doctorId, @Param("status") String status);
}
