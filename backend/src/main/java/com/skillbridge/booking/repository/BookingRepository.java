package com.skillbridge.booking.repository;

import com.skillbridge.booking.entity.Booking;
import com.skillbridge.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<Booking> findByMentorIdOrderByCreatedAtDesc(Long mentorId);

    Optional<Booking> findByBookingCode(String bookingCode);

    boolean existsBySlotId(Long slotId);

    long countByMentorIdAndStatus(Long mentorId, BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.snapshotPriceInr), 0) FROM Booking b WHERE b.mentor.id = :mentorId AND b.status = 'COMPLETED'")
    BigDecimal calculateTotalEarningsByMentorId(@Param("mentorId") Long mentorId);

    @Query("SELECT COALESCE(SUM(b.snapshotPriceInr), 0) FROM Booking b")
    BigDecimal calculatePlatformGrossVolume();

    List<Booking> findAllByOrderByCreatedAtDesc();
}
