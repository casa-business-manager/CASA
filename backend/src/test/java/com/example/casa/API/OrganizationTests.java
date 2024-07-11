// package com.example.casa.API;

// import com.example.casa.Payload.AuthResponse;
// import com.example.casa.Payload.LoginRequest;
// import com.example.casa.Payload.OrganizationDto;
// import com.example.casa.Payload.SignUpRequest;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import org.junit.jupiter.api.BeforeAll;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.TestInstance;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.http.MediaType;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.ResultActions;
// import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
// import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
// import org.springframework.transaction.annotation.Transactional;

// @SpringBootTest
// @AutoConfigureMockMvc
// @TestInstance(TestInstance.Lifecycle.PER_CLASS) // Allows non-static @BeforeAll
// @Transactional // db changes are rolled back after each test
// public class OrganizationTests {

//     @Autowired
//     private MockMvc mockMvc;

//     @Autowired
//     private ObjectMapper objectMapper;

//     private String newUserEmail;
//     private String newUserPassword;
//     private String token;
//     private String userId;

//     @BeforeAll
//     void setup() throws Exception {
//         newUserEmail = "walter@white.com";
//         newUserPassword = "password";

//         // Signup request
//         SignUpRequest signUpRequest = new SignUpRequest();
//         signUpRequest.setFirstName("Walter");
//         signUpRequest.setLastName("White");
//         signUpRequest.setEmail(newUserEmail);
//         signUpRequest.setPassword(newUserPassword);

//         String signupJson = objectMapper.writeValueAsString(signUpRequest);

//         // Perform signup
//         mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(signupJson))
//                 .andExpect(MockMvcResultMatchers.status().isCreated());

//         // Login request to get token
//         LoginRequest loginRequest = new LoginRequest();
//         loginRequest.setEmail(newUserEmail);
//         loginRequest.setPassword(newUserPassword);

//         String loginJson = objectMapper.writeValueAsString(loginRequest);

//         // Perform login
//         ResultActions result = mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(loginJson))
//                 .andExpect(MockMvcResultMatchers.status().isOk());

//         // Verify login response and save token
//         AuthResponse authResponse = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), AuthResponse.class);
//         token = authResponse.getAccessToken();
//         userId = authResponse.getUserId();
//     }

//     @Test
//     void testCreateOrganizationForUser() throws Exception {
//         OrganizationDto organizationDto = new OrganizationDto();
//         organizationDto.setOrgName("Chemistry Club");
//         organizationDto.setOrgDescription("A club for chemistry enthusiasts");
//         organizationDto.setOrgLocation("Albuquerque");

//         String organizationJson = objectMapper.writeValueAsString(organizationDto);

//         mockMvc.perform(MockMvcRequestBuilders.post("/user/" + userId + "/organizations")
//                 .header("Authorization", "Bearer " + token)
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(organizationJson))
//                 .andExpect(MockMvcResultMatchers.status().isOk())
//                 .andExpect(MockMvcResultMatchers.jsonPath("$.orgName").value("Chemistry Club"));
//     }

//     @Test
//     void testGetOrganizationsForUser() throws Exception {
//         mockMvc.perform(MockMvcRequestBuilders.get("/user/" + userId + "/organizations")
//                 .header("Authorization", "Bearer " + token)
//                 .contentType(MediaType.APPLICATION_JSON))
//                 .andExpect(MockMvcResultMatchers.status().isOk());
//     }

//     @Test
//     void testUpdateOrganization() throws Exception {
//         OrganizationDto organizationDto = new OrganizationDto();
//         organizationDto.setOrgName("New Chemistry Club");
//         organizationDto.setOrgDescription("Updated description");
//         organizationDto.setOrgLocation("New Location");

//         String organizationJson = objectMapper.writeValueAsString(organizationDto);

//         String orgId = "organization-id"; // Replace with actual organization ID from your test setup

//         mockMvc.perform(MockMvcRequestBuilders.put("/organization/" + orgId)
//                 .header("Authorization", "Bearer " + token)
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(organizationJson))
//                 .andExpect(MockMvcResultMatchers.status().isOk())
//                 .andExpect(MockMvcResultMatchers.jsonPath("$.orgName").value("New Chemistry Club"));
//     }

//     @Test
//     void testDeleteOrganization() throws Exception {
//         String orgId = "organization-id"; // Replace with actual organization ID from your test setup

//         mockMvc.perform(MockMvcRequestBuilders.delete("/organization/" + orgId)
//                 .header("Authorization", "Bearer " + token)
//                 .contentType(MediaType.APPLICATION_JSON))
//                 .andExpect(MockMvcResultMatchers.status().isOk());
//     }

//     @Test
//     void testInviteUserToOrganization() throws Exception {
//         String orgId = "organization-id"; // Replace with actual organization ID from your test setup
//         String inviteEmail = "invite@user.com"; // Replace with actual email from your test setup

//         mockMvc.perform(MockMvcRequestBuilders.post("/organization/" + orgId + "/invite")
//                 .header("Authorization", "Bearer " + token)
//                 .param("email", inviteEmail)
//                 .contentType(MediaType.APPLICATION_JSON))
//                 .andExpect(MockMvcResultMatchers.status().isOk())
//                 .andExpect(MockMvcResultMatchers.jsonPath("$.success").value(true));
//     }

//     @Test
//     void testRemoveUserFromOrganization() throws Exception {
//         String orgId = "organization-id"; // Replace with actual organization ID from your test setup
//         String removeUserId = "user-id"; // Replace with actual user ID from your test setup

//         mockMvc.perform(MockMvcRequestBuilders.delete("/organization/" + orgId + "/user/" + removeUserId)
//                 .header("Authorization", "Bearer " + token)
//                 .contentType(MediaType.APPLICATION_JSON))
//                 .andExpect(MockMvcResultMatchers.status().isOk())
//                 .andExpect(MockMvcResultMatchers.jsonPath("$.success").value(true));
//     }
// }
