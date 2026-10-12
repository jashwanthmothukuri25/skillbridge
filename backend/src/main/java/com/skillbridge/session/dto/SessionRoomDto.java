package com.skillbridge.session.dto;

import com.skillbridge.session.entity.SessionRoom;

public class SessionRoomDto {

    private String bookingId;
    private String roomCode;
    private Boolean isActive;
    private String mentorName;
    private String studentName;
    private String packageTitle;
    private Integer durationMinutes;
    private Integer secondsRemaining = 3600;
    private String zoomLink;

    public SessionRoomDto() {}

    public static SessionRoomDto fromEntity(SessionRoom room) {
        if (room == null) return null;
        SessionRoomDto dto = new SessionRoomDto();
        dto.setRoomCode(room.getRoomCode());
        dto.setIsActive(room.getIsActive());

        if (room.getBooking() != null) {
            dto.setBookingId(room.getBooking().getBookingCode() != null
                    ? room.getBooking().getBookingCode()
                    : String.valueOf(room.getBooking().getId()));
            dto.setDurationMinutes(room.getBooking().getSnapshotDurationMinutes());
            dto.setZoomLink(room.getBooking().getZoomLink());

            if (room.getBooking().getStudent() != null) {
                dto.setStudentName(room.getBooking().getStudent().getName());
            }
            if (room.getBooking().getMentor() != null && room.getBooking().getMentor().getUser() != null) {
                dto.setMentorName(room.getBooking().getMentor().getUser().getName());
            }
            if (room.getBooking().getPackageOffer() != null) {
                dto.setPackageTitle(room.getBooking().getPackageOffer().getTitle());
            }
        }
        return dto;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getMentorName() {
        return mentorName;
    }

    public void setMentorName(String mentorName) {
        this.mentorName = mentorName;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getPackageTitle() {
        return packageTitle;
    }

    public void setPackageTitle(String packageTitle) {
        this.packageTitle = packageTitle;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getSecondsRemaining() {
        return secondsRemaining;
    }

    public void setSecondsRemaining(Integer secondsRemaining) {
        this.secondsRemaining = secondsRemaining;
    }

    public String getZoomLink() {
        return zoomLink;
    }

    public void setZoomLink(String zoomLink) {
        this.zoomLink = zoomLink;
    }
}
