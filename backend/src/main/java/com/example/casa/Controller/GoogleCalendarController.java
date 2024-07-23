package com.example.casa.Controller;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.casa.Model.Event;
import com.example.casa.Model.User;
import com.example.casa.Payload.Event.EventDto;
import com.example.casa.Repository.EventRepository;
import com.example.casa.Repository.UserRepository;
import com.example.casa.Util.GoogleCalendarUtil;
import com.example.casa.Exception.BadRequestException;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Events;

@RestController
@RequestMapping("/google/calendar")
public class GoogleCalendarController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private EventRepository eventRepository;

	@Autowired
	private GoogleCalendarUtil googleCalendarUtil;

	@GetMapping("/events")
	public ResponseEntity<?> fetchEventsFromGoogleCalendar(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
		User currentUser = getCurrentUser();
		if (!currentUser.getProvider().equals(AuthProvider.google)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have a Google account linked.");
		}

		try {
			Calendar googleCalendar = googleCalendarUtil.getCalendarService(currentUser);
			Events events = googleCalendar.events().list("primary")
					.setTimeMin(new com.google.api.client.util.DateTime(startDate))
					.setTimeMax(new com.google.api.client.util.DateTime(endDate))
					.execute();

			List<Event> eventList = events.getItems().stream().map(event -> {
				Event newEvent = new Event();
				newEvent.setTitle(event.getSummary());
				newEvent.setDescription(event.getDescription());
				newEvent.setLocation(event.getLocation());
				newEvent.setStart(new Date(event.getStart().getDateTime().getValue()));
				newEvent.setEnd(new Date(event.getEnd().getDateTime().getValue()));
				newEvent.setEventCreator(currentUser);
				newEvent.setOrganization(currentUser.getOrganizations().iterator().next());
				newEvent.getEventAccessors().add(currentUser);

				// Check if event already exists
				if (eventRepository.findById(newEvent.getEventId()).isEmpty()) {
					eventRepository.save(newEvent);
				}
				return newEvent;
			}).collect(Collectors.toList());

			return ResponseEntity.ok(eventList);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to fetch events from Google Calendar: " + e.getMessage());
		}
	}

	@PostMapping("/events")
	public ResponseEntity<?> postEventToGoogleCalendar(@RequestBody EventDto eventRequest) {
		User currentUser = getCurrentUser();
		if (!currentUser.getProvider().equals(AuthProvider.google)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have a Google account linked.");
		}

		try {
			Calendar googleCalendar = googleCalendarUtil.getCalendarService(currentUser);
			com.google.api.services.calendar.model.Event googleEvent = new com.google.api.services.calendar.model.Event()
					.setSummary(eventRequest.getTitle())
					.setDescription(eventRequest.getDescription())
					.setLocation(eventRequest.getLocation())
					.setStart(new com.google.api.services.calendar.model.EventDateTime()
							.setDateTime(new com.google.api.client.util.DateTime(eventRequest.getStart())))
					.setEnd(new com.google.api.services.calendar.model.EventDateTime()
							.setDateTime(new com.google.api.client.util.DateTime(eventRequest.getEnd())));

			googleEvent = googleCalendar.events().insert("primary", googleEvent).execute();

			Event newEvent = new Event();
			newEvent.setTitle(googleEvent.getSummary());
			newEvent.setDescription(googleEvent.getDescription());
			newEvent.setLocation(googleEvent.getLocation());
			newEvent.setStart(new Date(googleEvent.getStart().getDateTime().getValue()));
			newEvent.setEnd(new Date(googleEvent.getEnd().getDateTime().getValue()));
			newEvent.setEventCreator(currentUser);
			newEvent.setOrganization(currentUser.getOrganizations().iterator().next());
			newEvent.getEventAccessors().add(currentUser);

			eventRepository.save(newEvent);

			return ResponseEntity.ok(newEvent);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to post event to Google Calendar: " + e.getMessage());
		}
	}

	private User getCurrentUser() {
		String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
		return userRepository.findById(currentUserId)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + currentUserId));
	}
}
