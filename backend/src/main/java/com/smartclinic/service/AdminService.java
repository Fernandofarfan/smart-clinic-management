package com.smartclinic.service;

import com.smartclinic.entity.Admin;
import com.smartclinic.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public Map<String, Object> validateLogin(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        
        if (adminOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        
        Admin admin = adminOpt.get();
        
        if (!admin.getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        
        if (!admin.getIsActive()) {
            response.put("success", false);
            response.put("message", "Account is inactive");
            return response;
        }
        
        String token = tokenService.generateToken(email);
        
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
