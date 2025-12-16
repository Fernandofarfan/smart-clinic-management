package com.smartclinic.service;

import com.smartclinic.entity.Notification;
import com.smartclinic.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<Notification> getUserNotifications(String userType, Long userId) {
        return notificationRepository.findByUserTypeAndUserIdOrderByCreatedAtDesc(userType, userId);
    }

    public List<Notification> getUnreadNotifications(String userType, Long userId) {
        return notificationRepository.findByUserTypeAndUserIdAndIsReadFalse(userType, userId);
    }

    public Long getUnreadCount(String userType, Long userId) {
        return notificationRepository.countByUserTypeAndUserIdAndIsRead(userType, userId, false);
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(String userType, Long userId) {
        List<Notification> unread = notificationRepository.findByUserTypeAndUserIdAndIsReadFalse(userType, userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    // New WebSocket Broadcast Method
    public void sendNotification(String message) {
        // Just broadcast for demo purposes
        messagingTemplate.convertAndSend("/topic/appointments", message);
    }
}
