package com.example.casa.Model;

import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "permissionSet")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Role {

	@Id
	@GeneratedValue(generator = "UUID")
	@GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
	@Column(name = "uuid", updatable = false, unique = true, nullable = false)
	private String permissionSetId;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "permissions", nullable = false)
	private String permissions;

	@ManyToMany
	@JoinTable(name = "role_managed_roles", joinColumns = @JoinColumn(name = "role_id"), inverseJoinColumns = @JoinColumn(name = "managed_role_id"))
	private Set<Role> managedRoles = new HashSet<>();

	@ManyToMany(mappedBy = "managedRoles")
	private Set<Role> managedBy = new HashSet<>();

	public Role() {
	}

	public String getPermissionSetId() {
		return permissionSetId;
	}

	public void setPermissionSetId(String permissionSetId) {
		this.permissionSetId = permissionSetId;
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

	public Set<Role> getManagedRoles() {
		return managedRoles;
	}

	public void setManagedRoles(Set<Role> managedRoles) {
		this.managedRoles = managedRoles;
	}

	public Set<Role> getManagedBy() {
		return managedBy;
	}

	public void setManagedBy(Set<Role> managedBy) {
		this.managedBy = managedBy;
	}

}
