package com.smartclinic.repository;

import com.smartclinic.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PrescriptionRepository
 * Repository interface for Prescription entity
 */
@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByDoctorId(Long doctorId);

    List<Prescription> findByPatientId(Long patientId);

    List<Prescription> findByAppointmentId(Long appointmentId);
}
