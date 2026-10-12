package com.skillbridge.booking.dto;

import jakarta.validation.constraints.NotNull;

public class BookingRequest {

    @NotNull(message = "Package ID is required")
    private Long packageId;

    private Long slotId;

    private String date;

    private String timeSlot;

    private String notes;

    public BookingRequest() {}

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
