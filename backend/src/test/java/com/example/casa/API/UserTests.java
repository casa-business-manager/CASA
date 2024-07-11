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
public class UserTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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

        // Perform signup
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

    // DO NOT RUN THESE THEY WILL CAUSE YOU TO FAIL ALL FUTURE TEST RUNS

    // @Test
    // void getCurrentUserWithToken() throws Exception {
    //     // Perform login
    //     ResultActions result = mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
    //             .contentType(MediaType.APPLICATION_JSON)
    //             .content(loginJson))
    //             .andExpect(MockMvcResultMatchers.status().isOk());

    //     // Verify login response and save token
    //     AuthResponse authResponse = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), AuthResponse.class);
    //     String token = authResponse.getAccessToken();

    //     mockMvc.perform(MockMvcRequestBuilders.get("/user/me")
    //             .header("Authorization", "Bearer " + token)
    //             .contentType(MediaType.APPLICATION_JSON))
    //             .andExpect(MockMvcResultMatchers.status().isOk())
    //             .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(newUserEmail));
    // }

    // @Test
    // void getCurrentUserWithoutToken() throws Exception {
    //     mockMvc.perform(MockMvcRequestBuilders.get("/user/me")
    //             .header("Authorization", "Bearer")
    //             .contentType(MediaType.APPLICATION_JSON))
    //             .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    // }
}
