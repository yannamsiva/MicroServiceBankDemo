package com.dbs.banking.repository;

import com.dbs.banking.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionReference(String transactionReference);
    
    List<Transaction> findByUserId(Long userId);
    
    Page<Transaction> findByUserId(Long userId, Pageable pageable);
    
    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.transactionDate BETWEEN :startDate AND :endDate")
    List<Transaction> findByUserIdAndDateRange(@Param("userId") Long userId, 
                                             @Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.transactionType = :transactionType")
    List<Transaction> findByUserIdAndTransactionType(@Param("userId") Long userId, 
                                                   @Param("transactionType") Transaction.TransactionType transactionType);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.fromAccount.id = :accountId")
    List<Transaction> findByUserIdAndFromAccount(@Param("userId") Long userId, @Param("accountId") Long accountId);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.toAccount.id = :accountId")
    List<Transaction> findByUserIdAndToAccount(@Param("userId") Long userId, @Param("accountId") Long accountId);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.transactionType = 'CREDIT' AND t.transactionStatus = 'COMPLETED'")
    BigDecimal getTotalCreditsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.transactionType = 'DEBIT' AND t.transactionStatus = 'COMPLETED'")
    BigDecimal getTotalDebitsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.id = :userId AND t.transactionStatus = 'COMPLETED'")
    long countCompletedTransactionsByUserId(@Param("userId") Long userId);
    
    boolean existsByTransactionReference(String transactionReference);
} 