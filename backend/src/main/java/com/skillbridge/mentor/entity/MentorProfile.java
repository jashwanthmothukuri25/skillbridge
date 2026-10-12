package com.skillbridge.mentor.entity;

import com.skillbridge.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.domain.Persistable;

@Entity
@Table(name = "mentor_profiles")
public class MentorProfile implements Persistable<Long> {

    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", insertable = false, updatable = false)
    private User user;

    @Transient
    private boolean isNew = true;

    @Column(length = 120)
    private String title;

    @Column(length = 120)
    private String company;

    @Column(name = "experience_years", nullable = false)
    private Integer experienceYears = 0;

    @Column(name = "hourly_rate_inr", nullable = false, precision = 10, scale = 2)
    private BigDecimal hourlyRateInr = BigDecimal.ZERO;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal rating = new BigDecimal("5.00");

    @Column(name = "review_count", nullable = false)
    private Integer reviewCount = 0;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String about;

    @Column(length = 255)
    private String languages = "English";

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 20)
    private VerificationStatus verificationStatus = VerificationStatus.APPROVED;

    @Column(name = "work_id_verified", nullable = false)
    private Boolean workIdVerified = true;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "mentor_skills",
        joinColumns = @JoinColumn(name = "mentor_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills = new HashSet<>();

    public MentorProfile() {}

    public MentorProfile(User user, String title, String company, Integer experienceYears, BigDecimal hourlyRateInr) {
        this.user = user;
        this.id = user != null ? user.getId() : null;
        this.title = title;
        this.company = company;
        this.experienceYears = experienceYears;
        this.hourlyRateInr = hourlyRateInr;
        this.verificationStatus = VerificationStatus.APPROVED;
        this.workIdVerified = true;
        this.isNew = true;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    @PostPersist
    @PostLoad
    public void markNotNew() {
        this.isNew = false;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        if (user != null) {
            this.id = user.getId();
        }
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

    public BigDecimal getHourlyRateInr() {
        return hourlyRateInr;
    }

    public void setHourlyRateInr(BigDecimal hourlyRateInr) {
        this.hourlyRateInr = hourlyRateInr;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
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

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public Boolean getWorkIdVerified() {
        return workIdVerified;
    }

    public void setWorkIdVerified(Boolean workIdVerified) {
        this.workIdVerified = workIdVerified;
    }

    public Set<Skill> getSkills() {
        return skills;
    }

    public void setSkills(Set<Skill> skills) {
        this.skills = skills;
    }
}
