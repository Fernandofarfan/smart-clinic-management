package com.smartclinic.service;

import com.smartclinic.config.RabbitMQConfig;
import com.smartclinic.dto.EmailRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailProducer {

    private static final Logger logger = LoggerFactory.getLogger(EmailProducer.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendEmailMessage(EmailRequest emailRequest) {
        logger.info("Queueing email to: {}", emailRequest.getTo());
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY, emailRequest);
    }
}
