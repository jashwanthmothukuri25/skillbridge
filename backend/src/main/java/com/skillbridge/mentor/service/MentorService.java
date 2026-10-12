package com.skillbridge.mentor.service;

import com.skillbridge.booking.entity.BookingStatus;
import com.skillbridge.booking.repository.BookingRepository;
import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.response.PagedResponse;
import com.skillbridge.mentor.dto.MentorCardDto;
import com.skillbridge.mentor.dto.MentorStatsDto;
import com.skillbridge.mentor.entity.MentorProfile;
import com.skillbridge.mentor.entity.VerificationStatus;
import com.skillbridge.mentor.repository.MentorProfileRepository;
import com.skillbridge.packageoffer.dto.PackageDto;
import com.skillbridge.packageoffer.repository.MentorshipPackageRepository;
import com.skillbridge.review.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MentorService {

    private final MentorProfileRepository mentorProfileRepository;
    private final MentorshipPackageRepository packageRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    public MentorService(
            MentorProfileRepository mentorProfileRepository,
            MentorshipPackageRepository packageRepository,
            BookingRepository bookingRepository,
            ReviewRepository reviewRepository
    ) {
        this.mentorProfileRepository = mentorProfileRepository;
        this.packageRepository = packageRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<MentorCardDto> searchMentors(
            String company, String skill, String query, String sortBy, int page, int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "rating");
        if ("experience".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "experienceYears");
        } else if ("priceLow".equalsIgnoreCase(sortBy) || "priceAsc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "hourlyRateInr");
        } else if ("priceDesc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "hourlyRateInr");
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        String companyParam = (company != null && !"all".equalsIgnoreCase(company)) ? company : null;
        String skillParam = (skill != null && !"all".equalsIgnoreCase(skill)) ? skill : null;
        String searchParam = (query != null && !query.trim().isEmpty()) ? query.trim() : null;

        Page<MentorProfile> pageResult = mentorProfileRepository.searchMentors(
                VerificationStatus.APPROVED, companyParam, skillParam, searchParam, pageable
        );

        List<MentorCardDto> dtos = pageResult.getContent().stream()
                .map(this::enrichMentorCard)
                .toList();

        return new PagedResponse<>(
                dtos,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast()
        );
    }

    @Transactional(readOnly = true)
    public List<MentorCardDto> getAllApprovedMentors() {
        return mentorProfileRepository.findByVerificationStatus(VerificationStatus.APPROVED)
                .stream()
                .map(this::enrichMentorCard)
                .toList();
    }

    @Transactional(readOnly = true)
    public MentorCardDto getMentorById(Long id) {
        MentorProfile profile = mentorProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor", "id", id));
        return enrichMentorCard(profile);
    }

    @Transactional(readOnly = true)
    public List<MentorCardDto> getPendingMentors() {
        return mentorProfileRepository.findByVerificationStatus(VerificationStatus.PENDING)
                .stream()
                .map(MentorCardDto::fromEntity)
                .toList();
    }

    @Transactional
    public void approveMentor(Long id) {
        MentorProfile profile = mentorProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor", "id", id));
        profile.setVerificationStatus(VerificationStatus.APPROVED);
        profile.setWorkIdVerified(true);
        mentorProfileRepository.save(profile);
    }

    @Transactional
    public void rejectMentor(Long id) {
        MentorProfile profile = mentorProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor", "id", id));
        profile.setVerificationStatus(VerificationStatus.REJECTED);
        mentorProfileRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public MentorStatsDto getMentorStats(Long mentorId) {
        MentorProfile profile = mentorProfileRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor", "id", mentorId));

        BigDecimal earnings = bookingRepository.calculateTotalEarningsByMentorId(mentorId);
        long completed = bookingRepository.countByMentorIdAndStatus(mentorId, BookingStatus.COMPLETED);
        long upcoming = bookingRepository.countByMentorIdAndStatus(mentorId, BookingStatus.UPCOMING);
        double rating = profile.getRating() != null ? profile.getRating().doubleValue() : 5.0;

        return new MentorStatsDto(earnings, completed, rating, upcoming);
    }

    private MentorCardDto enrichMentorCard(MentorProfile profile) {
        MentorCardDto dto = MentorCardDto.fromEntity(profile);
        List<PackageDto> packages = packageRepository.findByMentorIdAndIsActiveTrue(profile.getId())
                .stream()
                .map(PackageDto::fromEntity)
                .toList();
        dto.setPackages(packages);
        return dto;
    }
}
