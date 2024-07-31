package com.example.casa.Payload.Role;

import java.util.Set;

import jakarta.annotation.Nullable;

public class RoleDto {

	private String name;

	private String permissions;

	@Nullable
	private String managedById;

	@Nullable
	private Set<String> managedRoleIds;

	private Set<String> userIds;

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

	public String getManagedById() {
		return managedById;
	}

	public void setManagedById(String managedBy) {
		this.managedById = managedBy;
	}

	public Set<String> getManagedRoleIds() {
		return managedRoleIds;
	}

	public void setManagedRoleIds(Set<String> managedRoles) {
		this.managedRoleIds = managedRoles;
	}

	public Set<String> getUserIds() {
		return userIds;
	}

	public void setUserIds(Set<String> users) {
		this.userIds = users;
	}

}
