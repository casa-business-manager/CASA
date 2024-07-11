package com.example.casa.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.casa.Model.Event;

public interface EventRepository extends JpaRepository<Event, String> {
    //Set<Event> findByOrganizationAndEventAccessorsContaining(Organization organization, User user);
}
