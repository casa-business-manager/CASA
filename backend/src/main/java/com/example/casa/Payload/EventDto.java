package com.example.casa.Payload;

import jakarta.validation.constraints.NotBlank;

public class EventDto {

    private String id;

    @NotBlank
    private String title;

    @NotBlank
    private String location;

    @NotBlank
    private String stateTime;

    @NotBlank
    private String endTime;

    private Boolean allDay;

    private String resource;

    @NotBlank
    private String eventCreator;

    @NotBlank
    private String eventAccessors;

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

    public String getStateTime() {
        return this.stateTime;
    }

    public void setStateTime(String stateTime) {
        this.stateTime = stateTime;
    }

    public String getEndTime() {
        return this.endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
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

    public String getEventCreator() {
        return this.eventCreator;
    }

    public void setEventCreator(String eventCreator) {
        this.eventCreator = eventCreator;
    }

    public String getEventAccessors() {
        return this.eventAccessors;
    }

    public void setEventAccessors(String eventAccessors) {
        this.eventAccessors = eventAccessors;
    }

}
