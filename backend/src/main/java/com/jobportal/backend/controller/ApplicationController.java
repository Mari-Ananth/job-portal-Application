package com.jobportal.backend.controller;

import com.jobportal.backend.dto.ApplicationResponseDTO;
import com.jobportal.backend.entity.ApplicationStatus;
import com.jobportal.backend.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/seeker/apply/{jobId}")
    public ResponseEntity<ApplicationResponseDTO> applyForJob(
            @PathVariable Long jobId,
            Principal principal
    ) {
        return ResponseEntity.ok(applicationService.applyForJob(jobId, principal.getName()));
    }

    @GetMapping("/seeker/applications")
    public ResponseEntity<List<ApplicationResponseDTO>> getSeekerApplications(Principal principal) {
        return ResponseEntity.ok(applicationService.getSeekerApplications(principal.getName()));
    }

    @GetMapping("/employer/jobs/{jobId}/applications")
    public ResponseEntity<List<ApplicationResponseDTO>> getEmployerApplications(
            @PathVariable Long jobId,
            Principal principal
    ) {
        return ResponseEntity.ok(applicationService.getEmployerApplications(jobId, principal.getName()));
    }

    @PutMapping("/employer/applications/{id}/status")
    public ResponseEntity<ApplicationResponseDTO> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            Principal principal
    ) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status, principal.getName()));
    }
}
