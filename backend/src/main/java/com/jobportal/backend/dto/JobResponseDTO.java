package com.jobportal.backend.dto;

import com.jobportal.backend.entity.Job;
import java.time.LocalDateTime;

public class JobResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String requirements;
    private String skillsRequired;
    private String location;
    private String jobType;
    private String experienceLevel;
    private Double salary;
    private String companyName;
    private Long employerId;
    private LocalDateTime createdAt;

    public JobResponseDTO() {}

    public JobResponseDTO(Job job) {
        this.id = job.getId();
        this.title = job.getTitle();
        this.description = job.getDescription();
        this.requirements = job.getRequirements();
        this.skillsRequired = job.getSkillsRequired();
        this.location = job.getLocation();
        this.jobType = job.getJobType();
        this.experienceLevel = job.getExperienceLevel();
        this.salary = job.getSalary();
        if (job.getEmployer() != null) {
            this.companyName = job.getEmployer().getCompanyName();
            this.employerId = job.getEmployer().getId();
        }
        this.createdAt = job.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getSkillsRequired() {
        return skillsRequired;
    }

    public void setSkillsRequired(String skillsRequired) {
        this.skillsRequired = skillsRequired;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Long getEmployerId() {
        return employerId;
    }

    public void setEmployerId(Long employerId) {
        this.employerId = employerId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
