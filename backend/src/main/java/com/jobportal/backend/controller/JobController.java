package com.jobportal.backend.controller;

import com.jobportal.backend.dto.JobRequestDTO;
import com.jobportal.backend.dto.JobResponseDTO;
import com.jobportal.backend.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponseDTO>> getAllJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) Double minSalary
    ) {
        return ResponseEntity.ok(jobService.getAllJobs(keyword, location, jobType, experienceLevel, minSalary));
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobResponseDTO> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping("/employer/jobs")
    public ResponseEntity<JobResponseDTO> createJob(
            @Valid @RequestBody JobRequestDTO request,
            Principal principal
    ) {
        return ResponseEntity.ok(jobService.createJob(request, principal.getName()));
    }

    @PutMapping("/employer/jobs/{id}")
    public ResponseEntity<JobResponseDTO> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequestDTO request,
            Principal principal
    ) {
        return ResponseEntity.ok(jobService.updateJob(id, request, principal.getName()));
    }

    @DeleteMapping("/employer/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, Principal principal) {
        jobService.deleteJob(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/employer/jobs")
    public ResponseEntity<List<JobResponseDTO>> getEmployerJobs(Principal principal) {
        return ResponseEntity.ok(jobService.getEmployerJobs(principal.getName()));
    }
}
