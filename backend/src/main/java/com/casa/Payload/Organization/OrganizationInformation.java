package com.casa.Payload.Organization;

import java.util.Set;

import com.casa.Model.User;

public class OrganizationInformation {

	private String name;
	private Set<User> people;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<User> getPeople() {
		return people;
	}

	public void setPeople(Set<User> people) {
		this.people = people;
	}

}
