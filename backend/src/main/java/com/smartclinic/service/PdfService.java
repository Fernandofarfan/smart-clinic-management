package com.smartclinic.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.smartclinic.entity.Appointment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] generateAppointmentSummary(Appointment appointment) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            document.add(new Paragraph("SMART CLINIC").setFontSize(18).setBold());
            document.add(new Paragraph("Visit Summary & Prescription").setFontSize(14));
            document.add(new Paragraph("------------------------------------------------"));
            
            document.add(new Paragraph("Date: " + appointment.getAppointmentTime()));
            document.add(new Paragraph("Doctor: " + appointment.getDoctor().getName()));
            document.add(new Paragraph("Patient: " + appointment.getPatient().getName()));
            document.add(new Paragraph("Status: " + appointment.getStatus()));
            document.add(new Paragraph("------------------------------------------------"));
            
            document.add(new Paragraph("Symptoms/Reason:"));
            document.add(new Paragraph(appointment.getSymptoms() != null ? appointment.getSymptoms() : "N/A"));
            
            document.add(new Paragraph("\n"));
            if (appointment.getNotes() != null) {
                document.add(new Paragraph("Doctor Notes / Rx:"));
                document.add(new Paragraph(appointment.getNotes()));
            }

            document.add(new Paragraph("\n\n\n\nSigned: __________________________"));
            
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating PDF");
        }
        
        return out.toByteArray();
    }
}
