package com.smartclinic.repository;

import com.smartclinic.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientId(Long patientId);
    
    List<MedicalRecord> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    
    List<MedicalRecord> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);
    
    List<MedicalRecord> findByAppointmentId(Long appointmentId);
}
