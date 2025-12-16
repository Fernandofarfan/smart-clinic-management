package com.smartclinic.repository;

import com.smartclinic.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserTypeAndUserIdOrderByCreatedAtDesc(String userType, Long userId);
    
    List<Notification> findByUserTypeAndUserIdAndIsReadFalse(String userType, Long userId);
    
    List<Notification> findByUserTypeAndUserIdAndIsReadOrderByCreatedAtDesc(String userType, Long userId, Boolean isRead);
    
    Long countByUserTypeAndUserIdAndIsRead(String userType, Long userId, Boolean isRead);
}
