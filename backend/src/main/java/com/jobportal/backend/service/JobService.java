package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobRequestDTO;
import com.jobportal.backend.dto.JobResponseDTO;
import com.jobportal.backend.entity.EmployerProfile;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.BadRequestException;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.repository.EmployerProfileRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final UserRepository userRepository;

    public JobService(
            JobRepository jobRepository,
            EmployerProfileRepository employerProfileRepository,
            UserRepository userRepository
    ) {
        this.jobRepository = jobRepository;
        this.employerProfileRepository = employerProfileRepository;
        this.userRepository = userRepository;
    }

    private EmployerProfile getEmployerProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return employerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found for user: " + user.getFullName()));
    }

    @Transactional
    public JobResponseDTO createJob(JobRequestDTO request, String employerEmail) {
        EmployerProfile employer = getEmployerProfileByEmail(employerEmail);

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setSkillsRequired(request.getSkillsRequired());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setSalary(request.getSalary());
        job.setEmployer(employer);

        Job savedJob = jobRepository.save(job);
        return new JobResponseDTO(savedJob);
    }

    public List<JobResponseDTO> getAllJobs(
            String keyword,
            String location,
            String jobType,
            String experienceLevel,
            Double minSalary
    ) {
        List<Job> jobs = jobRepository.searchJobs(keyword, location, jobType, experienceLevel, minSalary);
        return jobs.stream().map(JobResponseDTO::new).collect(Collectors.toList());
    }

    public JobResponseDTO getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));
        return new JobResponseDTO(job);
    }

    @Transactional
    public JobResponseDTO updateJob(Long id, JobRequestDTO request, String employerEmail) {
        EmployerProfile employer = getEmployerProfileByEmail(employerEmail);
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));

        if (!job.getEmployer().getId().equals(employer.getId())) {
            throw new BadRequestException("You do not have permission to update this job");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setSkillsRequired(request.getSkillsRequired());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setSalary(request.getSalary());

        Job updatedJob = jobRepository.save(job);
        return new JobResponseDTO(updatedJob);
    }

    @Transactional
    public void deleteJob(Long id, String employerEmail) {
        EmployerProfile employer = getEmployerProfileByEmail(employerEmail);
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));

        if (!job.getEmployer().getId().equals(employer.getId())) {
            throw new BadRequestException("You do not have permission to delete this job");
        }

        jobRepository.delete(job);
    }

    public List<JobResponseDTO> getEmployerJobs(String employerEmail) {
        EmployerProfile employer = getEmployerProfileByEmail(employerEmail);
        List<Job> jobs = jobRepository.findByEmployerId(employer.getId());
        return jobs.stream().map(JobResponseDTO::new).collect(Collectors.toList());
    }
}
