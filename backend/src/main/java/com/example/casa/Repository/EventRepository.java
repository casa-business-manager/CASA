package com.example.casa.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.casa.Model.Event;

public interface EventRepository extends JpaRepository<Event, String> {
    Optional<Event> findByOrgName(String orgName);
    Optional<Event> findByOrgLocation(String orgLocation);
    Optional<Event> findByOrgDescription(String orgDescription);
}
