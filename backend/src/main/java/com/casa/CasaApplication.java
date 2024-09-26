package com.casa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.casa.Config.AppProperties;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@EntityScan("com.casa.Model")
@EnableJpaRepositories("com.casa.Repository")
@EnableConfigurationProperties(AppProperties.class)
@Slf4j
public class CasaApplication {

	public static void main(String[] args) {
		SpringApplication.run(CasaApplication.class, args);
	}

}
