package com.smartclinic.repository;

import com.smartclinic.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * DoctorRepository
 * Repository interface for Doctor entity
 */
@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByEmail(String email);

    List<Doctor> findBySpecialty(String specialty);

    List<Doctor> findByIsActiveTrue();

    @Query("SELECT d FROM Doctor d WHERE d.specialty = :specialty AND d.isActive = true")
    List<Doctor> findActiveBySpecialty(@Param("specialty") String specialty);

    @Query("SELECT d FROM Doctor d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%')) AND d.isActive = true")
    List<Doctor> searchByName(@Param("name") String name);
}
