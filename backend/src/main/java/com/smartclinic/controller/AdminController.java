package com.smartclinic.controller;

import com.smartclinic.dto.LoginDTO;
import com.smartclinic.entity.Admin;
import com.smartclinic.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AdminController
 * REST controller for admin-related endpoints
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@Tag(name = "Admins", description = "Admin management APIs")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Operation(summary = "Admin login", description = "Authenticates an admin")
    @ApiResponse(responseCode = "200", description = "Login successful")
    @ApiResponse(responseCode = "401", description = "Invalid credentials")
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        Map<String, Object> response = adminService.validateLogin(loginDTO.getEmail(), loginDTO.getPassword());
        
        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
     Operation(summary = "Create admin", description = "Creates a new admin account")
    @ApiResponse(responseCode = "201", description = "Admin created successfully")
    @   }
    }

    @PostMapping
    public ResponseEntity<Admin> createAdmin(@Valid @RequestBody Admin admin) {
        Admin savedAdmin = adminService.createAdmin(admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAdmin);
    }Operation(summary = "Get admin by ID", description = "Retrieves detailed information of a specific admin")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Admin found"),
        @ApiResponse(responseCode = "404", description = "Admin not found")
    })
    @

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
