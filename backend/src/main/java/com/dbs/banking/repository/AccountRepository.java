package com.dbs.banking.repository;

import com.dbs.banking.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    
    Optional<Account> findByAccountNumber(String accountNumber);
    
    List<Account> findByUserId(Long userId);
    
    List<Account> findByUserIdAndAccountStatus(Long userId, Account.AccountStatus status);
    
    @Query("SELECT a FROM Account a WHERE a.user.id = :userId AND a.accountType = :accountType")
    List<Account> findByUserIdAndAccountType(@Param("userId") Long userId, @Param("accountType") Account.AccountType accountType);
    
    @Query("SELECT SUM(a.balance) FROM Account a WHERE a.user.id = :userId AND a.accountStatus = 'ACTIVE'")
    BigDecimal getTotalBalanceByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(a) FROM Account a WHERE a.user.id = :userId AND a.accountStatus = 'ACTIVE'")
    long countActiveAccountsByUserId(@Param("userId") Long userId);
    
    boolean existsByAccountNumber(String accountNumber);
} 