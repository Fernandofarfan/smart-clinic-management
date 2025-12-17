package com.smartclinic.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendAppointmentConfirmation(String toEmail, String patientName, String doctorName, String dateTime) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Appointment Confirmation - Smart Clinic");
            
            String htmlContent = String.format(
                "<h1>Appointment Confirmed</h1>" +
                "<p>Dear %s,</p>" +
                "<p>Your appointment with <strong>Dr. %s</strong> has been confirmed.</p>" +
                "<p><strong>Date & Time:</strong> %s</p>" +
                "<br/>" +
                "<p>Please arrive 10 minutes early.</p>" +
                "<p>Smart Clinic Team</p>",
                patientName, doctorName, dateTime
            );
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
            
        } catch (MessagingException e) {
            // Log error but don't block the main thread
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    @Async
    public void sendConfirmationEmail(String toEmail, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            
            String htmlContent = String.format(
                "<h1>%s</h1>" +
                "<p>%s</p>" +
                "<br/>" +
                "<p>Smart Clinic Team</p>",
                subject, content
            );
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
            
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
