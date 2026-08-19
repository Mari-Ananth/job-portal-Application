package com.jobportal.backend.config;

import com.jobportal.backend.entity.Role;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@careershub.com")) {
            User admin = new User(
                    "admin@careershub.com",
                    passwordEncoder.encode("admin123"),
                    "System Admin",
                    Role.ADMIN
            );
            userRepository.save(admin);
            System.out.println("=================================================");
            System.out.println("Default ADMIN account seeded successfully:");
            System.out.println("Email: admin@careershub.com");
            System.out.println("Password: admin123");
            System.out.println("=================================================");
        }
    }
}
