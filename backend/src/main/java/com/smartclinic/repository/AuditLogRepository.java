package com.smartclinic.repository;

import com.smartclinic.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    List<AuditLog> findByUserTypeAndUserIdOrderByCreatedAtDesc(String userType, Long userId);
    
    List<AuditLog> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId);
    
    List<AuditLog> findByActionOrderByCreatedAtDesc(String action);
}
