package com.example.casa.Util;

import java.io.IOException;
import java.security.GeneralSecurityException;

import org.springframework.stereotype.Component;

import com.example.casa.Model.User;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.Calendar;

@Component
public class GoogleCalendarUtil {

	public Calendar getCalendarService(User user) throws IOException, GeneralSecurityException {
		Credential credential = new GoogleCredential().setAccessToken(user.getProviderId());

		return new Calendar.Builder(
				GoogleNetHttpTransport.newTrustedTransport(),
				JacksonFactory.getDefaultInstance(),
				credential)
						.setApplicationName("CASA Business Manager")
						.build();
	}
}
