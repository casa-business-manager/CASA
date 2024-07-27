package com.example.casa.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.casa.Model.Mail;
import com.example.casa.Repository.MailTemplateRepository;

@Service
public class MailTemplateService {
	@Autowired
	private MailTemplateRepository mailTemplateRepository;

	public List<Mail> getAllTemplates(){
		return mailTemplateRepository.findAll();
	}

	public Mail getTemplateById(String UUID){
		return mailTemplateRepository.findById(UUID)
			.orElseThrow(()-> new RuntimeException("Template was not found with id: " + UUID));
	}

	public Mail createTemplate(Mail template){
		return mailTemplateRepository.save(template);
	}

	public Mail updateTemplate(String UUID, Mail templateDetails){
		Mail template = getTemplateById(UUID);
		template.setName(templateDetails.getName());
		template.setSubject(templateDetails.getSubject());
		template.setBody(templateDetails.getBody());
		return mailTemplateRepository.save(template);
	}

	public void deleteTemplate(String UUID){
		Mail template = getTemplateById(UUID);
		mailTemplateRepository.delete(template);
	}
}
