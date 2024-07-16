package com.example.casa.Controller;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.casa.Model.Event;
import com.example.casa.Model.Organization;
import com.example.casa.Model.User;
import com.example.casa.Payload.ApiResponse;
import com.example.casa.Payload.CalendarResponse;
import com.example.casa.Payload.EventDto;
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

    @GetMapping("/organizationCalendar/{orgId}/userId/{userId}")
    public ResponseEntity<?> getCalendarData(@PathVariable String orgId, @PathVariable String userId) {
        // Verify organization exists
        Organization organization = organizationRepository.findById(orgId)
            .orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));

        // Verify user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Check if user is part of the organization
        if (!organization.getUsers().contains(user)) {
            return ResponseEntity.status(403).body(new ApiResponse(false, "User does not have access to this organization's calendar"));
        }

        // Fetch events for the calendar and user
        Set<Event> events = eventRepository.findByOrganizationAndEventAccessorsContaining(organization, user);

        if (events.isEmpty()) {
            events = new HashSet<>();
        }

        return ResponseEntity.ok(new CalendarResponse(events));
    }

    @PostMapping("/organization/{orgId}/event")
    public ResponseEntity<?> createEvent(@PathVariable String orgId, @RequestBody EventDto eventRequest) {
        Event newEvent = new Event();
        newEvent.setTitle(eventRequest.getTitle());
        newEvent.setLocation(eventRequest.getLocation());
        newEvent.setStart(DateConverter.ISO2Date(eventRequest.getStart()));
        newEvent.setEnd(DateConverter.ISO2Date(eventRequest.getEnd()));
        newEvent.setAllDay(eventRequest.getAllDay());
        newEvent.setResource(eventRequest.getResource());
        
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));
        newEvent.setOrganization(organization);

        String creatorId = eventRequest.getEventCreatorId();
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + creatorId));
        newEvent.setEventCreator(creator);

        for (String accssorId : eventRequest.getEventAccessorIds()) {
            User accessor = userRepository.findById(accssorId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + accssorId));
            newEvent.getEventAccessors().add(accessor);
        }
        
        newEvent = eventRepository.save(newEvent);

        return ResponseEntity.ok(newEvent);
    }

    @PutMapping("/event/{eventId}")
    public ResponseEntity<?> updateEvent(@PathVariable String eventId, @RequestBody EventDto eventRequest) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));

        event.setTitle(eventRequest.getTitle() != null ? eventRequest.getTitle() : event.getTitle());
        event.setLocation(eventRequest.getLocation() != null ? eventRequest.getLocation() : event.getLocation());
        event.setStart(eventRequest.getStart() != null ? DateConverter.ISO2Date(eventRequest.getStart()) : event.getStart());
        event.setEnd(eventRequest.getEnd() != null ? DateConverter.ISO2Date(eventRequest.getEnd()) : event.getEnd());
        event.setAllDay(eventRequest.getAllDay() != null ? eventRequest.getAllDay() : event.isAllDay());
        event.setResource(eventRequest.getResource() != null ? eventRequest.getResource() : event.getResource());

        if (eventRequest.getEventAccessorIds() != null) {
            event.getEventAccessors().clear();
            for (String accssorId : eventRequest.getEventAccessorIds()) {
                User accessor = userRepository.findById(accssorId)
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + accssorId));
                event.getEventAccessors().add(accessor);
            }
        }
        
        event = eventRepository.save(event);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/event/{eventId}")
    public ResponseEntity<?> deleteOrganization(@PathVariable String eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));

        eventRepository.deleteById(eventId); // may need to delete from Org side too
        return ResponseEntity.ok().build();
    }
}
