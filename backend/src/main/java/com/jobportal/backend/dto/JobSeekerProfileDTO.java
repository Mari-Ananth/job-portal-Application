package com.jobportal.backend.dto;

import com.jobportal.backend.entity.JobSeekerProfile;

public class JobSeekerProfileDTO {
    private Long id;
    private String bio;
    private String skills;
    private String experience;
    private String education;
    private String resumePath;
    private String fullName;
    private String email;

    public JobSeekerProfileDTO() {}

    public JobSeekerProfileDTO(JobSeekerProfile profile) {
        this.id = profile.getId();
        this.bio = profile.getBio();
        this.skills = profile.getSkills();
        this.experience = profile.getExperience();
        this.education = profile.getEducation();
        this.resumePath = profile.getResumePath();
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

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getResumePath() {
        return resumePath;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
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
