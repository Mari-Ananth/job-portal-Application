package com.jobportal.backend.service;

import com.jobportal.backend.dto.EmployerProfileDTO;
import com.jobportal.backend.dto.JobResponseDTO;
import com.jobportal.backend.dto.UserDTO;
import com.jobportal.backend.entity.Role;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.EmployerProfileRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.JobSeekerProfileRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public AdminService(
            UserRepository userRepository,
            EmployerProfileRepository employerProfileRepository,
            JobSeekerProfileRepository jobSeekerProfileRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository
    ) {
        this.userRepository = userRepository;
        this.employerProfileRepository = employerProfileRepository;
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(UserDTO::new).collect(Collectors.toList());
    }

    public List<EmployerProfileDTO> getAllEmployers() {
        return employerProfileRepository.findAll().stream().map(EmployerProfileDTO::new).collect(Collectors.toList());
    }

    public List<JobResponseDTO> getAllJobs() {
        return jobRepository.findAll().stream().map(JobResponseDTO::new).collect(Collectors.toList());
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();
        
        long seekersCount = userRepository.findAll().stream().filter(u -> u.getRole() == Role.JOB_SEEKER).count();
        long employersCount = userRepository.findAll().stream().filter(u -> u.getRole() == Role.EMPLOYER).count();
        long adminsCount = userRepository.findAll().stream().filter(u -> u.getRole() == Role.ADMIN).count();
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalJobs", totalJobs);
        stats.put("totalApplications", totalApplications);
        stats.put("totalJobSeekers", seekersCount);
        stats.put("totalEmployers", employersCount);
        stats.put("totalAdmins", adminsCount);
        
        // Count applications by status
        Map<String, Long> statusCounts = new HashMap<>();
        for (com.jobportal.backend.entity.ApplicationStatus status : com.jobportal.backend.entity.ApplicationStatus.values()) {
            statusCounts.put(status.name(), 0L);
        }
        for (com.jobportal.backend.entity.Application app : applicationRepository.findAll()) {
            String statusName = app.getStatus().name();
            statusCounts.put(statusName, statusCounts.getOrDefault(statusName, 0L) + 1);
        }
        stats.put("applicationStatusCounts", statusCounts);
        
        return stats;
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        
        if (user.getRole() == Role.JOB_SEEKER) {
            java.util.Optional<com.jobportal.backend.entity.JobSeekerProfile> seekerOpt = jobSeekerProfileRepository.findByUserId(id);
            if (seekerOpt.isPresent()) {
                com.jobportal.backend.entity.JobSeekerProfile seeker = seekerOpt.get();
                // delete applications first
                List<com.jobportal.backend.entity.Application> apps = applicationRepository.findByJobSeekerId(seeker.getId());
                applicationRepository.deleteAll(apps);
                // delete profile
                jobSeekerProfileRepository.delete(seeker);
            }
        } else if (user.getRole() == Role.EMPLOYER) {
            java.util.Optional<com.jobportal.backend.entity.EmployerProfile> employerOpt = employerProfileRepository.findByUserId(id);
            if (employerOpt.isPresent()) {
                com.jobportal.backend.entity.EmployerProfile employer = employerOpt.get();
                // find all jobs posted by this employer
                List<com.jobportal.backend.entity.Job> jobs = jobRepository.findByEmployerId(employer.getId());
                for (com.jobportal.backend.entity.Job job : jobs) {
                    // delete applications for this job first
                    List<com.jobportal.backend.entity.Application> apps = applicationRepository.findByJobId(job.getId());
                    applicationRepository.deleteAll(apps);
                }
                // delete jobs
                jobRepository.deleteAll(jobs);
                // delete profile
                employerProfileRepository.delete(employer);
            }
        }
        
        userRepository.delete(user);
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with ID: " + id);
        }
        // delete applications for this job first
        List<com.jobportal.backend.entity.Application> apps = applicationRepository.findByJobId(id);
        applicationRepository.deleteAll(apps);
        
        jobRepository.deleteById(id);
    }
}
