package com.casa.Payload.Event;

import java.util.Set;

import com.casa.Model.Event;

public class CalendarResponse {

	private Set<Event> events;

	public CalendarResponse(Set<Event> events) {
		this.events = events;
	}

	// Getters and setters
	public Set<Event> getEvents() {
		return events;
	}

	public void setEvents(Set<Event> events) {
		this.events = events;
	}
}
