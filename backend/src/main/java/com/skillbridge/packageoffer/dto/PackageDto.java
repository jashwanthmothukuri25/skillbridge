package com.skillbridge.packageoffer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.skillbridge.packageoffer.entity.MentorshipPackage;

import java.math.BigDecimal;
import java.util.List;

public class PackageDto {

    private String id;
    private String mentorId;
    private String title;
    private String description;
    private Integer durationMinutes;
    private BigDecimal priceInr;
    private Integer sessionsCount;
    private List<String> topics;
    private List<String> deliverables;
    private Boolean isActive;

    public PackageDto() {}

    public static PackageDto fromEntity(MentorshipPackage pkg) {
        if (pkg == null) return null;
        PackageDto dto = new PackageDto();
        dto.setId(String.valueOf(pkg.getId()));
        if (pkg.getMentor() != null) {
            dto.setMentorId(String.valueOf(pkg.getMentor().getId()));
        }
        dto.setTitle(pkg.getTitle());
        dto.setDescription(pkg.getDescription());
        dto.setDurationMinutes(pkg.getDurationMinutes());
        dto.setPriceInr(pkg.getPriceInr());
        dto.setSessionsCount(pkg.getSessionsCount());
        dto.setTopics(pkg.getTopics());
        dto.setDeliverables(pkg.getDeliverables());
        dto.setIsActive(pkg.getIsActive());
        return dto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMentorId() {
        return mentorId;
    }

    public void setMentorId(String mentorId) {
        this.mentorId = mentorId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public BigDecimal getPriceInr() {
        return priceInr;
    }

    public void setPriceInr(BigDecimal priceInr) {
        this.priceInr = priceInr;
    }

    // Property alias for priceINR so both priceInr and priceINR are serialized to JSON!
    @JsonProperty("priceINR")
    public BigDecimal getPriceINR() {
        return priceInr;
    }

    public Integer getSessionsCount() {
        return sessionsCount;
    }

    public void setSessionsCount(Integer sessionsCount) {
        this.sessionsCount = sessionsCount;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public List<String> getDeliverables() {
        return deliverables;
    }

    public void setDeliverables(List<String> deliverables) {
        this.deliverables = deliverables;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
