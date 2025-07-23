package com.dbs.banking.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserDto {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String address;
    private String customerId;
    private String accountStatus;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private String loginLocation;
    
    // Security settings
    private Boolean twoFactorEnabled;
    private Boolean loginNotificationsEnabled;
    private Boolean transactionAlertsEnabled;
    private Boolean biometricLoginEnabled;
    
    // Constructors
    public UserDto() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    
    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    
    public String getLoginLocation() { return loginLocation; }
    public void setLoginLocation(String loginLocation) { this.loginLocation = loginLocation; }
    
    public Boolean getTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(Boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }
    
    public Boolean getLoginNotificationsEnabled() { return loginNotificationsEnabled; }
    public void setLoginNotificationsEnabled(Boolean loginNotificationsEnabled) { this.loginNotificationsEnabled = loginNotificationsEnabled; }
    
    public Boolean getTransactionAlertsEnabled() { return transactionAlertsEnabled; }
    public void setTransactionAlertsEnabled(Boolean transactionAlertsEnabled) { this.transactionAlertsEnabled = transactionAlertsEnabled; }
    
    public Boolean getBiometricLoginEnabled() { return biometricLoginEnabled; }
    public void setBiometricLoginEnabled(Boolean biometricLoginEnabled) { this.biometricLoginEnabled = biometricLoginEnabled; }
} 