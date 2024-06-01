package com.example.casa.Model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "organization")
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

    @ManyToMany(mappedBy = "organizations")
    private Set<User> users;


    public Organization() {
        this.users = new HashSet<>();
    }

    public Organization(String orgName, String orgDescription, String orgLocation) {
        this.orgName = orgName;
        this.orgDescription = orgDescription;
        this.orgLocation = orgLocation;
    }

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
}
