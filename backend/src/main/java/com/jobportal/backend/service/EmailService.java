package com.jobportal.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendResetPasswordEmail(String toEmail, String resetLink) {
        System.out.println("=================================================");
        System.out.println("PASSWORD RESET EMAIL TRIGGERED:");
        System.out.println("To: " + toEmail);
        System.out.println("Reset Link: " + resetLink);
        System.out.println("=================================================");

        if (mailSender != null && mailUsername != null && !mailUsername.isEmpty()) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(mailUsername);
                message.setTo(toEmail);
                message.setSubject("Reset Your CareersHub Password");
                message.setText("Click the following link to reset your password: " + resetLink + "\n\nThis link is valid for 15 minutes.");
                mailSender.send(message);
                System.out.println("Real email successfully sent via SMTP to " + toEmail);
            } catch (Exception e) {
                System.err.println("SMTP Error sending email: " + e.getMessage() + ". Falling back to console reset link (printed above).");
            }
        } else {
            System.out.println("Real email sending skipped (SMTP not configured). Copy the reset link above to test the reset flow.");
        }
    }
}
