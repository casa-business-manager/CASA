package com.example.casa.Model;

import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "role")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Role {

	@Id
	@GeneratedValue(generator = "UUID")
	@GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
	@Column(name = "uuid", updatable = false, unique = true, nullable = false)
	private String roleId;

	@Column(name = "name", nullable = false)
	private String name;

	@ElementCollection(targetClass = Permission.class)
	@Enumerated(EnumType.STRING)
	@Column(name = "permissions", nullable = false)
	private Set<Permission> permissions = new HashSet<>();

	@OneToMany(mappedBy = "managedBy", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference("role-relations")
	private Set<Role> managedRoles = new HashSet<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "managed_by_id")
	@JsonBackReference("role-relations")
	private Role managedBy;

	@ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "role_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
	@JsonManagedReference("user-roles")
	private Set<User> users = new HashSet<>();

	@ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinColumn(name = "organization_id")
	@JsonManagedReference("organization-roles")
	private Organization organization;

	public Role() {
	}

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<Permission> getPermissions() {
		return permissions;
	}

	public void setPermissions(Set<Permission> permissions) {
		this.permissions = permissions;
	}

	public Set<Role> getManagedRoles() {
		return managedRoles;
	}

	public void setManagedRoles(Set<Role> managedRoles) {
		this.managedRoles = managedRoles;
	}

	public Role getManagedBy() {
		return managedBy;
	}

	public void setManagedBy(Role managedBy) {
		this.managedBy = managedBy;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	public Organization getOrganization() {
		return organization;
	}

	public void setOrganization(Organization organization) {
		this.organization = organization;
	}

}
