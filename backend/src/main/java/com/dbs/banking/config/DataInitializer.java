package com.dbs.banking.config;

import com.dbs.banking.entity.Account;
import com.dbs.banking.entity.Transaction;
import com.dbs.banking.entity.User;
import com.dbs.banking.repository.AccountRepository;
import com.dbs.banking.repository.TransactionRepository;
import com.dbs.banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("Cleaning up users and transactions except demo@example.com...");
        // Remove all users except demo@example.com
        userRepository.findAll().stream()
            .filter(user -> !user.getEmail().equalsIgnoreCase("demo@example.com"))
            .forEach(user -> {
                // Delete all transactions for this user
                transactionRepository.findByUserId(user.getId()).forEach(transactionRepository::delete);
                // Delete all accounts for this user
                accountRepository.findByUserId(user.getId()).forEach(accountRepository::delete);
                // Delete the user
                userRepository.delete(user);
            });
        System.out.println("Cleanup complete. Initializing demo data...");
        
        // Create demo user
        User demoUser = new User();
        demoUser.setFirstName("John");
        demoUser.setLastName("Doe");
        demoUser.setEmail("demo@example.com");
        demoUser.setPassword(passwordEncoder.encode("Password123!"));
        demoUser.setPhoneNumber("+1234567890");
        demoUser.setDateOfBirth(LocalDate.of(1990, 1, 1));
        demoUser.setAddress("123 Main St, City, State 12345");
        demoUser.setCustomerId("CUST-001");
        demoUser.setAccountStatus(User.AccountStatus.ACTIVE);
        demoUser.setCreatedAt(LocalDateTime.now());
        demoUser.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(demoUser);
        
        // Create demo accounts
        Account savingsAccount = new Account();
        savingsAccount.setAccountNumber("SAV-001");
        savingsAccount.setAccountType(Account.AccountType.SAVINGS);
        savingsAccount.setBalance(new BigDecimal("5000.00"));
        savingsAccount.setAccountStatus(Account.AccountStatus.ACTIVE);
        savingsAccount.setUser(savedUser);
        savingsAccount.setCreatedAt(LocalDateTime.now());
        savingsAccount.setUpdatedAt(LocalDateTime.now());
        
        Account checkingAccount = new Account();
        checkingAccount.setAccountNumber("CHK-001");
        checkingAccount.setAccountType(Account.AccountType.CHECKING);
        checkingAccount.setBalance(new BigDecimal("2500.00"));
        checkingAccount.setAccountStatus(Account.AccountStatus.ACTIVE);
        checkingAccount.setUser(savedUser);
        checkingAccount.setCreatedAt(LocalDateTime.now());
        checkingAccount.setUpdatedAt(LocalDateTime.now());
        
        Account savedSavingsAccount = accountRepository.save(savingsAccount);
        accountRepository.save(checkingAccount);
        
        // Create demo transactions
        Transaction transaction = new Transaction();
        transaction.setTransactionReference("TXN-001");
        transaction.setTransactionType(Transaction.TransactionType.DEPOSIT);
        transaction.setAmount(new BigDecimal("1000.00"));
        transaction.setDescription("Initial deposit");
        transaction.setTransactionStatus(Transaction.TransactionStatus.COMPLETED);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setProcessedDate(LocalDateTime.now());
        transaction.setUser(savedUser);
        transaction.setFromAccount(null);
        transaction.setToAccount(savedSavingsAccount);
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());
        
        transactionRepository.save(transaction);
        
        System.out.println("Demo data initialized successfully!");
    }
} 