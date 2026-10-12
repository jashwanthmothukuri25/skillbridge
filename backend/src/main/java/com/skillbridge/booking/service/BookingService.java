package com.skillbridge.booking.service;

import com.skillbridge.availability.entity.AvailabilitySlot;
import com.skillbridge.availability.repository.AvailabilitySlotRepository;
import com.skillbridge.booking.dto.BookingRequest;
import com.skillbridge.booking.dto.BookingResponse;
import com.skillbridge.booking.entity.Booking;
import com.skillbridge.booking.entity.BookingStatus;
import com.skillbridge.booking.repository.BookingRepository;
import com.skillbridge.common.exception.BadRequestException;
import com.skillbridge.common.exception.ConflictException;
import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.exception.UnauthorizedException;
import com.skillbridge.mentor.entity.MentorProfile;
import com.skillbridge.packageoffer.entity.MentorshipPackage;
import com.skillbridge.packageoffer.repository.MentorshipPackageRepository;
import com.skillbridge.payment.entity.Payment;
import com.skillbridge.payment.entity.PaymentStatus;
import com.skillbridge.payment.repository.PaymentRepository;
import com.skillbridge.session.entity.SessionRoom;
import com.skillbridge.session.repository.SessionRoomRepository;
import com.skillbridge.user.entity.Role;
import com.skillbridge.user.entity.User;
import com.skillbridge.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final MentorshipPackageRepository packageRepository;
    private final AvailabilitySlotRepository slotRepository;
    private final UserRepository userRepository;
    private final SessionRoomRepository sessionRoomRepository;
    private final PaymentRepository paymentRepository;

    public BookingService(
            BookingRepository bookingRepository,
            MentorshipPackageRepository packageRepository,
            AvailabilitySlotRepository slotRepository,
            UserRepository userRepository,
            SessionRoomRepository sessionRoomRepository,
            PaymentRepository paymentRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.packageRepository = packageRepository;
        this.slotRepository = slotRepository;
        this.userRepository = userRepository;
        this.sessionRoomRepository = sessionRoomRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public BookingResponse createBooking(Long studentId, BookingRequest request) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentId));

        MentorshipPackage pkg = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new ResourceNotFoundException("MentorshipPackage", "id", request.getPackageId()));

        MentorProfile mentor = pkg.getMentor();

        // Slot resolution: either by slotId or auto-allocate from available slots
        AvailabilitySlot slot;
        if (request.getSlotId() != null) {
            slot = slotRepository.findByIdWithPessimisticLock(request.getSlotId())
                    .orElseThrow(() -> new ResourceNotFoundException("AvailabilitySlot", "id", request.getSlotId()));
        } else {
            // Find earliest available slot for mentor
            List<AvailabilitySlot> available = slotRepository
                    .findByMentorIdAndIsBookedFalseAndStartTimeAfterOrderByStartTimeAsc(mentor.getId(), LocalDateTime.now());
            if (available.isEmpty()) {
                // Create slot for tomorrow evening as flexible fallback
                LocalDateTime tomorrow7pm = LocalDateTime.now().plusDays(1).withHour(19).withMinute(0).withSecond(0);
                slot = new AvailabilitySlot(mentor, tomorrow7pm, tomorrow7pm.plusMinutes(pkg.getDurationMinutes()));
                slot = slotRepository.save(slot);
            } else {
                slot = slotRepository.findByIdWithPessimisticLock(available.get(0).getId())
                        .orElseThrow(() -> new ConflictException("Slot is currently unavailable."));
            }
        }

        // Validate mentor ownership of slot
        if (!slot.getMentor().getId().equals(mentor.getId())) {
            throw new BadRequestException("Selected availability slot does not belong to this package's mentor.");
        }

        // Concurrency Conflict Check: prevent double booking
        if (Boolean.TRUE.equals(slot.getIsBooked()) || bookingRepository.existsBySlotId(slot.getId())) {
            throw new ConflictException("The selected slot is no longer available. Please choose another date or time.");
        }

        // Lock slot as booked
        slot.setIsBooked(true);
        slotRepository.save(slot);

        String bookingCode = "bk-" + UUID.randomUUID().toString().substring(0, 8);

        Booking booking = new Booking(
                bookingCode,
                student,
                mentor,
                pkg,
                slot,
                pkg.getPriceInr(), // Snapshot price directly from database
                pkg.getDurationMinutes()
        );
        booking.setNotes(request.getNotes());
        booking.setZoomLink("/session/" + bookingCode);

        Booking savedBooking = bookingRepository.save(booking);

        // Provision isolated SessionRoom sandbox
        SessionRoom room = new SessionRoom(savedBooking, "room-" + bookingCode + "-live");
        sessionRoomRepository.save(room);

        // Record simulated escrow hold payment
        Payment payment = new Payment(savedBooking, pkg.getPriceInr(), "tx_" + UUID.randomUUID().toString().substring(0, 12));
        payment.setStatus(PaymentStatus.SIMULATED_HOLD);
        paymentRepository.save(payment);

        return BookingResponse.fromEntity(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getStudentBookings(Long studentId) {
        return bookingRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMentorBookings(Long mentorId) {
        return bookingRepository.findByMentorIdOrderByCreatedAtDesc(mentorId).stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingDetails(String identifier, Long requestingUserId, Role role) {
        Booking booking = findByIdentifier(identifier);

        // Security authorization check
        if (role != Role.ADMIN &&
            !booking.getStudent().getId().equals(requestingUserId) &&
            !booking.getMentor().getId().equals(requestingUserId)) {
            throw new UnauthorizedException("You are not authorized to view this booking.");
        }

        return BookingResponse.fromEntity(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(String identifier, Long requestingUserId, Role role) {
        Booking booking = findByIdentifier(identifier);

        // Security authorization check
        if (role != Role.ADMIN &&
            !booking.getStudent().getId().equals(requestingUserId) &&
            !booking.getMentor().getId().equals(requestingUserId)) {
            throw new UnauthorizedException("You are not authorized to cancel this booking.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("This booking has already been cancelled.");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Completed mentorship sessions cannot be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        // Release availability slot so another student can book it
        if (booking.getSlot() != null) {
            booking.getSlot().setIsBooked(false);
            slotRepository.save(booking.getSlot());
        }

        // Update payment status to REFUNDED
        paymentRepository.findByBookingId(booking.getId()).ifPresent(payment -> {
            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
        });

        Booking updated = bookingRepository.save(booking);
        return BookingResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookingsForAdmin() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }

    private Booking findByIdentifier(String identifier) {
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
