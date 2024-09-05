package com.casa.Controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.casa.Model.Organization;
import com.casa.Model.Role;
import com.casa.Model.User;
import com.casa.Payload.Role.RoleDto;
import com.casa.Repository.OrganizationRepository;
import com.casa.Repository.RoleRepository;
import com.casa.Repository.UserRepository;

@RestController
public class RoleController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private OrganizationRepository organizationRepository;

	@Autowired
	private RoleRepository roleRepository;

	@PostMapping("/getOrganizationRoles/organization/{orgId}")
	public ResponseEntity<?> getOrganizationRoles(@PathVariable String orgId) {
		Organization org = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization could not found with org id: " + orgId));

		Set<Role> orgRoles = org.getRoles();
		return ResponseEntity.ok(orgRoles);
	}

	@PostMapping("/getRoleUsers/role/{roleId}")
	public ResponseEntity<?> getRoleUsers(@PathVariable String roleId) {
		Role role = roleRepository.findById(roleId)
				.orElseThrow(() -> new RuntimeException("Role could not found with role id: " + roleId));

		Set<User> users = role.getUsers();
		return ResponseEntity.ok(users);
	}

	// Causing issues and not fucking working cuz of duplicate entries
	// why dont you duplicate the amount of balls in yo jaws spring boot? fuck off
	// @PostMapping("/getRolesForUserInOrg/user/{userId}/organization/{orgId}")
	// public ResponseEntity<?> getRolesForUserInOrg(@PathVariable String userId,
	// @PathVariable String orgId) {
	// User user = userRepository.findById(userId)
	// .orElseThrow(() -> new RuntimeException("User not found with id: " +
	// userId));

	// Set<Role> roles = user.getRoles();
	// if (roles.isEmpty()) {
	// return ResponseEntity.noContent().build();
	// }

	// roles = roles.stream().filter(role ->
	// role.getOrganization().getOrgId().equals(orgId))
	// .collect(Collectors.toSet());

	// return ResponseEntity.ok(roles);
	// }

	@PostMapping("/createRole/organization/{orgId}")
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

	@PostMapping("/editRole/role/{roleId}")
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

		// if (newRoleData.getManagedRoleIds() != null) {
		// originalRole.getManagedRoles().clear();
		// for (String managedRoleId : newRoleData.getManagedRoleIds()) {
		// Role newManagedRole = roleRepository.findById(managedRoleId)
		// .orElseThrow(() -> new RuntimeException(
		// "Role could not found with role id: " + managedRoleId));
		// newManagedRole.ge
		// originalRole.getManagedRoles().add(newManagedRole);
		// }
		// }

		if (newRoleData.getUserIds() != null) {
			originalRole.getUsers().clear();
			for (String userId : newRoleData.getUserIds()) {
				User newUser = userRepository.findById(userId)
						.orElseThrow(() -> new RuntimeException(
								"User could not found with user id: " + userId));
				// newUser.getRoles().add(originalRole);
				originalRole.getUsers().add(newUser);
			}
		}

		roleRepository.save(originalRole);

		return ResponseEntity.ok(originalRole);
	}

	@PostMapping("/addRoleToUser/user/{userId}/role/{roleId}")
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

	@PostMapping("/removeRoleFromUser/user/{userId}/role/{roleId}")
	public ResponseEntity<?> removeRoleFromUser(@PathVariable String userId, @PathVariable String roleId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User could not found with user id: " + userId));

		Role roleToRemove = roleRepository.findById(roleId)
				.orElseThrow(() -> new RuntimeException("Role could not found with role id: " + roleId));

		// hopefully this hashes to the same thing... if not just iterate and remove
		roleToRemove.getUsers().remove(user);
		user.getRoles().remove(roleToRemove);

		userRepository.save(user);

		return ResponseEntity.ok(user);
	}

	@PostMapping("/deleteRole/role/{roleId}")
	public ResponseEntity<?> deleteRole(@PathVariable String roleId) {
		Role role = roleRepository.findById(roleId)
				.orElseThrow(() -> new RuntimeException("Role could not be found with id: " + roleId));
		if (role.getManagedBy() == null) {
			return ResponseEntity.badRequest().body("Cannot delete root role");
		}
		roleRepository.deleteById(roleId);
		return ResponseEntity.ok().build();
	}
}
