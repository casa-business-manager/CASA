package com.example.casa.API;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.parallel.Execution;
import org.junit.jupiter.api.parallel.ExecutionMode;
import org.junit.jupiter.api.parallel.Isolated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.transaction.annotation.Transactional;

import com.example.casa.Model.User;
import com.example.casa.Payload.User.AuthResponse;
import com.example.casa.Payload.User.LoginRequest;
import com.example.casa.Payload.User.SignUpRequest;
import com.example.casa.Repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional
@Execution(ExecutionMode.SAME_THREAD)
@Isolated
public class UserTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UserRepository userRepository;

	private String newUserEmail;
	private String newUserPassword;
	private String loginJson;

	@BeforeAll
	void setup() throws Exception {
		newUserEmail = "walter@white.com";
		newUserPassword = "password";

		// Signup request
		SignUpRequest signUpRequest = new SignUpRequest();
		signUpRequest.setFirstName("Walter");
		signUpRequest.setLastName("White");
		signUpRequest.setEmail(newUserEmail);
		signUpRequest.setPassword(newUserPassword);

		String signupJson = objectMapper.writeValueAsString(signUpRequest);

		// Perform signup outside of a transaction
		mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
				.contentType(MediaType.APPLICATION_JSON)
				.content(signupJson))
				.andExpect(MockMvcResultMatchers.status().isCreated());

		// Login request to get token
		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setEmail(newUserEmail);
		loginRequest.setPassword(newUserPassword);

		loginJson = objectMapper.writeValueAsString(loginRequest);
	}

	@Test
	void getCurrentUserWithToken() throws Exception {
		// Perform login
		ResultActions result = mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(loginJson))
				.andExpect(MockMvcResultMatchers.status().isOk());

		// Verify login response and save token
		AuthResponse authResponse = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(),
				AuthResponse.class);
		String token = authResponse.getAccessToken();

		mockMvc.perform(MockMvcRequestBuilders.get("/user/me")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.email").value(newUserEmail));
	}

	@Test
	void getCurrentUserWithoutToken() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/user/me")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(MockMvcResultMatchers.status().isUnauthorized());
	}

	@AfterAll
	void cleanup() {
		// Clean up the database by deleting the created user
		User user = userRepository.findByEmail(newUserEmail).orElse(null);
		if (user != null) {
			userRepository.delete(user);
		}
	}
}
