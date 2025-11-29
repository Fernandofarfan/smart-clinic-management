package com.smartclinic.service;

import com.smartclinic.dto.PrescriptionDTO;
import com.smartclinic.entity.Appointment;
import com.smartclinic.entity.Doctor;
import com.smartclinic.entity.Patient;
import com.smartclinic.entity.Prescription;
import com.smartclinic.repository.AppointmentRepository;
import com.smartclinic.repository.DoctorRepository;
import com.smartclinic.repository.PatientRepository;
import com.smartclinic.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * PrescriptionService
 * Service for prescription-related business logic
 */
@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Prescription createPrescription(PrescriptionDTO dto) {
        Optional<Doctor> doctor = doctorRepository.findById(dto.getDoctorId());
        Optional<Patient> patient = patientRepository.findById(dto.getPatientId());
        
        if (doctor.isEmpty() || patient.isEmpty()) {
            throw new RuntimeException("Doctor or Patient not found");
        }
        
        Prescription prescription = new Prescription();
        prescription.setDoctor(doctor.get());
        prescription.setPatient(patient.get());
        
        if (dto.getAppointmentId() != null) {
            Optional<Appointment> appointment = appointmentRepository.findById(dto.getAppointmentId());
            appointment.ifPresent(prescription::setAppointment);
        }
        
        prescription.setMedication(dto.getMedication());
        prescription.setDosage(dto.getDosage());
        prescription.setInstructions(dto.getInstructions());
        prescription.setDiagnosis(dto.getDiagnosis());
        prescription.setPrescribedDate(LocalDateTime.now());
        
        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getPrescriptionsByDoctor(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    public List<Prescription> getPrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }
}
