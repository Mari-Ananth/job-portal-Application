package com.jobportal.backend.dto;

import com.jobportal.backend.entity.EmployerProfile;

public class EmployerProfileDTO {
    private Long id;
    private String companyName;
    private String description;
    private String website;
    private String location;
    private String logoPath;
    private String fullName;
    private String email;

    public EmployerProfileDTO() {}

    public EmployerProfileDTO(EmployerProfile profile) {
        this.id = profile.getId();
        this.companyName = profile.getCompanyName();
        this.description = profile.getDescription();
        this.website = profile.getWebsite();
        this.location = profile.getLocation();
        this.logoPath = profile.getLogoPath();
        if (profile.getUser() != null) {
            this.fullName = profile.getUser().getFullName();
            this.email = profile.getUser().getEmail();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLogoPath() {
        return logoPath;
    }

    public void setLogoPath(String logoPath) {
        this.logoPath = logoPath;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
