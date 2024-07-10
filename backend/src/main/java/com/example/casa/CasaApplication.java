package com.example.casa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.example.casa.Config.AppProperties;

@SpringBootApplication
@EntityScan("com.example.casa.Model")
@EnableJpaRepositories("com.example.casa.Repository")
@EnableConfigurationProperties(AppProperties.class)
public class CasaApplication {

    public static void main(String[] args) {
        SpringApplication.run(CasaApplication.class, args);
    }

}
