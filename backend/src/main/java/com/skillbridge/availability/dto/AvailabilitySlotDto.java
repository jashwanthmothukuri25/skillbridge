package com.skillbridge.availability.dto;

import com.skillbridge.availability.entity.AvailabilitySlot;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class AvailabilitySlotDto {

    private String id;
    private String mentorId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String dateDisplay;
    private String timeSlotDisplay;
    private String label;
    private Boolean isBooked;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("h:mm a");

    public AvailabilitySlotDto() {}

    public static AvailabilitySlotDto fromEntity(AvailabilitySlot slot) {
        if (slot == null) return null;
        AvailabilitySlotDto dto = new AvailabilitySlotDto();
        dto.setId(String.valueOf(slot.getId()));
        if (slot.getMentor() != null) {
            dto.setMentorId(String.valueOf(slot.getMentor().getId()));
        }
        dto.setStartTime(slot.getStartTime());
        dto.setEndTime(slot.getEndTime());
        dto.setIsBooked(slot.getIsBooked());

        if (slot.getStartTime() != null && slot.getEndTime() != null) {
            String date = slot.getStartTime().format(DATE_FMT);
            String time = slot.getStartTime().format(TIME_FMT) + " - " + slot.getEndTime().format(TIME_FMT);
            dto.setDateDisplay(date);
            dto.setTimeSlotDisplay(time);
            dto.setLabel(date + " • " + time);
        }

        return dto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMentorId() {
        return mentorId;
    }

    public void setMentorId(String mentorId) {
        this.mentorId = mentorId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getDateDisplay() {
        return dateDisplay;
    }

    public void setDateDisplay(String dateDisplay) {
        this.dateDisplay = dateDisplay;
    }

    public String getTimeSlotDisplay() {
        return timeSlotDisplay;
    }

    public void setTimeSlotDisplay(String timeSlotDisplay) {
        this.timeSlotDisplay = timeSlotDisplay;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Boolean getIsBooked() {
        return isBooked;
    }

    public void setIsBooked(Boolean isBooked) {
        this.isBooked = isBooked;
    }
}
