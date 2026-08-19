package com.jobportal.backend.dto;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.ApplicationStatus;
import java.time.LocalDateTime;

public class ApplicationResponseDTO {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private Long seekerId;
    private String seekerName;
    private String seekerEmail;
    private ApplicationStatus status;
    private String resumePath;
    private LocalDateTime appliedAt;

    public ApplicationResponseDTO() {}

    public ApplicationResponseDTO(Application app) {
        this.id = app.getId();
        if (app.getJob() != null) {
            this.jobId = app.getJob().getId();
            this.jobTitle = app.getJob().getTitle();
            if (app.getJob().getEmployer() != null) {
                this.companyName = app.getJob().getEmployer().getCompanyName();
            }
        }
        if (app.getJobSeeker() != null) {
            this.seekerId = app.getJobSeeker().getId();
            if (app.getJobSeeker().getUser() != null) {
                this.seekerName = app.getJobSeeker().getUser().getFullName();
                this.seekerEmail = app.getJobSeeker().getUser().getEmail();
            }
        }
        this.status = app.getStatus();
        this.resumePath = app.getResumePath();
        this.appliedAt = app.getAppliedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Long getSeekerId() {
        return seekerId;
    }

    public void setSeekerId(Long seekerId) {
        this.seekerId = seekerId;
    }

    public String getSeekerName() {
        return seekerName;
    }

    public void setSeekerName(String seekerName) {
        this.seekerName = seekerName;
    }

    public String getSeekerEmail() {
        return seekerEmail;
    }

    public void setSeekerEmail(String seekerEmail) {
        this.seekerEmail = seekerEmail;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getResumePath() {
        return resumePath;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }
}
