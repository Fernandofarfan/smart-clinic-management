package com.smartclinic.service;

import com.smartclinic.entity.Notification;
import com.smartclinic.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for managing notifications
 */
@Service
@Transactional
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    /**
     * Create a new notification
     */
    public Notification createNotification(String userType, Long userId, String title, String message, String type) {
        Notification notification = new Notification();
        notification.setUserType(userType);
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        return notificationRepository.save(notification);
    }
    
    /**
     * Get all notifications for a user
     */
    public List<Notification> getUserNotifications(String userType, Long userId) {
        return notificationRepository.findByUserTypeAndUserIdOrderByCreatedAtDesc(userType, userId);
    }
    
    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(String userType, Long userId) {
        return notificationRepository.findByUserTypeAndUserIdAndIsReadOrderByCreatedAtDesc(userType, userId, false);
    }
    
    /**
     * Get count of unread notifications
     */
    public Long getUnreadCount(String userType, Long userId) {
        return notificationRepository.countByUserTypeAndUserIdAndIsRead(userType, userId, false);
    }
    
    /**
     * Mark notification as read
     */
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }
    
    /**
     * Mark all notifications as read for a user
     */
    public void markAllAsRead(String userType, Long userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userType, userId);
        unreadNotifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
    
    /**
     * Delete a notification
     */
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    /**
     * Send appointment reminder
     */
    public void sendAppointmentReminder(Long patientId, String doctorName, String appointmentTime) {
        String title = "Appointment Reminder";
        String message = String.format("You have an appointment with %s at %s", doctorName, appointmentTime);
        createNotification("PATIENT", patientId, title, message, "REMINDER");
    }
    
    /**
     * Notify doctor of new appointment
     */
    public void notifyDoctorNewAppointment(Long doctorId, String patientName, String appointmentTime) {
        String title = "New Appointment";
        String message = String.format("New appointment booked by %s for %s", patientName, appointmentTime);
        createNotification("DOCTOR", doctorId, title, message, "APPOINTMENT");
    }
    
    /**
     * Notify patient of new prescription
     */
    public void notifyPatientNewPrescription(Long patientId, String doctorName) {
        String title = "New Prescription";
        String message = String.format("Dr. %s has issued a new prescription for you", doctorName);
        createNotification("PATIENT", patientId, title, message, "PRESCRIPTION");
    }
}
