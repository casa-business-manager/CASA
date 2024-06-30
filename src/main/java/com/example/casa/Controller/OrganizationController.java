package com.example.casa.Controller;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.example.casa.Model.Organization;
import com.example.casa.Model.User;
import com.example.casa.Payload.OrganizationDto;
import com.example.casa.Repository.OrganizationRepository;
import com.example.casa.Repository.UserRepository;

@RestController
public class OrganizationController {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

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
    public ResponseEntity<?> createOrganizationForUser(@PathVariable String userId, @RequestBody OrganizationDto organizationDto) {
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

        return ResponseEntity.ok().build(); 
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

        return ResponseEntity.ok().build();  
    }
}
