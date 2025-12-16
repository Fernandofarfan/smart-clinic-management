package com.smartclinic.controller;

import com.smartclinic.entity.Patient;
import com.smartclinic.entity.PatientDocument;
import com.smartclinic.repository.PatientDocumentRepository;
import com.smartclinic.repository.PatientRepository;
import com.smartclinic.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private PatientDocumentRepository documentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("/upload")
    public ResponseEntity<PatientDocument> uploadFile(@RequestParam("file") MultipartFile file,
                                                      @RequestParam("patientId") Long patientId) {
        String fileName = fileStorageService.storeFile(file);

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        PatientDocument doc = new PatientDocument();
        doc.setPatient(patient);
        doc.setFileName(fileName);
        doc.setOriginalName(file.getOriginalFilename());
        doc.setUploadedAt(LocalDateTime.now());

        return ResponseEntity.ok(documentRepository.save(doc));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PatientDocument>> getDocuments(@PathVariable Long patientId) {
        return ResponseEntity.ok(documentRepository.findByPatientId(patientId));
    }
    
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        PatientDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // Optional: Delete file from storage could go here
        
        documentRepository.delete(doc);
        return ResponseEntity.noContent().build();
    }
}
