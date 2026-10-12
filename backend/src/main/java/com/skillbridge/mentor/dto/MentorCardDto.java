package com.skillbridge.mentor.dto;

import com.skillbridge.mentor.entity.MentorProfile;
import com.skillbridge.mentor.entity.Skill;
import com.skillbridge.packageoffer.dto.PackageDto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MentorCardDto {

    private String id;
    private String name;
    private String title;
    private String company;
    private Integer experienceYears;
    private Double rating;
    private Integer reviewCount;
    private BigDecimal hourlyRateInr;
    private String avatar;
    private String bio;
    private String about;
    private List<String> skills = new ArrayList<>();
    private List<String> languages = new ArrayList<>();
    private String nextAvailableSlot = "Tomorrow, 7:00 PM";
    private List<PackageDto> packages = new ArrayList<>();

    public MentorCardDto() {}

    public static MentorCardDto fromEntity(MentorProfile profile) {
        if (profile == null) return null;
        MentorCardDto dto = new MentorCardDto();
        dto.setId(String.valueOf(profile.getId()));
        if (profile.getUser() != null) {
            dto.setName(profile.getUser().getName());
            dto.setAvatar(profile.getUser().getAvatarUrl());
        }
        dto.setTitle(profile.getTitle());
        dto.setCompany(profile.getCompany());
        dto.setExperienceYears(profile.getExperienceYears());
        dto.setRating(profile.getRating() != null ? profile.getRating().doubleValue() : 5.0);
        dto.setReviewCount(profile.getReviewCount());
        dto.setHourlyRateInr(profile.getHourlyRateInr());
        dto.setBio(profile.getBio());
        dto.setAbout(profile.getAbout());

        if (profile.getSkills() != null) {
            dto.setSkills(profile.getSkills().stream().map(Skill::getName).toList());
        }

        if (profile.getLanguages() != null && !profile.getLanguages().trim().isEmpty()) {
            dto.setLanguages(Arrays.stream(profile.getLanguages().split(","))
                    .map(String::trim).filter(s -> !s.isEmpty()).toList());
        }

        return dto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public BigDecimal getHourlyRateInr() {
        return hourlyRateInr;
    }

    public void setHourlyRateInr(BigDecimal hourlyRateInr) {
        this.hourlyRateInr = hourlyRateInr;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<String> getLanguages() {
        return languages;
    }

    public void setLanguages(List<String> languages) {
        this.languages = languages;
    }

    public String getNextAvailableSlot() {
        return nextAvailableSlot;
    }

    public void setNextAvailableSlot(String nextAvailableSlot) {
        this.nextAvailableSlot = nextAvailableSlot;
    }

    public List<PackageDto> getPackages() {
        return packages;
    }

    public void setPackages(List<PackageDto> packages) {
        this.packages = packages;
    }
}
