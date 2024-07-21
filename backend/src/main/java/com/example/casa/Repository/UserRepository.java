package com.example.casa.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.casa.Model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

	Optional<User> findByEmail(String email);

	Optional<User> findById(String userId);

	Boolean existsByEmail(String email);

}
