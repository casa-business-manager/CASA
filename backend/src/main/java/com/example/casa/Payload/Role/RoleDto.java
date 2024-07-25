package com.example.casa.Payload.Role;

import java.util.Set;

import com.example.casa.Model.Role;
import com.example.casa.Model.User;

public class RoleDto {

	private String name;

	private String permissions;

	private Role managedBy;

	private Set<Role> managedRoles;

	private Set<User> users;

	public RoleDto() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPermissions() {
		return permissions;
	}

	public void setPermissions(String permissions) {
		this.permissions = permissions;
	}

	public Role getManagedBy() {
		return managedBy;
	}

	public void setManagedBy(Role managedBy) {
		this.managedBy = managedBy;
	}

	public Set<Role> getManagedRoles() {
		return managedRoles;
	}

	public void setManagedRoles(Set<Role> managedRoles) {
		this.managedRoles = managedRoles;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

}
