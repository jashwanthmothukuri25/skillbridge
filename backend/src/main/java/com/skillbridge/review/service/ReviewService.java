package com.skillbridge.review.service;

import com.skillbridge.booking.entity.Booking;
import com.skillbridge.booking.repository.BookingRepository;
import com.skillbridge.common.exception.BadRequestException;
import com.skillbridge.common.exception.ConflictException;
import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.exception.UnauthorizedException;
import com.skillbridge.mentor.entity.MentorProfile;
import com.skillbridge.mentor.repository.MentorProfileRepository;
import com.skillbridge.review.dto.CreateReviewRequest;
import com.skillbridge.review.dto.ReviewDto;
import com.skillbridge.review.entity.Review;
import com.skillbridge.review.repository.ReviewRepository;
import com.skillbridge.user.entity.User;
import com.skillbridge.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final MentorProfileRepository mentorProfileRepository;
    private final UserRepository userRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            BookingRepository bookingRepository,
            MentorProfileRepository mentorProfileRepository,
            UserRepository userRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.mentorProfileRepository = mentorProfileRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsByMentorId(Long mentorId) {
        return reviewRepository.findByMentorIdOrderByCreatedAtDesc(mentorId).stream()
                .map(ReviewDto::fromEntity)
                .toList();
    }

    @Transactional
    public ReviewDto submitReview(Long studentId, CreateReviewRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.getBookingId()));

        if (!booking.getStudent().getId().equals(studentId)) {
            throw new UnauthorizedException("You can only submit reviews for sessions you attended.");
        }

        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new ConflictException("You have already reviewed this mentorship session.");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentId));

        MentorProfile mentor = booking.getMentor();

        Review review = new Review(
                booking,
                student,
                mentor,
                request.getRating(),
                request.getComment()
        );

        Review saved = reviewRepository.save(review);

        // Recalculate average rating & review count for mentor
        Double avgRating = reviewRepository.calculateAverageRatingByMentorId(mentor.getId());
        long count = reviewRepository.countByMentorId(mentor.getId());

        if (avgRating != null) {
            mentor.setRating(BigDecimal.valueOf(avgRating).setScale(2, RoundingMode.HALF_UP));
        }
        mentor.setReviewCount((int) count);
        mentorProfileRepository.save(mentor);

        return ReviewDto.fromEntity(saved);
    }
}
