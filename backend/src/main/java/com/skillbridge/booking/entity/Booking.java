package com.skillbridge.booking.entity;

import com.skillbridge.availability.entity.AvailabilitySlot;
import com.skillbridge.mentor.entity.MentorProfile;
import com.skillbridge.packageoffer.entity.MentorshipPackage;
import com.skillbridge.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_code", nullable = false, unique = true, length = 64)
    private String bookingCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private MentorProfile mentor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private MentorshipPackage packageOffer;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false, unique = true)
    private AvailabilitySlot slot;

    @Column(name = "snapshot_price_inr", nullable = false, precision = 10, scale = 2)
    private BigDecimal snapshotPriceInr;

    @Column(name = "snapshot_duration_minutes", nullable = false)
    private Integer snapshotDurationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status = BookingStatus.UPCOMING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "zoom_link", length = 255)
    private String zoomLink;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Booking() {}

    public Booking(String bookingCode, User student, MentorProfile mentor, MentorshipPackage packageOffer,
                   AvailabilitySlot slot, BigDecimal snapshotPriceInr, Integer snapshotDurationMinutes) {
        this.bookingCode = bookingCode;
        this.student = student;
        this.mentor = mentor;
        this.packageOffer = packageOffer;
        this.slot = slot;
        this.snapshotPriceInr = snapshotPriceInr;
        this.snapshotDurationMinutes = snapshotDurationMinutes;
        this.status = BookingStatus.UPCOMING;
        this.zoomLink = "/session/" + bookingCode;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingCode() {
        return bookingCode;
    }

    public void setBookingCode(String bookingCode) {
        this.bookingCode = bookingCode;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public MentorProfile getMentor() {
        return mentor;
    }

    public void setMentor(MentorProfile mentor) {
        this.mentor = mentor;
    }

    public MentorshipPackage getPackageOffer() {
        return packageOffer;
    }

    public void setPackageOffer(MentorshipPackage packageOffer) {
        this.packageOffer = packageOffer;
    }

    public AvailabilitySlot getSlot() {
        return slot;
    }

    public void setSlot(AvailabilitySlot slot) {
        this.slot = slot;
    }

    public BigDecimal getSnapshotPriceInr() {
        return snapshotPriceInr;
    }

    public void setSnapshotPriceInr(BigDecimal snapshotPriceInr) {
        this.snapshotPriceInr = snapshotPriceInr;
    }

    public Integer getSnapshotDurationMinutes() {
        return snapshotDurationMinutes;
    }

    public void setSnapshotDurationMinutes(Integer snapshotDurationMinutes) {
        this.snapshotDurationMinutes = snapshotDurationMinutes;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getZoomLink() {
        return zoomLink;
    }

    public void setZoomLink(String zoomLink) {
        this.zoomLink = zoomLink;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
