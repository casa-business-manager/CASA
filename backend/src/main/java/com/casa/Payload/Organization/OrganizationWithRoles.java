package com.casa.Payload.Organization;

import java.util.HashSet;
import java.util.Set;

import com.casa.Model.Organization;
import com.casa.Model.Role;
import com.casa.Model.User;

public class OrganizationWithRoles extends Organization {

	private Set<User> users = new HashSet<>();
	private Set<Role> roles = new HashSet<>();

	public OrganizationWithRoles() {
		this.users = new HashSet<>();
		this.roles = new HashSet<>();
	}

	public OrganizationWithRoles(Organization org) {
		super(org.getOrgName(), org.getOrgDescription(), org.getOrgLocation());
		this.setOrgId(org.getOrgId());
		this.users = new HashSet<>();
		this.roles = new HashSet<>();
	}

	// Getters and setters...
	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}
}
