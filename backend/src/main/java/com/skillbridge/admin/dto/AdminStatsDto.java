package com.skillbridge.admin.dto;

import java.math.BigDecimal;

public class AdminStatsDto {

    private Long pendingApprovals;
    private Long activeMentors;
    private Long totalBookings;
    private BigDecimal platformVolumeInr;

    public AdminStatsDto() {}

    public AdminStatsDto(Long pendingApprovals, Long activeMentors, Long totalBookings, BigDecimal platformVolumeInr) {
        this.pendingApprovals = pendingApprovals;
        this.activeMentors = activeMentors;
        this.totalBookings = totalBookings;
        this.platformVolumeInr = platformVolumeInr;
    }

    public Long getPendingApprovals() {
        return pendingApprovals;
    }

    public void setPendingApprovals(Long pendingApprovals) {
        this.pendingApprovals = pendingApprovals;
    }

    public Long getActiveMentors() {
        return activeMentors;
    }

    public void setActiveMentors(Long activeMentors) {
        this.activeMentors = activeMentors;
    }

    public Long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public BigDecimal getPlatformVolumeInr() {
        return platformVolumeInr;
    }

    public void setPlatformVolumeInr(BigDecimal platformVolumeInr) {
        this.platformVolumeInr = platformVolumeInr;
    }
}
