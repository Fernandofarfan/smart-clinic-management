package com.smartclinic.repository;

import com.smartclinic.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByAppointmentId(Long appointmentId);
    
    List<Payment> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    
    List<Payment> findByPaymentStatusOrderByCreatedAtDesc(String paymentStatus);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = 'COMPLETED'")
    BigDecimal getTotalRevenue();
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = 'COMPLETED' AND YEAR(p.paidAt) = :year AND MONTH(p.paidAt) = :month")
    BigDecimal getMonthlyRevenue(@Param("year") int year, @Param("month") int month);
}
