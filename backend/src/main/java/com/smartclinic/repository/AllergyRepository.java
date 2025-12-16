package com.smartclinic.repository;

import com.smartclinic.entity.Allergy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllergyRepository extends JpaRepository<Allergy, Long> {
    
    List<Allergy> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    
    List<Allergy> findByPatientIdAndSeverity(Long patientId, String severity);
}
