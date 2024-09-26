package com.casa.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.casa.Model.Role;

public interface RoleRepository extends JpaRepository<Role, String> {

	// Optional<Role> findByName(String name);
}
