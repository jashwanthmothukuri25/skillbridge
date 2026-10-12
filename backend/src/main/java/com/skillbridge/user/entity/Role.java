package com.skillbridge.user.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    STUDENT,
    MENTOR,
    ADMIN;

    @JsonValue
    public String toValue() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static Role fromValue(String value) {
        if (value == null) return null;
        return Role.valueOf(value.trim().toUpperCase());
    }
}
