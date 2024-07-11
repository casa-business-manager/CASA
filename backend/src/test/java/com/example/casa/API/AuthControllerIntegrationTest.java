package com.example.casa.API;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.transaction.annotation.Transactional;

import com.example.casa.Payload.AuthResponse;
import com.example.casa.Payload.LoginRequest;
import com.example.casa.Payload.SignUpRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS) // Allows non-static @BeforeAll
@Transactional // db changes are rolled back after each test
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
        this.newUserEmail = "walter@white.com";
        this.newUserPassword = "password";

        // Signup request
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setFirstName("Walter");
        signUpRequest.setLastName("White");
        signUpRequest.setEmail(this.newUserEmail);
        signUpRequest.setPassword(this.newUserPassword);

        this.signupJson = objectMapper.writeValueAsString(signUpRequest);
    }

    @Test
    void signup() throws Exception {
        // Perform signup
        mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.signupJson))
                .andExpect(MockMvcResultMatchers.status().isCreated());

        // Second signup request
        mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.signupJson))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void loginNewUser() throws Exception {
        // Login request
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("heisenberg@meth.com");
        loginRequest.setPassword("jessie");
        String loginJson = objectMapper.writeValueAsString(loginRequest);

        // Perform login
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    void loginExistingUser() throws Exception {
        // Perform signup
        mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.signupJson))
                .andExpect(MockMvcResultMatchers.status().isCreated());

        // Login request
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(this.newUserEmail);
        loginRequest.setPassword(this.newUserPassword);
        String loginJson = objectMapper.writeValueAsString(loginRequest);

        // Perform login
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Verify login response
        AuthResponse authResponse = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), AuthResponse.class);
        String token = authResponse.getAccessToken();

        // Assert token is not empty
        org.junit.jupiter.api.Assertions.assertNotNull(token);
    }
}
