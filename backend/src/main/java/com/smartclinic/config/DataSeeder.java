package com.smartclinic.config;

import com.smartclinic.entity.*;
import com.smartclinic.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);
    
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;
    private final DoctorReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            AdminRepository adminRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            AppointmentRepository appointmentRepository,
            PaymentRepository paymentRepository,
            DoctorReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.paymentRepository = paymentRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedAdmin();
        seedDoctors();
        seedPatients();
        seedAppointmentsAndRelatedData();
    }

    private void seedAdmin() {
        if (adminRepository.findByEmail("admin@smartclinic.com").isEmpty()) {
            logger.info("Seeding Admin user...");
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setEmail("admin@smartclinic.com");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole("ADMIN");
            admin.setIsActive(true);
            adminRepository.save(admin);
            logger.info("Admin created.");
        }
    }

    private void seedDoctors() {
        if (doctorRepository.count() == 0) {
            logger.info("Seeding Doctors...");
            
            Doctor d1 = new Doctor();
            d1.setName("Dr. John Smith");
            d1.setEmail("john.smith@smartclinic.com");
            d1.setPassword(passwordEncoder.encode("admin"));
            d1.setSpecialty("Cardiology");
            d1.setPhone("555-0101");
            d1.setConsultationFee(150.00);
            d1.setBio("Expert in heart diseases with 15 years experience.");
            d1.setYearsOfExperience(15);
            d1.setIsActive(true);
            
            Doctor d2 = new Doctor();
            d2.setName("Dr. Sarah Johnson");
            d2.setEmail("sarah.johnson@smartclinic.com");
            d2.setPassword(passwordEncoder.encode("admin"));
            d2.setSpecialty("Pediatrics");
            d2.setPhone("555-0102");
            d2.setConsultationFee(120.00);
            d2.setBio("Dedicated pediatrician loving children care.");
            d2.setYearsOfExperience(10);
            d2.setIsActive(true);

            doctorRepository.saveAll(Arrays.asList(d1, d2));
            logger.info("Doctors created.");
        }
    }

    private void seedPatients() {
        if (patientRepository.count() == 0) {
            logger.info("Seeding Patients...");
            
            Patient p1 = new Patient();
            p1.setName("Alice Brown");
            p1.setEmail("alice.brown@email.com");
            p1.setPassword(passwordEncoder.encode("admin"));
            p1.setPhone("555-1001");
            p1.setIsActive(true);
            // p1.setDateOfBirth, Gender etc if needed
            
            Patient p2 = new Patient();
            p2.setName("Bob Martinez");
            p2.setEmail("bob.martinez@email.com");
            p2.setPassword(passwordEncoder.encode("admin"));
            p2.setPhone("555-1002");
            p2.setIsActive(true);

            patientRepository.saveAll(Arrays.asList(p1, p2));
            logger.info("Patients created.");
        }
    }

    private void seedAppointmentsAndRelatedData() {
        if (appointmentRepository.count() == 0 && doctorRepository.count() > 0 && patientRepository.count() > 0) {
            logger.info("Seeding Appointments...");
            
            Doctor d1 = doctorRepository.findAll().get(0);
            Doctor d2 = doctorRepository.findAll().get(1);
            Patient p1 = patientRepository.findAll().get(0);
            Patient p2 = patientRepository.findAll().get(1);

            // Appt 1: Scheduled (Server Today)
            Appointment a1 = new Appointment();
            a1.setDoctor(d1);
            a1.setPatient(p1);
            a1.setAppointmentTime(LocalDateTime.now().withHour(10).withMinute(0));
            a1.setStatus("SCHEDULED");
            a1.setSymptoms("Chest pain");
            a1.setNotes("First consultation");

            // Appt 1b: Scheduled (Server Yesterday - for Timezone overlap)
            Appointment a1b = new Appointment();
            a1b.setDoctor(d1);
            a1b.setPatient(p2);
            a1b.setAppointmentTime(LocalDateTime.now().minusDays(1).withHour(15).withMinute(30));
            a1b.setStatus("SCHEDULED");
            a1b.setSymptoms("Headache");
            a1b.setNotes("Follow up");
            
            // Appt 2: Completed & Paid
            Appointment a2 = new Appointment();
            a2.setDoctor(d2);
            a2.setPatient(p2);
            a2.setAppointmentTime(LocalDateTime.now().minusDays(2).withHour(14).withMinute(0));
            a2.setStatus("COMPLETED");
            a2.setSymptoms("Fever");
            a2.setNotes("Prescribed rest");
            
            appointmentRepository.saveAll(Arrays.asList(a1, a1b, a2));
            
            // Payment for Appt 2
            Payment pay1 = new Payment();
            pay1.setAppointment(a2);
            pay1.setPatient(p2);
            pay1.setAmount(new BigDecimal("120.00"));
            pay1.setCurrency("USD");
            pay1.setPaymentStatus("COMPLETED");
            pay1.setPaymentMethod("CREDIT_CARD");
            pay1.setPaidAt(LocalDateTime.now().minusDays(2));
            paymentRepository.save(pay1);

            // Review for Appt 2
            DoctorReview review = new DoctorReview();
            review.setDoctor(d2);
            review.setPatient(p2);
            review.setAppointment(a2);
            review.setRating(5);
            review.setComment("Dr. Sarah was wonderful!");
            reviewRepository.save(review);
            
            logger.info("Appointments, Payments, and Reviews created.");
        }
    }
}
