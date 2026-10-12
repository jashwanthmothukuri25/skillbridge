package com.skillbridge.mentor.dto;

import java.math.BigDecimal;

public class MentorStatsDto {

    private BigDecimal simulatedEarnings;
    private Long completedSessions;
    private Double averageRating;
    private Long upcomingSessions;

    public MentorStatsDto() {}

    public MentorStatsDto(BigDecimal simulatedEarnings, Long completedSessions, Double averageRating, Long upcomingSessions) {
        this.simulatedEarnings = simulatedEarnings;
        this.completedSessions = completedSessions;
        this.averageRating = averageRating;
        this.upcomingSessions = upcomingSessions;
    }

    public BigDecimal getSimulatedEarnings() {
        return simulatedEarnings;
    }

    public void setSimulatedEarnings(BigDecimal simulatedEarnings) {
        this.simulatedEarnings = simulatedEarnings;
    }

    public Long getCompletedSessions() {
        return completedSessions;
    }

    public void setCompletedSessions(Long completedSessions) {
        this.completedSessions = completedSessions;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getUpcomingSessions() {
        return upcomingSessions;
    }

    public void setUpcomingSessions(Long upcomingSessions) {
        this.upcomingSessions = upcomingSessions;
    }
}
