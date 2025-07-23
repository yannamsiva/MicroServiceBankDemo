package com.dbs.banking.service;

import com.dbs.banking.dto.AuthResponse;
import com.dbs.banking.dto.LoginRequest;
import com.dbs.banking.dto.RegisterRequest;
import com.dbs.banking.dto.UserDto;
import com.dbs.banking.entity.Account;
import com.dbs.banking.entity.User;
import com.dbs.banking.repository.AccountRepository;
import com.dbs.banking.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private AccountRepository accountRepository;
    
    public AuthResponse login(LoginRequest loginRequest) {
        System.out.println("[DEBUG] AuthService.login called with: " + loginRequest.getEmail());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        System.out.println("[DEBUG] AuthService.login authentication success: " + authentication);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        System.out.println("[DEBUG] AuthService.login generated JWT: " + jwt);
        AuthResponse resp = new AuthResponse(jwt, userService.getUserByEmail(loginRequest.getEmail()).orElse(null));
        System.out.println("[DEBUG] AuthService.login returning: " + resp);
        return resp;
    }
    
    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if passwords match
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }
        
        // Check if user already exists
        if (userService.getUserByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with this email");
        }
        
        // Create new user
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setDateOfBirth(registerRequest.getDateOfBirth());
        user.setAddress(registerRequest.getAddress());
        
        UserDto savedUser = userService.createUser(user);
        
        // Create accounts for new user except demo@example.com
        if (!registerRequest.getEmail().equalsIgnoreCase("demo@example.com")) {
            User createdUser = userService.getUserByEmail(registerRequest.getEmail()).map(dto -> {
                User u = new User();
                u.setId(dto.getId());
                return u;
            }).orElse(null);
            if (createdUser != null) {
                Account mainAccount = new Account();
                mainAccount.setAccountNumber("CHK-" + System.currentTimeMillis());
                mainAccount.setAccountType(Account.AccountType.CHECKING);
                mainAccount.setBalance(new BigDecimal("1000.00"));
                mainAccount.setAccountStatus(Account.AccountStatus.ACTIVE);
                mainAccount.setUser(createdUser);
                mainAccount.setCreatedAt(LocalDateTime.now());
                mainAccount.setUpdatedAt(LocalDateTime.now());
                accountRepository.save(mainAccount);
                Account savingsAccount = new Account();
                savingsAccount.setAccountNumber("SAV-" + System.currentTimeMillis());
                savingsAccount.setAccountType(Account.AccountType.SAVINGS);
                savingsAccount.setBalance(BigDecimal.ZERO);
                savingsAccount.setAccountStatus(Account.AccountStatus.ACTIVE);
                savingsAccount.setUser(createdUser);
                savingsAccount.setCreatedAt(LocalDateTime.now());
                savingsAccount.setUpdatedAt(LocalDateTime.now());
                accountRepository.save(savingsAccount);
                Account investmentAccount = new Account();
                investmentAccount.setAccountNumber("FD-" + System.currentTimeMillis());
                investmentAccount.setAccountType(Account.AccountType.FIXED_DEPOSIT);
                investmentAccount.setBalance(BigDecimal.ZERO);
                investmentAccount.setAccountStatus(Account.AccountStatus.ACTIVE);
                investmentAccount.setUser(createdUser);
                investmentAccount.setCreatedAt(LocalDateTime.now());
                investmentAccount.setUpdatedAt(LocalDateTime.now());
                accountRepository.save(investmentAccount);
            }
        }
        
        // Generate token for new user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );
        
        String jwt = tokenProvider.generateToken(authentication);
        
        return new AuthResponse(jwt, savedUser);
    }
} 