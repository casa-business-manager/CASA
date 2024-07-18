package com.example.casa.Repository;

import java.util.Date;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.casa.Model.Event;
import com.example.casa.Model.Organization;
import com.example.casa.Model.User;

public interface EventRepository extends JpaRepository<Event, String> {

    Set<Event> findByOrganizationAndEventAccessorsContaining(Organization organization, User user);

    Set<Event> findByOrganizationAndEventAccessorsContainingAndStartBetween(Organization organization, User user, Date startDate, Date endDate);
}
