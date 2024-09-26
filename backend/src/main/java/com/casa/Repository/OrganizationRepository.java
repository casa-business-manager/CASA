package com.casa.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.casa.Model.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, String> {

	Optional<Organization> findByOrgName(String orgName);

	Optional<Organization> findByOrgLocation(String orgLocation);

	Optional<Organization> findByOrgDescription(String orgDescription);
}
