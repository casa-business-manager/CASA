package com.example.casa.Controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.casa.Model.Organization;
import com.example.casa.Model.Role;
import com.example.casa.Model.User;
import com.example.casa.Payload.Role.RoleDto;
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

	@GetMapping("/organization/{orgId}/roles")
	public ResponseEntity<?> getOrganizationRoles(@PathVariable String orgId) {
		Organization org = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization could not found with org id: " + orgId));

		Set<Role> orgRoles = org.getRoles();
		return ResponseEntity.ok(orgRoles);
	}

	@GetMapping("/roles/{id}/users")
	public ResponseEntity<?> getRoleUsers(@PathVariable String id) {
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Role could not found with role id: " + id));

		Set<User> users = role.getUsers();
		return ResponseEntity.ok(users);
	}

	@PostMapping("/organization/{orgId}/roles")
	public ResponseEntity<?> createRole(@PathVariable String orgId, @RequestBody RoleDto newRoleData) {
		Organization org = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization could not found with org id: " + orgId));

		Role parentRole = roleRepository.findById(newRoleData.getManagedById())
				.orElseThrow(() -> new RuntimeException(
						"Role could not found with role id: " + newRoleData.getManagedById()));

		Role newRole = new Role();
		newRole.setName(newRoleData.getName());
		newRole.setPermissions(newRoleData.getPermissions());
		newRole.setManagedBy(parentRole);
		newRole.setOrganization(org);

		if (newRoleData.getUserIds() != null) {
			for (String userId : newRoleData.getUserIds()) {
				User newUser = userRepository.findById(userId)
						.orElseThrow(() -> new RuntimeException(
								"User could not found with user id: " + userId));
				newUser.getRoles().add(newRole);
				newRole.getUsers().add(newUser);
			}
		}

		org.getRoles().add(newRole);
		roleRepository.save(newRole);

		return ResponseEntity.ok(newRole);
	}

	@PutMapping("/roles/{roleId}")
	public ResponseEntity<?> editRole(@PathVariable String roleId, @RequestBody RoleDto newRoleData) {
		Role originalRole = roleRepository.findById(roleId)
				.orElseThrow(() -> new RuntimeException("Role could not found with role id: " + roleId));

		originalRole.setName(newRoleData.getName() != null ? newRoleData.getName() : originalRole.getName());

		originalRole.setPermissions(
				newRoleData.getPermissions() != null ? newRoleData.getPermissions() : originalRole.getPermissions());

		if (newRoleData.getManagedById() != null) {
			Role newManagingRole = roleRepository.findById(newRoleData.getManagedById())
					.orElseThrow(() -> new RuntimeException(
							"Role could not found with role id: " + newRoleData.getManagedById()));
			newManagingRole.getManagedRoles().add(originalRole);
			originalRole.setManagedBy(newManagingRole);
		}

		if (newRoleData.getUserIds() != null) {
			originalRole.getUsers().clear();
			for (String userId : newRoleData.getUserIds()) {
				User newUser = userRepository.findById(userId)
						.orElseThrow(() -> new RuntimeException(
								"User could not found with user id: " + userId));
				originalRole.getUsers().add(newUser);
			}
		}

		roleRepository.save(originalRole);

		return ResponseEntity.ok(originalRole);
	}

	@PutMapping("user/{userId}/roles/{roleId}/add")
	public ResponseEntity<?> addRoleToUser(@PathVariable String userId, @PathVariable String roleId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User could not found with user id: " + userId));

		Role roleToAdd = roleRepository.findById(roleId)
				.orElseThrow(() -> new RuntimeException("Role could not found with role id: " + roleId));

		roleToAdd.getUsers().add(user);
		user.getRoles().add(roleToAdd);

		userRepository.save(user);

		return ResponseEntity.ok(user);
	}

	@PutMapping("user/{userId}/roles/{roleId}/remove")
	public ResponseEntity<?> removeRoleFromUser(@PathVariable String userId, @PathVariable String roleId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User could not found with user id: " + userId));

		Role roleToRemove = roleRepository.findById(roleId)
				.orElseThrow(() -> new RuntimeException("Role could not found with role id: " + roleId));

		roleToRemove.getUsers().remove(user);
		user.getRoles().remove(roleToRemove);

		userRepository.save(user);

		return ResponseEntity.ok(user);
	}

	@DeleteMapping("/roles/{id}")
	public ResponseEntity<?> deleteRole(@PathVariable String id) {
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Role could not be found with id: " + id));
		if (role.getManagedBy() == null) {
			return ResponseEntity.badRequest().body("Cannot delete root role");
		}
		roleRepository.deleteById(id);
		return ResponseEntity.ok().build();
	}
}
