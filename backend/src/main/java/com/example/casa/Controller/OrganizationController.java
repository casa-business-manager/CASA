package com.example.casa.Controller;

import java.util.HashSet;
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
import com.example.casa.Model.Role;
import com.example.casa.Model.User;
import com.example.casa.Payload.ApiResponse;
import com.example.casa.Payload.Organization.OrganizationDto;
import com.example.casa.Payload.Organization.OrganizationInformation;
import com.example.casa.Payload.Organization.OrganizationWithRoles;
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

	@PostMapping("/getOrganizationsForUser/user/{userId}")
	public ResponseEntity<?> getOrganizationsForUser(@PathVariable String userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

		Set<Organization> organizations = user.getOrganizations();

		Set<OrganizationWithRoles> organizationWithInfoSet = new HashSet<>();
		for (Organization organization : organizations) {
			Set<User> users = organization.getUsers();
			Set<Role> roles = organization.getRoles();

			OrganizationWithRoles orgInfo = new OrganizationWithRoles(organization);
			orgInfo.setUsers(users);
			orgInfo.setRoles(roles);

			organizationWithInfoSet.add(orgInfo);
		}

		return ResponseEntity.ok(organizationWithInfoSet);
	}

	@PostMapping("/createOrganizationForUser/user/{userId}")
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

		Role root = new Role();
		root.setName("root");
		root.setOrganization(organization);
		root.setUsers(new HashSet<User>() {
			{
				add(user);
			}
		});
		// TODO: Fill out permission as a json
		root.setPermissions("all:true");
		organization.setRoles(new HashSet<Role>() {
			{
				add(root);
			}
		});

		organizationRepository.save(organization);
		userRepository.save(user); // Save user to update the relationship

		// Logging
		System.out.println("Organization created: " + organization.getOrgName());
		System.out.println("User organizations: " + user.getOrganizations().size());

		return ResponseEntity.ok(organization);
	}

	@PostMapping("/updateOrganization/organization/{orgId}")
	public ResponseEntity<?> updateOrganization(@PathVariable String orgId,
			@RequestBody OrganizationDto organizationDto) {
		Organization organization = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));

		organization.setOrgName(organizationDto.getOrgName());
		organization.setOrgDescription(organizationDto.getOrgDescription());
		organization.setOrgLocation(organizationDto.getOrgLocation());

		Organization updatedOrganization = organizationRepository.save(organization);
		return ResponseEntity.ok(updatedOrganization);
	}

	@PostMapping("/deleteOrganization/organization/{orgId}")
	public ResponseEntity<?> deleteOrganization(@PathVariable String orgId) {
		Organization organization = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));

		organizationRepository.deleteById(orgId);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/getUsersInOrganization/organization/{orgId}")
	public ResponseEntity<?> getUsersInOrganization(@PathVariable String orgId) {
		Organization organization = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));

		Set<User> users = organization.getUsers();
		return ResponseEntity.ok(users);
	}

	@PostMapping("/getOrganizationInfo/organization/{orgId}")
	public ResponseEntity<?> getOrganizationInfo(@PathVariable String orgId) {
		Organization organization = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));

		Set<User> users = organization.getUsers();

		OrganizationInformation orgInfo = new OrganizationInformation();
		orgInfo.setName(organization.getOrgName());
		orgInfo.setPeople(users);

		return ResponseEntity.ok(orgInfo);
	}

	@PostMapping("/inviteUserToOrganization/organization/{orgId}")
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

	@PostMapping("/removeUserFromOrganization/organization/{orgId}/user/{userId}")
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
