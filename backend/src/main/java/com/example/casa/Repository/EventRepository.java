package com.example.casa.Repository;

import java.util.Date;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.casa.Model.Event;
import com.example.casa.Model.Organization;
import com.example.casa.Model.User;

public interface EventRepository extends JpaRepository<Event, String> {

	Set<Event> findByOrganizationAndEventAccessorsContaining(Organization organization, User user);

	@Query("SELECT e FROM Event e WHERE e.organization = :organization AND :user MEMBER OF e.eventAccessors AND e.start < :endDate AND e.end > :startDate")
	Set<Event> findAccessibleEventsInBlock(@Param("organization") Organization organization,
			@Param("user") User user,
			@Param("startDate") Date startDate,
			@Param("endDate") Date endDate);
}
