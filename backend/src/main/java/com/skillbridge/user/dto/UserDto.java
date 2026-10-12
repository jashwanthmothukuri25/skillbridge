package com.skillbridge.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.skillbridge.user.entity.Role;
import com.skillbridge.user.entity.User;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto {

    private String id;
    private String name;
    private String email;
    private Role role;
    private String avatar;
    private String title;
    private String company;
    private String college;
    private String department;
    private String year;
    private String phone;

    public UserDto() {}

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        UserDto dto = new UserDto();
        dto.setId(String.valueOf(user.getId()));
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setAvatar(user.getAvatarUrl());
        dto.setPhone(user.getPhone());

        if (user.getStudentProfile() != null) {
            dto.setCollege(user.getStudentProfile().getCollege());
            dto.setDepartment(user.getStudentProfile().getDepartment());
            dto.setYear(user.getStudentProfile().getAcademicYear());
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
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

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
