package com.example.casa.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.casa.Payload.EmailDetails;


@Configuration
public class EmailConfig {
    
    @Bean
    public EmailDetails EmailDetails(){
        return new EmailDetails();
    }
}
