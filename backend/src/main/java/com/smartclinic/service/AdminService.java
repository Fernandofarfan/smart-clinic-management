package com.smartclinic.service;

import com.smartclinic.entity.Admin;
import com.smartclinic.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * AdminService
 * Service for admin-related business logic
 */
@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, Object> validateLogin(String emailOrUsername, String password) {
        Map<String, Object> response = new HashMap<>();
        
        // Try to find by email first
        Optional<Admin> adminOpt = adminRepository.findByEmail(emailOrUsername);
        
        // If not found by email, try by username
        if (adminOpt.isEmpty()) {
            adminOpt = adminRepository.findByUsername(emailOrUsername);
        }
        
        if (adminOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        
        Admin admin = adminOpt.get();
        
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        
        if (!admin.getIsActive()) {
            response.put("success", false);
            response.put("message", "Account is inactive");
            return response;
        }
        
        String token = tokenService.generateToken(admin.getEmail(), admin.getId(), "ADMIN");
        
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("admin", Map.of(
                "id", admin.getId(),
                "username", admin.getUsername(),
                "email", admin.getEmail(),
                "role", admin.getRole()
        ));
        
        return response;
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }
}
