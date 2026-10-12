package com.skillbridge.packageoffer.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class CreatePackageRequest {

    @NotBlank(message = "Package title is required")
    private String title;

    private String description;

    @NotNull(message = "Duration in minutes is required")
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    private Integer durationMinutes;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    @JsonAlias({"priceINR", "priceInr"})
    private BigDecimal priceInr;

    private Integer sessionsCount = 1;

    private List<String> topics;

    private List<String> deliverables;

    public CreatePackageRequest() {}

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
}
