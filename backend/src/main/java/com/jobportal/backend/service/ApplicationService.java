package com.jobportal.backend.service;

import com.jobportal.backend.dto.ApplicationResponseDTO;
import com.jobportal.backend.entity.*;
import com.jobportal.backend.exception.BadRequestException;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final UserRepository userRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            JobSeekerProfileRepository jobSeekerProfileRepository,
            EmployerProfileRepository employerProfileRepository,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
        this.employerProfileRepository = employerProfileRepository;
        this.userRepository = userRepository;
    }

    private JobSeekerProfile getSeekerProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return jobSeekerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job seeker profile not found"));
    }

    private EmployerProfile getEmployerProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return employerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));
    }

    @Transactional
    public ApplicationResponseDTO applyForJob(Long jobId, String seekerEmail) {
        JobSeekerProfile seeker = getSeekerProfileByEmail(seekerEmail);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        // Prevent duplicate applications
        if (applicationRepository.existsByJobIdAndJobSeekerId(jobId, seeker.getId())) {
            throw new BadRequestException("You have already applied for this job");
        }

        // Seeker must have uploaded a resume
        if (seeker.getResumePath() == null || seeker.getResumePath().isBlank()) {
            throw new BadRequestException("Please upload a resume first before applying");
        }

        Application application = new Application(job, seeker, seeker.getResumePath());
        Application savedApp = applicationRepository.save(application);
        return new ApplicationResponseDTO(savedApp);
    }

    public List<ApplicationResponseDTO> getSeekerApplications(String seekerEmail) {
        JobSeekerProfile seeker = getSeekerProfileByEmail(seekerEmail);
        List<Application> apps = applicationRepository.findByJobSeekerId(seeker.getId());
        return apps.stream().map(ApplicationResponseDTO::new).collect(Collectors.toList());
    }

    public List<ApplicationResponseDTO> getEmployerApplications(Long jobId, String employerEmail) {
        EmployerProfile employer = getEmployerProfileByEmail(employerEmail);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        if (!job.getEmployer().getId().equals(employer.getId())) {
            throw new BadRequestException("You do not have permission to view applicants for this job");
        }

        List<Application> apps = applicationRepository.findByJobId(jobId);
        return apps.stream().map(ApplicationResponseDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponseDTO updateApplicationStatus(Long id, ApplicationStatus status, String employerEmail) {
        EmployerProfile employer = getEmployerProfileByEmail(employerEmail);
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));

        if (!application.getJob().getEmployer().getId().equals(employer.getId())) {
            throw new BadRequestException("You do not have permission to modify this application");
        }

        application.setStatus(status);
        Application updated = applicationRepository.save(application);
        return new ApplicationResponseDTO(updated);
    }
}
