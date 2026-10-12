package com.skillbridge.session.repository;

import com.skillbridge.session.entity.SessionRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRoomRepository extends JpaRepository<SessionRoom, Long> {

    Optional<SessionRoom> findByBookingId(Long bookingId);

    Optional<SessionRoom> findByRoomCode(String roomCode);
}
