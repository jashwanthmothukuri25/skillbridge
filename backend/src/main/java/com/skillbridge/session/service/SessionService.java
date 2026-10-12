package com.skillbridge.session.service;

import com.skillbridge.booking.entity.Booking;
import com.skillbridge.booking.repository.BookingRepository;
import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.exception.UnauthorizedException;
import com.skillbridge.session.dto.SessionRoomDto;
import com.skillbridge.session.entity.SessionRoom;
import com.skillbridge.session.repository.SessionRoomRepository;
import com.skillbridge.user.entity.Role;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {

    private final SessionRoomRepository sessionRoomRepository;
    private final BookingRepository bookingRepository;

    public SessionService(SessionRoomRepository sessionRoomRepository, BookingRepository bookingRepository) {
        this.sessionRoomRepository = sessionRoomRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public SessionRoomDto getSessionRoom(String identifier, Long requestingUserId, Role role) {
        final Booking booking = resolveBooking(identifier);

        // Authorization check: only booking student, mentor, or platform admin can enter
        if (role != Role.ADMIN &&
            !booking.getStudent().getId().equals(requestingUserId) &&
            !booking.getMentor().getId().equals(requestingUserId)) {
            throw new UnauthorizedException("You are not an authorized participant for this mentorship session room.");
        }

        SessionRoom room = sessionRoomRepository.findByBookingId(booking.getId())
                .orElseGet(() -> sessionRoomRepository.save(new SessionRoom(booking, "room-" + booking.getBookingCode() + "-live")));

        return SessionRoomDto.fromEntity(room);
    }

    private Booking resolveBooking(String identifier) {
        if (identifier.startsWith("bk-")) {
            return bookingRepository.findByBookingCode(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking", "code", identifier));
        }
        try {
            Long id = Long.parseLong(identifier);
            return bookingRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        } catch (NumberFormatException e) {
            return bookingRepository.findByBookingCode(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking", "code", identifier));
        }
    }
}
