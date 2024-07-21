package com.example.casa.Service;

import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.example.casa.Payload.EmailDetails;
import com.example.casa.Repository.UserRepository;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("$(spring.mail.username)")
    private String emailSender;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    private Logger logger;

    public void sendEmail(EmailDetails emailDetails){
        try {
            SimpleMailMessage mailMsg = new SimpleMailMessage();
            mailMsg.setFrom(emailDetails.getSenderEmail());
            mailMsg.setTo(emailDetails.getRecipientEmail());
            mailMsg.setSubject(emailDetails.getSubject());
            mailMsg.setText(emailDetails.getMessageBody());
        } catch (MailException e) {
            logger.info(emailSender);
        }
    }
    
    public void sendEmailMessageWithAttachment(EmailDetails emailDetails) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage(); 
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(emailSender);
            helper.setTo(emailDetails.getRecipientEmail());
            helper.setSubject(emailDetails.getSubject());
            helper.setText(emailDetails.getMessageBody(), true); 

            // Add attachment if present
            if (emailDetails.getAttachment() != null) {
                helper.addAttachment(emailDetails.getAttachment().getOriginalFilename(), emailDetails.getAttachment());
            }

            javaMailSender.send(message); 
            logger.info("Email with attachment sent successfully to " + emailDetails.getRecipientEmail());
        } catch (Exception e) {
            logger.severe("Error sending email with attachment: " + e.getMessage());
        }
    }
}

