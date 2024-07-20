package com.example.casa.Payload.Event;

public class EventDto {

	private String title;

	private String description;

	private String location;

	private String start;

	private String end;

	private Boolean allDay;

	private String eventCreatorId;

	private String[] eventAccessorIds;

	public EventDto() {
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getLocation() {
		return this.location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getStart() {
		return this.start;
	}

	public void setStart(String start) {
		this.start = start;
	}

	public String getEnd() {
		return this.end;
	}

	public void setEnd(String end) {
		this.end = end;
	}

	public Boolean isAllDay() {
		return this.allDay;
	}

	public Boolean getAllDay() {
		return this.allDay;
	}

	public void setAllDay(Boolean allDay) {
		this.allDay = allDay;
	}

	public String getEventCreatorId() {
		return this.eventCreatorId;
	}

	public void setEventCreatorId(String eventCreatorId) {
		this.eventCreatorId = eventCreatorId;
	}

	public String[] getEventAccessorIds() {
		return this.eventAccessorIds;
	}

	public void setEventAccessorIds(String[] eventAccessorIds) {
		this.eventAccessorIds = eventAccessorIds;
	}

}
