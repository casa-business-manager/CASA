package com.casa.API;

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

import com.casa.Payload.User.AuthResponse;
import com.casa.Payload.User.LoginRequest;
import com.casa.Payload.User.SignUpRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS) // Allows non-static @BeforeAll
@Transactional // db changes are rolled back after each test
@Execution(ExecutionMode.SAME_THREAD)
@Isolated
public class AuthControllerIntegrationTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	private String newUserEmail;
	private String newUserPassword;
	private String signupJson;

	@BeforeAll
	void setup() throws Exception {
		newUserEmail = "walter@white.com";
		newUserPassword = "Password123!";

		// Signup request
		SignUpRequest signUpRequest = new SignUpRequest();
		signUpRequest.setFirstName("Walter");
		signUpRequest.setLastName("White");
		signUpRequest.setEmail(newUserEmail);
		signUpRequest.setPassword(newUserPassword);

		signupJson = objectMapper.writeValueAsString(signUpRequest);
	}

	@Test
	void signup() throws Exception {
		// Perform signup
		mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
				.contentType(MediaType.APPLICATION_JSON)
				.content(signupJson))
				.andExpect(MockMvcResultMatchers.status().isCreated());

		// Second signup request
		mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
				.contentType(MediaType.APPLICATION_JSON)
				.content(signupJson))
				.andExpect(MockMvcResultMatchers.status().isConflict());
	}

	@Test
	void loginNewUser() throws Exception {
		// Login request
		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setEmail("heisenberg@meth.com");
		loginRequest.setPassword("jessie");
		String loginJson = objectMapper.writeValueAsString(loginRequest);

		// Perform login
		mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(loginJson))
				.andExpect(MockMvcResultMatchers.status().isUnauthorized());
	}

	@Test
	void loginExistingUser() throws Exception {
		// Perform signup
		mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
				.contentType(MediaType.APPLICATION_JSON)
				.content(signupJson))
				.andExpect(MockMvcResultMatchers.status().isCreated());

		// Login request
		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setEmail(newUserEmail);
		loginRequest.setPassword(newUserPassword);
		String loginJson = objectMapper.writeValueAsString(loginRequest);

		// Perform login
		ResultActions result = mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(loginJson))
				.andExpect(MockMvcResultMatchers.status().isOk());

		// Verify login response
		AuthResponse authResponse = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(),
				AuthResponse.class);
		String token = authResponse.getAccessToken();

		// Assert token is not empty
		org.junit.jupiter.api.Assertions.assertNotNull(token);
	}
}
