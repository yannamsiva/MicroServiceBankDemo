package com.dbs.banking.controller;

import com.dbs.banking.dto.AuthResponse;
import com.dbs.banking.dto.LoginRequest;
import com.dbs.banking.dto.RegisterRequest;
import com.dbs.banking.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @GetMapping("/login")
    public ResponseEntity<String> loginGet() {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
            .body("Please use POST to log in. This endpoint does not support GET requests.");
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("[DEBUG] AuthController.login called with: " + loginRequest.getEmail());
        try {
            AuthResponse response = authService.login(loginRequest);
            System.out.println("[DEBUG] AuthController.login success: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("[DEBUG] AuthController.login exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).build();
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse response = authService.register(registerRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // In a real application, you would invalidate the token
        return ResponseEntity.ok().build();
    }
} 