package com.example.casa.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.casa.Model.Mail;

public interface MailTemplateRepository extends JpaRepository<Mail, String> {
	Optional<Mail> findByName(String name);
}