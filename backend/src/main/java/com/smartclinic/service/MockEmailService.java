package com.smartclinic.service;

import org.springframework.stereotype.Service;

@Service
public class MockEmailService {

    public void sendConfirmationEmail(String to, String subject, String body) {
        System.out.println("----- EMAIL SIMULATION -----");
        System.out.println("TO: " + to);
        System.out.println("SUBJECT: " + subject);
        System.out.println("BODY: " + body);
        System.out.println("----------------------------");
    }
}
