package com.smartclinic.service;

import com.smartclinic.entity.Notification;
import com.smartclinic.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createNotification_ShouldSaveNotification() {
        // Arrange
        String userType = "PATIENT";
        Long userId = 1L;
        String title = "Test Notif";
        String message = "Message";
        String type = "SYSTEM";
        
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> i.getArguments()[0]);
        
        // Act
        Notification result = notificationService.createNotification(userType, userId, title, message, type);
        
        // Assert
        assertNotNull(result);
        assertEquals(userType, result.getUserType());
        assertEquals(title, result.getTitle());
        assertFalse(result.getIsRead());
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void getUnreadCount_ShouldReturnCorrectCount() {
        // Arrange
        when(notificationRepository.countByUserTypeAndUserIdAndIsRead("PATIENT", 1L, false)).thenReturn(5L);
        
        // Act
        Long count = notificationService.getUnreadCount("PATIENT", 1L);
        
        // Assert
        assertEquals(5L, count);
    }
}
