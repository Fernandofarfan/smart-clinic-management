package com.smartclinic.service;

import com.smartclinic.config.RabbitMQConfig;
import com.smartclinic.dto.EmailRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailConsumer {

    private static final Logger logger = LoggerFactory.getLogger(EmailConsumer.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receiveEmailMessage(EmailRequest emailRequest) {
        logger.info("Processing email for: {}", emailRequest.getTo());
        try {
            sendEmail(emailRequest);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", emailRequest.getTo(), e.getMessage());
        }
    }

    private void sendEmail(EmailRequest request) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail != null ? fromEmail : "noreply@smartclinic.com");
        helper.setTo(request.getTo());
        helper.setSubject(request.getSubject());
        helper.setText(request.getBody(), request.isHtml());

        mailSender.send(message);
        logger.info("Email sent successfully to {}", request.getTo());
    }
}
