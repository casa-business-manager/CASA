package com.example.casa.API;

import org.junit.jupiter.api.Test;
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
@Transactional // db changes are rolled back after
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testSignupAndLogin() throws Exception {
        // Signup request
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setFirstName("Walter");
        signUpRequest.setLastName("White");
        signUpRequest.setEmail("walter@white.com");
        signUpRequest.setPassword("password");

        String signupJson = objectMapper.writeValueAsString(signUpRequest);

        // Perform signup
        mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(signupJson))
                .andExpect(MockMvcResultMatchers.status().isCreated());

        // Login request
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("walter@white.com");
        loginRequest.setPassword("password");

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
