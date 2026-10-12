package com.skillbridge.booking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.skillbridge.booking.entity.Booking;
import com.skillbridge.booking.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

public class BookingResponse {

    private String id;
    private String studentId;
    private String studentName;
    private String mentorId;
    private String mentorName;
    private String mentorCompany;
    private String mentorAvatar;
    private String packageId;
    private String packageTitle;
    private String date;
    private String timeSlot;
    private Integer durationMinutes;
    private BigDecimal amountInr;
    private BookingStatus status;
    private String zoomLink;
    private String notes;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("h:mm a");

    public BookingResponse() {}

    public static BookingResponse fromEntity(Booking b) {
        if (b == null) return null;
        BookingResponse res = new BookingResponse();
        res.setId(b.getBookingCode() != null ? b.getBookingCode() : String.valueOf(b.getId()));

        if (b.getStudent() != null) {
            res.setStudentId(String.valueOf(b.getStudent().getId()));
            res.setStudentName(b.getStudent().getName());
        }

        if (b.getMentor() != null) {
            res.setMentorId(String.valueOf(b.getMentor().getId()));
            res.setMentorCompany(b.getMentor().getCompany());
            if (b.getMentor().getUser() != null) {
                res.setMentorName(b.getMentor().getUser().getName());
                res.setMentorAvatar(b.getMentor().getUser().getAvatarUrl());
            }
        }

        if (b.getPackageOffer() != null) {
            res.setPackageId(String.valueOf(b.getPackageOffer().getId()));
            res.setPackageTitle(b.getPackageOffer().getTitle());
        }

        if (b.getSlot() != null && b.getSlot().getStartTime() != null) {
            res.setDate(b.getSlot().getStartTime().format(DATE_FMT));
            if (b.getSlot().getEndTime() != null) {
                res.setTimeSlot(b.getSlot().getStartTime().format(TIME_FMT) + " - " + b.getSlot().getEndTime().format(TIME_FMT));
            } else {
                res.setTimeSlot(b.getSlot().getStartTime().format(TIME_FMT));
            }
        } else {
            res.setDate("Upcoming");
            res.setTimeSlot("Flexible Slot");
        }

        res.setDurationMinutes(b.getSnapshotDurationMinutes());
        res.setAmountInr(b.getSnapshotPriceInr());
        res.setStatus(b.getStatus());
        res.setZoomLink(b.getZoomLink() != null ? b.getZoomLink() : "/session/" + res.getId());
        res.setNotes(b.getNotes());

        return res;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getMentorId() {
        return mentorId;
    }

    public void setMentorId(String mentorId) {
        this.mentorId = mentorId;
    }

    public String getMentorName() {
        return mentorName;
    }

    public void setMentorName(String mentorName) {
        this.mentorName = mentorName;
    }

    public String getMentorCompany() {
        return mentorCompany;
    }

    public void setMentorCompany(String mentorCompany) {
        this.mentorCompany = mentorCompany;
    }

    public String getMentorAvatar() {
        return mentorAvatar;
    }

    public void setMentorAvatar(String mentorAvatar) {
        this.mentorAvatar = mentorAvatar;
    }

    public String getPackageId() {
        return packageId;
    }

    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }

    public String getPackageTitle() {
        return packageTitle;
    }

    public void setPackageTitle(String packageTitle) {
        this.packageTitle = packageTitle;
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

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public BigDecimal getAmountInr() {
        return amountInr;
    }

    public void setAmountInr(BigDecimal amountInr) {
        this.amountInr = amountInr;
    }

    @JsonProperty("packagePriceINR")
    public BigDecimal getPackagePriceINR() {
        return amountInr;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getZoomLink() {
        return zoomLink;
    }

    public void setZoomLink(String zoomLink) {
        this.zoomLink = zoomLink;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
