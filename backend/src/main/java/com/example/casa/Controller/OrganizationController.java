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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.casa.Model.Organization;
import com.example.casa.Model.User;
import com.example.casa.Payload.ApiResponse;
import com.example.casa.Payload.Organization.OrganizationDto;
import com.example.casa.Payload.Organization.OrganizationInformation;
import com.example.casa.Repository.EventRepository;
import com.example.casa.Repository.OrganizationRepository;
import com.example.casa.Repository.UserRepository;

@RestController
public class OrganizationController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private OrganizationRepository organizationRepository;

	@Autowired
	private EventRepository eventRepository;

	@GetMapping("/user/{userId}/organizations")
	public ResponseEntity<?> getOrganizationsForUser(@PathVariable String userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

		Set<Organization> organizations = user.getOrganizations();
		if (organizations.isEmpty()) {
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.ok(organizations);
	}

	@PostMapping("/user/{userId}/organizations")
	public ResponseEntity<?> createOrganizationForUser(@PathVariable String userId,
			@RequestBody OrganizationDto organizationDto) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

		Organization organization = new Organization();
		organization.setOrgName(organizationDto.getOrgName());
		organization.setOrgDescription(organizationDto.getOrgDescription());
		organization.setOrgLocation(organizationDto.getOrgLocation());
		organization.getUsers().add(user);
		user.getOrganizations().add(organization);

		organizationRepository.save(organization);
		userRepository.save(user); // Save user to update the relationship

		// Logging
		System.out.println("Organization created: " + organization.getOrgName());
		System.out.println("User organizations: " + user.getOrganizations().size());

		return ResponseEntity.ok(organization);
	}

	@PutMapping("/organization/{id}")
	public ResponseEntity<?> updateOrganization(@PathVariable String id, @RequestBody OrganizationDto organizationDto) {
		Organization organization = organizationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));

		organization.setOrgName(organizationDto.getOrgName());
		organization.setOrgDescription(organizationDto.getOrgDescription());
		organization.setOrgLocation(organizationDto.getOrgLocation());

		Organization updatedOrganization = organizationRepository.save(organization);
		return ResponseEntity.ok(updatedOrganization);
	}

	@DeleteMapping("/organization/{id}")
	public ResponseEntity<?> deleteOrganization(@PathVariable String id) {
		Organization organization = organizationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));

		organizationRepository.deleteById(id);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/organization/{id}/users")
	public ResponseEntity<?> getUsersInOrganization(@PathVariable String id) {
		Organization organization = organizationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));

		Set<User> users = organization.getUsers();
		return ResponseEntity.ok(users);
	}

	@GetMapping("/organization/{id}/info")
	public ResponseEntity<?> getOrganizationInfo(@PathVariable String id) {
		Organization organization = organizationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));

		Set<User> users = organization.getUsers();

		OrganizationInformation orgInfo = new OrganizationInformation();
		orgInfo.setName(organization.getOrgName());
		orgInfo.setPeople(users);

		return ResponseEntity.ok(orgInfo);
	}

	@PostMapping("/organization/{orgId}/invite")
	public ResponseEntity<?> inviteUserToOrganization(@PathVariable String orgId, @RequestParam String email) {
		Organization organization = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found with email: " + email));

		organization.getUsers().add(user);
		user.getOrganizations().add(organization);

		organizationRepository.save(organization);
		userRepository.save(user);

		return ResponseEntity.ok(new ApiResponse(true, "User invited successfully"));
	}

	@DeleteMapping("/organization/{orgId}/user/{userId}")
	public ResponseEntity<?> removeUserFromOrganization(@PathVariable String orgId, @PathVariable String userId) {
		Organization organization = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

		organization.getUsers().remove(user);
		user.getOrganizations().remove(organization);

		organizationRepository.save(organization);
		userRepository.save(user);

		return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
	}
}
