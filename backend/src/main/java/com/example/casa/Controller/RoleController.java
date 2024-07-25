package com.example.casa.Controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.casa.Model.Role;
import com.example.casa.Model.User;
import com.example.casa.Repository.OrganizationRepository;
import com.example.casa.Repository.RoleRepository;
import com.example.casa.Repository.UserRepository;

@RestController
public class RoleController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private OrganizationRepository organizationRepository;

	@Autowired
	private RoleRepository roleRepository;

	// GET, POST (CREATE), PUT (EDIT), DELETE - roles in org
	// GET, PUT (ASSIGN/REMOVE) roles for user
	// GET users with role

	@GetMapping("/roles/{id}/users")
	public ResponseEntity<?> getUsersWithRole(@PathVariable String id) {
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Users could not found with role id: " + id));

		Set<User> users = role.getUsers();
		return ResponseEntity.ok(users);
	}

	@GetMapping("/user/{userId}/roles")
	public ResponseEntity<?> getRolesForUser(@PathVariable String userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

		Set<Role> roles = user.getRoles();
		if (roles.isEmpty()) {
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.ok(roles);
	}

	@DeleteMapping("/roles/{id}")
	public ResponseEntity<?> deleteRole(@PathVariable String id) {
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Role could not be found with id: " + id));

		roleRepository.deleteById(id);
		return ResponseEntity.ok().build();
	}
}
