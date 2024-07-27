package com.example.casa.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.casa.Model.Mail;
import com.example.casa.Model.Organization;
import com.example.casa.Model.User;
import com.example.casa.Repository.MailTemplateRepository;
import com.example.casa.Repository.OrganizationRepository;
import com.example.casa.Repository.UserRepository;
import com.example.casa.Service.MailTemplateService;

@RestController
public class MailController{

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private OrganizationRepository organizationRepository;

	@Autowired
	private MailTemplateRepository mailTemplateRepository;

	@Autowired
	private MailTemplateService mailTemplateService;

	@GetMapping("/mailService/{orgId}")
	public List<Mail> getAllTemplates(){
		return mailTemplateService.getAllTemplates();
	}

	@GetMapping("/mailService/{orgId}/mailId/userId?={userId}")
	public ResponseEntity<Mail> getMailTemplates(@PathVariable String orgId,
			@PathVariable String userId, @PathVariable String mailId){
		
		// Verify organization exists
		Organization organization = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));

		// Verify user exists
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

		Mail template = mailTemplateService.getTemplateById(mailId);
		return ResponseEntity.ok(template);
	}

	@PostMapping("/mailService/{orgId}/mailId/userId?={userId}")
	public Mail createTemplate(@RequestBody Mail template, @PathVariable String orgId,
		@PathVariable String userId){

		// Verify organization exists
		Organization organization = organizationRepository.findById(orgId)
			.orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));

		// Verify user exists
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

		return mailTemplateService.createTemplate(template);
	}

	@PutMapping("/mailService/{orgId}/{mailId}/userId?={userId}")
	public Mail createTemplate(@PathVariable String mailId, @PathVariable String orgId,
		@PathVariable String userId, @RequestBody Mail templateDetails){
		
		// Verify organization exists
		Organization organization = organizationRepository.findById(orgId)
			.orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));

		// Verify user exists
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
		
		//Verify mail exists
		Mail mail = mailTemplateRepository.findById(mailId)
			.orElseThrow(() -> new RuntimeException("Mail not found with id: "+ mailId));

		return mailTemplateService.updateTemplate(mailId, templateDetails);
	}

	@DeleteMapping("/mailService/{orgId}/{mailId}/userId?={userId}")
	public ResponseEntity<Void> deleteTemplate(@PathVariable String mailId,
		@PathVariable String orgId, @PathVariable String userId){
		
			// Verify organization exists
			Organization organization = organizationRepository.findById(orgId)
				.orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));
	
			// Verify user exists
			User user = userRepository.findById(userId)
					.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
			
			//Verify mail exists
			Mail mail = mailTemplateRepository.findById(mailId)
				.orElseThrow(() -> new RuntimeException("Mail not found with id: "+ mailId));

			mailTemplateService.deleteTemplate(mailId);
			return ResponseEntity.noContent().build();
	}
}