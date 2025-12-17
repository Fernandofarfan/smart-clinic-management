package com.smartclinic.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * TokenService
 * Service for JWT token generation and validation
 */
@Service
public class TokenService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Generate JWT token using user email
     * 
     * @param email User's email address
     * @return JWT token string
     */
    /**
     * Generate JWT token using user details
     * 
     * @param email User's email address
     * @param userId User's ID
     * @param userType User's type (ADMIN, DOCTOR, PATIENT)
     * @return JWT token string
     */
    public String generateToken(String email, Long userId, String userType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("userId", userId);
        claims.put("userType", userType);
        
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())
                .compact();
    }
    
    // Legacy method for backward compatibility
    public String generateToken(String email) {
        return generateToken(email, 0L, "UNKNOWN");
    }

    /**
     * Get signing key from configured secret
     * 
     * @return SecretKey for JWT signing
     */
    public SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Validate JWT token
     * 
     * @param token JWT token to validate
     * @return true if token is valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extract email from JWT token
     * 
     * @param token JWT token
     * @return Email address from token
     */
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }
    
    /**
     * Extract user ID from JWT token
     */
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return String.valueOf(claims.get("userId"));
    }
    
    /**
     * Extract user type from JWT token
     */
    public String getUserTypeFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return (String) claims.get("userType");
    }
}
