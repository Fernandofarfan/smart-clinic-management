package com.smartclinic.service;

import com.smartclinic.dto.EmailRequest;
import com.smartclinic.entity.Appointment;
import com.smartclinic.repository.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AppointmentReminderService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentReminderService.class);

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EmailProducer emailProducer;

    /**
     * Runs every day at 8:00 AM to send reminders for appointments scheduled for the next day.
     */
    @Scheduled(cron = "0 0 8 * * *")
    public void sendDailyReminders() {
        logger.info("Starting daily appointment reminder job...");

        LocalDateTime startOfNextDay = LocalDateTime.now().plusDays(1).withHour(0).withMinute(0);
        LocalDateTime endOfNextDay = LocalDateTime.now().plusDays(1).withHour(23).withMinute(59);

        List<Appointment> upcomingAppointments = appointmentRepository.findByAppointmentTimeBetween(startOfNextDay, endOfNextDay);

        logger.info("Found {} appointments for tomorrow.", upcomingAppointments.size());

        for (Appointment appointment : upcomingAppointments) {
            try {
                String patientEmail = appointment.getPatient().getEmail();
                String patientName = appointment.getPatient().getName();
                String doctorName = appointment.getDoctor().getName();
                String time = appointment.getAppointmentTime().format(DateTimeFormatter.ofPattern("HH:mm"));

                String subject = "Reminder: Appointment Tomorrow with " + doctorName;
                String body = String.format("Dear %s,\n\nThis is a reminder for your appointment tomorrow at %s with %s.\n\nPlease arrive 10 minutes early.\n\nSmart Clinic Team",
                        patientName, time, doctorName);

                EmailRequest emailRequest = new EmailRequest(patientEmail, subject, body, false);
                emailProducer.sendEmailMessage(emailRequest);
                
                logger.info("Reminder queued for {}", patientEmail);

            } catch (Exception e) {
                logger.error("Failed to queue reminder for appointment ID: {}", appointment.getId(), e);
            }
        }

        logger.info("Daily appointment reminder job completed.");
    }
}
