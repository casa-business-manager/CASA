package com.example.casa.Security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import jakarta.servlet.http.HttpServletResponse;

public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

	private static final Logger logger = LoggerFactory.getLogger(RestAuthenticationEntryPoint.class);

	@Override
	public void commence(jakarta.servlet.http.HttpServletRequest request,
			jakarta.servlet.http.HttpServletResponse response, AuthenticationException authException)
			throws IOException, jakarta.servlet.ServletException {
		logger.error("Responding with unauthorized error. Message - {}", authException.getMessage());
		response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getLocalizedMessage());
	}
}
