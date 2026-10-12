package com.skillbridge.review.dto;

import com.skillbridge.review.entity.Review;

import java.time.LocalDateTime;

public class ReviewDto {

    private String id;
    private String studentName;
    private String studentRole;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewDto() {}

    public static ReviewDto fromEntity(Review review) {
        if (review == null) return null;
        ReviewDto dto = new ReviewDto();
        dto.setId(String.valueOf(review.getId()));
        if (review.getStudent() != null) {
            dto.setStudentName(review.getStudent().getName());
            if (review.getStudent().getStudentProfile() != null) {
                dto.setStudentRole(review.getStudent().getStudentProfile().getDepartment());
            } else {
                dto.setStudentRole("Engineering Student");
            }
        }
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentRole() {
        return studentRole;
    }

    public void setStudentRole(String studentRole) {
        this.studentRole = studentRole;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
