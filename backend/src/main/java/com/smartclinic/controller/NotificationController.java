package com.smartclinic.controller;

import com.smartclinic.entity.Notification;
import com.smartclinic.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for notification management
 */
@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "Notification management APIs")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping("/{userType}/{userId}")
    @Operation(summary = "Get all notifications for a user")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable String userType,
            @PathVariable Long userId) {
        List<Notification> notifications = notificationService.getUserNotifications(userType, userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/{userType}/{userId}/unread")
    @Operation(summary = "Get unread notifications for a user")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @PathVariable String userType,
            @PathVariable Long userId) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userType, userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/{userType}/{userId}/unread/count")
    @Operation(summary = "Get count of unread notifications")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable String userType,
            @PathVariable Long userId) {
        Long count = notificationService.getUnreadCount(userType, userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }
    
    @PutMapping("/{id}/read")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }
    
    @PutMapping("/{userType}/{userId}/mark-all-read")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @PathVariable String userType,
            @PathVariable Long userId) {
        notificationService.markAllAsRead(userType, userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a notification")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(Map.of("message", "Notification deleted successfully"));
    }
}
