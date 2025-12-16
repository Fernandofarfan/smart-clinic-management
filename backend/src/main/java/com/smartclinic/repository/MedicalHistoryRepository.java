package com.smartclinic.repository;

import com.smartclinic.entity.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {
    
    List<MedicalHistory> findByPatientIdOrderByDiagnosedDateDesc(Long patientId);
    
    List<MedicalHistory> findByPatientIdAndStatus(Long patientId, String status);
}
