package com.jobportal.backend.service;

import com.jobportal.backend.dto.EmployerProfileDTO;
import com.jobportal.backend.dto.JobSeekerProfileDTO;
import com.jobportal.backend.entity.EmployerProfile;
import com.jobportal.backend.entity.JobSeekerProfile;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.repository.EmployerProfileRepository;
import com.jobportal.backend.repository.JobSeekerProfileRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final FileStorageService fileStorageService;

    public ProfileService(
            UserRepository userRepository,
            JobSeekerProfileRepository jobSeekerProfileRepository,
            EmployerProfileRepository employerProfileRepository,
            FileStorageService fileStorageService
    ) {
        this.userRepository = userRepository;
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
        this.employerProfileRepository = employerProfileRepository;
        this.fileStorageService = fileStorageService;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public JobSeekerProfileDTO getSeekerProfile(String email) {
        User user = getUserByEmail(email);
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Seeker profile not found"));
        return new JobSeekerProfileDTO(profile);
    }

    @Transactional
    public JobSeekerProfileDTO updateSeekerProfile(JobSeekerProfileDTO request, String email) {
        User user = getUserByEmail(email);
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Seeker profile not found"));

        profile.setBio(request.getBio());
        profile.setSkills(request.getSkills());
        profile.setExperience(request.getExperience());
        profile.setEducation(request.getEducation());

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
            userRepository.save(user);
        }

        JobSeekerProfile updated = jobSeekerProfileRepository.save(profile);
        return new JobSeekerProfileDTO(updated);
    }

    @Transactional
    public String updateSeekerResume(MultipartFile file, String email) {
        User user = getUserByEmail(email);
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Seeker profile not found"));

        String fileName = fileStorageService.storeFile(file);
        profile.setResumePath(fileName);
        jobSeekerProfileRepository.save(profile);
        return fileName;
    }

    public EmployerProfileDTO getEmployerProfile(String email) {
        User user = getUserByEmail(email);
        EmployerProfile profile = employerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));
        return new EmployerProfileDTO(profile);
    }

    @Transactional
    public EmployerProfileDTO updateEmployerProfile(EmployerProfileDTO request, String email) {
        User user = getUserByEmail(email);
        EmployerProfile profile = employerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        profile.setCompanyName(request.getCompanyName());
        profile.setDescription(request.getDescription());
        profile.setWebsite(request.getWebsite());
        profile.setLocation(request.getLocation());

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
            userRepository.save(user);
        }

        EmployerProfile updated = employerProfileRepository.save(profile);
        return new EmployerProfileDTO(updated);
    }

    @Transactional
    public String updateEmployerLogo(MultipartFile file, String email) {
        User user = getUserByEmail(email);
        EmployerProfile profile = employerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        String fileName = fileStorageService.storeFile(file);
        profile.setLogoPath(fileName);
        employerProfileRepository.save(profile);
        return fileName;
    }
}
