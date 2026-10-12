package com.skillbridge.admin.service;

import com.skillbridge.admin.dto.AdminStatsDto;
import com.skillbridge.booking.dto.BookingResponse;
import com.skillbridge.booking.repository.BookingRepository;
import com.skillbridge.mentor.dto.MentorCardDto;
import com.skillbridge.mentor.entity.VerificationStatus;
import com.skillbridge.mentor.repository.MentorProfileRepository;
import com.skillbridge.mentor.service.MentorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminService {

    private final MentorProfileRepository mentorProfileRepository;
    private final BookingRepository bookingRepository;
    private final MentorService mentorService;

    public AdminService(
            MentorProfileRepository mentorProfileRepository,
            BookingRepository bookingRepository,
            MentorService mentorService
    ) {
        this.mentorProfileRepository = mentorProfileRepository;
        this.bookingRepository = bookingRepository;
        this.mentorService = mentorService;
    }

    @Transactional(readOnly = true)
    public AdminStatsDto getPlatformStats() {
        long pending = mentorProfileRepository.countByVerificationStatus(VerificationStatus.PENDING);
        long active = mentorProfileRepository.countByVerificationStatus(VerificationStatus.APPROVED);
        long totalBookings = bookingRepository.count();
        BigDecimal volume = bookingRepository.calculatePlatformGrossVolume();

        return new AdminStatsDto(pending, active, totalBookings, volume);
    }

    @Transactional(readOnly = true)
    public List<MentorCardDto> getPendingMentors() {
        return mentorService.getPendingMentors();
    }

    @Transactional
    public void verifyMentor(Long mentorId) {
        mentorService.approveMentor(mentorId);
    }

    @Transactional
    public void rejectMentor(Long mentorId) {
        mentorService.rejectMentor(mentorId);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }
}
