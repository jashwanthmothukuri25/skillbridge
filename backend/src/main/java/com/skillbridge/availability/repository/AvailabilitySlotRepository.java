package com.skillbridge.availability.repository;

import com.skillbridge.availability.entity.AvailabilitySlot;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {

    List<AvailabilitySlot> findByMentorIdAndIsBookedFalseAndStartTimeAfterOrderByStartTimeAsc(
            Long mentorId, LocalDateTime after
    );

    List<AvailabilitySlot> findByMentorIdOrderByStartTimeAsc(Long mentorId);

    Optional<AvailabilitySlot> findByIdAndMentorId(Long id, Long mentorId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM AvailabilitySlot s WHERE s.id = :id")
    Optional<AvailabilitySlot> findByIdWithPessimisticLock(@Param("id") Long id);
}
