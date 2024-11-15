package com.example.casa.Controller;

import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.casa.Exception.BadRequestException;
import com.example.casa.Model.Event;
import com.example.casa.Model.Organization;
import com.example.casa.Model.User;
import com.example.casa.Payload.ApiResponse;
import com.example.casa.Payload.Event.CalendarResponse;
import com.example.casa.Payload.Event.EventDto;
import com.example.casa.Repository.EventRepository;
import com.example.casa.Repository.OrganizationRepository;
import com.example.casa.Repository.UserRepository;
import com.example.casa.Util.DateConverter;

@RestController
public class EventController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private OrganizationRepository organizationRepository;

	@Autowired
	private EventRepository eventRepository;

	// Do we want to change this so you pass in [startDate, endDate] instead of
	// [startDate, endDate) ?
	@PostMapping("/getCalendarData/organization/{orgId}/user/{userId}")
	public ResponseEntity<?> getCalendarData(@PathVariable String orgId,
			@PathVariable String userId,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {

		// Verify organization exists
		Organization organization = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));

		// Verify user exists
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

		// Check if user is part of the organization
		if (!organization.getUsers().contains(user)) {
			// What exception do we use?
			return ResponseEntity.status(403)
					.body(new ApiResponse(false, "User does not have access to this organization's calendar"));
		}

		// If start or end is not given, the query is unbounded
		if (startDate == null) {
			startDate = new Date(0);
		}
		if (endDate == null) {
			Calendar cal = Calendar.getInstance();
			cal.set(Calendar.YEAR, 9999);
			cal.set(Calendar.MONTH, Calendar.DECEMBER);
			cal.set(Calendar.DAY_OF_MONTH, 31);
			endDate = cal.getTime();
		}

		// Fetch events for the calendar and user within the specified date range
		Set<Event> events = eventRepository.findAccessibleEventsInBlock(organization, user, startDate, endDate);

		if (events.isEmpty()) {
			events = new HashSet<>();
		}

		return ResponseEntity.ok(new CalendarResponse(events));
	}

	@PostMapping("/createEvent/organization/{orgId}")
	public ResponseEntity<?> createEvent(@PathVariable String orgId, @RequestBody EventDto eventRequest) {
		Organization organization = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));

		// Check if the event already exists using Microsoft Event ID
		Optional<Event> existingEventOpt = eventRepository.findByMicrosoftEventId(eventRequest.getMicrosoftEventId());
		Event event;

		if (existingEventOpt.isPresent()) {
			// Update existing event
			event = existingEventOpt.get();
			updateEventFields(event, eventRequest);
		} else {
			// Create new event
			event = new Event();
			updateEventFields(event, eventRequest);
			event.setMicrosoftEventId(eventRequest.getMicrosoftEventId());
			event.setOrganization(organization);
		}

		// Check if the event creator exists in the organization by email
		String creatorIdentifier = eventRequest.getEventCreatorId();
		User organizerUser = null;

		// First, check by User ID
		organizerUser = userRepository.findById(creatorIdentifier).orElse(null);
		if (organizerUser == null && creatorIdentifier.contains("@")) {
			// If not found by ID, try finding by email
			organizerUser = userRepository.findByEmail(creatorIdentifier).orElse(null);
		}

		if (organizerUser != null) {
			// Internal user found; set as event creator and add as an accessor
			event.setEventCreator(organizerUser);
			event.getEventAccessors().add(organizerUser);
		} else {
			// External email; set as external creator email
			event.setExternalCreatorEmail(creatorIdentifier);
		}

		// Process accessors: add internal users by ID, add external attendees as emails
		for (String accessor : eventRequest.getEventAccessorIds()) {
			User accessorUser = null;

			// Check if the accessor is an internal user by ID first, then by email
			accessorUser = userRepository.findById(accessor).orElse(null);
			if (accessorUser == null && accessor.contains("@")) {
				accessorUser = userRepository.findByEmail(accessor).orElse(null);
			}

			if (accessorUser != null) {
				event.getEventAccessors().add(accessorUser);
			} else {
				event.getExternalAccessors().add(accessor); // Treat as an external email if not found
			}
		}

		// Ensure the organizer is included in accessors if they are internal
		if (organizerUser != null && !event.getEventAccessors().contains(organizerUser)) {
			event.getEventAccessors().add(organizerUser);
		}

		event = eventRepository.save(event);
		return ResponseEntity.ok(event);
	}

	private void updateEventFields(Event event, EventDto eventRequest) {
		event.setTitle(eventRequest.getTitle());
		event.setDescription(eventRequest.getDescription());
		event.setLocation(eventRequest.getLocation());
		event.setStart(DateConverter.ISO2Date(eventRequest.getStart()));
		event.setEnd(DateConverter.ISO2Date(eventRequest.getEnd()));
		event.setAllDay(eventRequest.getAllDay());
	}

	@PostMapping("/updateEvent/event/{eventId}")
	public ResponseEntity<?> updateEvent(@PathVariable String eventId, @RequestBody EventDto eventRequest) {
		String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();

		Event event = eventRepository.findById(eventId)
				.orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));

		if (!currentUserId.equals(
				event.getEventCreator() != null ? event.getEventCreator().getId() : event.getExternalCreatorEmail())) {
			throw new BadRequestException("User " + currentUserId + " is not the event owner!");
		}

		event.setTitle(eventRequest.getTitle() != null ? eventRequest.getTitle() : event.getTitle());
		event.setDescription(
				eventRequest.getDescription() != null ? eventRequest.getDescription() : event.getDescription());
		event.setLocation(eventRequest.getLocation() != null ? eventRequest.getLocation() : event.getLocation());
		event.setStart(
				eventRequest.getStart() != null ? DateConverter.ISO2Date(eventRequest.getStart()) : event.getStart());
		event.setEnd(eventRequest.getEnd() != null ? DateConverter.ISO2Date(eventRequest.getEnd()) : event.getEnd());
		event.setAllDay(eventRequest.getAllDay() != null ? eventRequest.getAllDay() : event.isAllDay());

		if (eventRequest.getEventAccessorIds() != null) {
			event.getEventAccessors().clear();
			event.getExternalAccessors().clear();

			for (String accessor : eventRequest.getEventAccessorIds()) {
				User accessorUser = null;

				accessorUser = userRepository.findById(accessor).orElse(null);
				if (accessorUser == null && accessor.contains("@")) {
					accessorUser = userRepository.findByEmail(accessor).orElse(null);
				}

				if (accessorUser != null) {
					event.getEventAccessors().add(accessorUser);
				} else {
					event.getExternalAccessors().add(accessor);
				}
			}
		}

		event = eventRepository.save(event);

		return ResponseEntity.ok(event);
	}

	@PostMapping("/deleteEvent/event/{eventId}")
	public ResponseEntity<?> deleteEvent(@PathVariable String eventId) {
		Event event = eventRepository.findById(eventId)
				.orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));

		eventRepository.deleteById(eventId); // may need to delete from Org side too?

		return ResponseEntity.ok().build();
	}
}
