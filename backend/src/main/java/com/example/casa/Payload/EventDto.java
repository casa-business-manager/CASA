package com.example.casa.Payload;

import jakarta.validation.constraints.NotBlank;

public class EventDto {

    @NotBlank
    private String id;

    private String title;

    private String location;

    private String start;

    private String end;

    private Boolean allDay;

    private String resource;

    private String eventCreatorId;

    private String[] eventAccessorIds;

    public EventDto() {
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getResource() {
        return this.resource;
    }

    public void setResource(String resource) {
        this.resource = resource;
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
