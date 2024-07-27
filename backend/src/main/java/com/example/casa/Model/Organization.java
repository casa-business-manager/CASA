package com.example.casa.Model;

import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "organization")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Organization {

	@Id
	@GeneratedValue(generator = "UUID")
	@GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
	@Column(name = "uuid", updatable = false, unique = true, nullable = false)
	private String orgId;

	@Column(name = "org_name", nullable = false)
	private String orgName;

	@Column(name = "org_description", nullable = false)
	private String orgDescription;

	@Column(name = "org_location", nullable = false)
	private String orgLocation;

	@ManyToMany(mappedBy = "organizations", fetch = FetchType.LAZY)
	@JsonManagedReference("user-organizations")
	private Set<User> users = new HashSet<>();

	@OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonBackReference("event-organization")
	private Set<Event> events = new HashSet<>();

	@OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonManagedReference("organization-roles")
	private Set<Role> roles = new HashSet<>();

	public Organization() {
		this.users = new HashSet<>();
	}

	public Organization(String orgName, String orgDescription, String orgLocation) {
		this.orgName = orgName;
		this.orgDescription = orgDescription;
		this.orgLocation = orgLocation;
		this.users = new HashSet<>();
	}

	// Getters and setters...
	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public String getOrgDescription() {
		return orgDescription;
	}

	public void setOrgDescription(String orgDescription) {
		this.orgDescription = orgDescription;
	}

	public String getOrgLocation() {
		return orgLocation;
	}

	public void setOrgLocation(String orgLocation) {
		this.orgLocation = orgLocation;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	public Set<Event> getEvents() {
		return events;
	}

	public void setEvents(Set<Event> events) {
		this.events = events;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

}
