package com.revengemission.sso.oauth2.server.domain;

public enum GenderEnum {

    MALE("Male"),
    FEMALE("Female"),
    UNKNOWN("Prefer Not To State");

    private String meaning;

    public String getMeaning() {
        return meaning;
    }

    GenderEnum() {
    }

    GenderEnum(String meaning) {
        this.meaning = meaning;
    }
}
