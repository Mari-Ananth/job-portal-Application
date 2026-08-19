package com.jobportal.backend.controller;

import com.jobportal.backend.dto.EmployerProfileDTO;
import com.jobportal.backend.dto.JobSeekerProfileDTO;
import com.jobportal.backend.service.FileStorageService;
import com.jobportal.backend.service.ProfileService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.security.Principal;

@RestController
@RequestMapping("/api")
public class ProfileController {

    private final ProfileService profileService;
    private final FileStorageService fileStorageService;

    public ProfileController(ProfileService profileService, FileStorageService fileStorageService) {
        this.profileService = profileService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/seeker/profile")
    public ResponseEntity<JobSeekerProfileDTO> getSeekerProfile(Principal principal) {
        return ResponseEntity.ok(profileService.getSeekerProfile(principal.getName()));
    }

    @PutMapping("/seeker/profile")
    public ResponseEntity<JobSeekerProfileDTO> updateSeekerProfile(
            @RequestBody JobSeekerProfileDTO request,
            Principal principal
    ) {
        return ResponseEntity.ok(profileService.updateSeekerProfile(request, principal.getName()));
    }

    @PostMapping("/seeker/resume")
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file,
            Principal principal
    ) {
        String fileName = profileService.updateSeekerResume(file, principal.getName());
        return ResponseEntity.ok(fileName);
    }

    @GetMapping("/employer/profile")
    public ResponseEntity<EmployerProfileDTO> getEmployerProfile(Principal principal) {
        return ResponseEntity.ok(profileService.getEmployerProfile(principal.getName()));
    }

    @PutMapping("/employer/profile")
    public ResponseEntity<EmployerProfileDTO> updateEmployerProfile(
            @RequestBody EmployerProfileDTO request,
            Principal principal
    ) {
        return ResponseEntity.ok(profileService.updateEmployerProfile(request, principal.getName()));
    }

    @PostMapping("/employer/logo")
    public ResponseEntity<String> uploadLogo(
            @RequestParam("file") MultipartFile file,
            Principal principal
    ) {
        String fileName = profileService.updateEmployerLogo(file, principal.getName());
        return ResponseEntity.ok(fileName);
    }

    @GetMapping("/files/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        try {
            Path filePath = fileStorageService.loadFile(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = "application/octet-stream";
                try {
                    contentType = resource.getURL().openConnection().getContentType();
                } catch (IOException ex) {
                    
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
