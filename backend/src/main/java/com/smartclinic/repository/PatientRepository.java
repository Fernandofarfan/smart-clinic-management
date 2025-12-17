package com.smartclinic.repository;

import com.smartclinic.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * PatientRepository
 * Repository interface for Patient entity with custom query methods
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    /**
     * Find patient by email - derived query method
     */
    Optional<Patient> findByEmail(String email);

    /**
     * Find patient by email or phone - derived query method
     */
    Optional<Patient> findByEmailOrPhone(String email, String phone);
}
