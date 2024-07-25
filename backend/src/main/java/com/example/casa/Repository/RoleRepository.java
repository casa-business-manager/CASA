package com.example.casa.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.casa.Model.Role;

public interface RoleRepository extends JpaRepository<Role, String> {

	Optional<Role> findByName(String name);
}
