package com.example.casa.Exception;

import org.springframework.security.core.AuthenticationException;

public class OAuth2AuthenticationProcessingException extends AuthenticationException {

	public OAuth2AuthenticationProcessingException(String message) {
		super(message);
	}

	public OAuth2AuthenticationProcessingException(String message, Throwable cause) {
		super(message, cause);
	}
}
