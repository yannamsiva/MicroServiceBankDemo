package com.dbs.banking.repository;

import com.dbs.banking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByCustomerId(String customerId);
    
    boolean existsByEmail(String email);
    
    boolean existsByCustomerId(String customerId);
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.accountStatus = 'ACTIVE'")
    Optional<User> findActiveUserByEmail(@Param("email") String email);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.accountStatus = 'ACTIVE'")
    long countActiveUsers();
} 