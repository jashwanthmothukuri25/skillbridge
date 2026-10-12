package com.skillbridge.review.controller;

import com.skillbridge.common.response.ApiResponse;
import com.skillbridge.review.dto.CreateReviewRequest;
import com.skillbridge.review.dto.ReviewDto;
import com.skillbridge.review.service.ReviewService;
import com.skillbridge.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/api/mentors/{mentorId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getMentorReviews(@PathVariable Long mentorId) {
        List<ReviewDto> reviews = reviewService.getReviewsByMentorId(mentorId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @PostMapping("/api/reviews")
    public ResponseEntity<ApiResponse<ReviewDto>> submitReview(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        ReviewDto review = reviewService.submitReview(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", review));
    }
}
