package com.skillbridge.user.entity;

import jakarta.persistence.*;
import org.springframework.data.domain.Persistable;

@Entity
@Table(name = "student_profiles")
public class StudentProfile implements Persistable<Long> {

    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", insertable = false, updatable = false)
    private User user;

    @Column(length = 150)
    private String college;

    @Column(length = 100)
    private String department;

    @Column(name = "academic_year", length = 50)
    private String academicYear;

    @Transient
    private boolean isNew = true;

    public StudentProfile() {}

    public StudentProfile(User user, String college, String department, String academicYear) {
        this.user = user;
        this.id = user != null ? user.getId() : null;
        this.college = college;
        this.department = department;
        this.academicYear = academicYear;
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

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }
}
