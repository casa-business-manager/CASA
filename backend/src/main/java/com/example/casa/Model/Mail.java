package com.example.casa.Model;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="MailTemplates")
public class Mail {
	@Id
	@GeneratedValue(generator = "UUID")
	@GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
	@Column(name = "uuid", updatable = false, unique = true, nullable = false)
	private String mailTemplateId;

	private String name;
	private String subject;
	private String body;

	public String getName(){
		return name;
	}

	public void setName(String name){
		this.name=name;
	}

	public String getSubject(){
		return subject;
	}

	public void setSubject(String subject){
		this.subject=subject;
	}

	public String getBody(){
		return body;
	}

	public void setBody(String body){
		this.body=body;
	}
}
