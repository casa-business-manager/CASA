package com.example.casa.API;

import org.junit.jupiter.api.AfterAll;
import static org.junit.jupiter.api.Assertions.assertTrue;
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
import com.example.casa.Payload.AuthResponse;
import com.example.casa.Payload.LoginRequest;
import com.example.casa.Payload.OrganizationDto;
import com.example.casa.Payload.SignUpRequest;
import com.example.casa.Repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS) // Allows non-static @BeforeAll
@Transactional // db changes are rolled back after each test
@Execution(ExecutionMode.SAME_THREAD)
@Isolated
public class OrganizationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private String waltToken;
    private String waltId;
    private String jessieToken;
    private String jessieId;

    private void signUpRequest(String first, String last, String email, String pass) throws Exception {
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setFirstName(first);
        signUpRequest.setLastName(last);
        signUpRequest.setEmail(email);
        signUpRequest.setPassword(pass);

        String jsonString = objectMapper.writeValueAsString(signUpRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonString))
                .andExpect(MockMvcResultMatchers.status().isCreated());
    }

    private String loginRequest(String email, String pass) throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(pass);

        String loginJson = objectMapper.writeValueAsString(loginRequest);

        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(MockMvcResultMatchers.status().isOk());

        AuthResponse authResponse = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), AuthResponse.class);
        return authResponse.getAccessToken();
    }

    private String getUserId(String token, String email) throws Exception {
        ResultActions userDataResult = mockMvc.perform(MockMvcRequestBuilders.get("/user/me")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(email))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists());

        // Deserialize and extract waltId
        //      It won't deserialize with objectMapper, gives error:
        //          Cannot handle managed/back reference 'userOrgs': back reference type (`java.util.Set<com.example.casa.Model.User>`) not compatible with managed type (com.example.casa.Model.User) at [Source: (String)"{"id":"70e3198f-ff71-41dc-a633-d01b79c36526","firstName":"Walter","lastName":"White","email":"walter@white.com","password":"{bcrypt}$2a$10$23nCy68.GLZEv9r6S5dPd.ggYE18EJIm31.6BwsHok5jvYrzDvDt.","imageUrl":null,"provider":"local","providerId":null,"organizations":[]}"; line: 1, column: 1]
        //      So temp workaround and just extract it by looking at the serialized json string
        //      Rn it has format "{"id":"user-id-here-in-this-form","firstName":"Walter",...}"
        // User userDataResponse = objectMapper.readValue(userDataResult.andReturn().getResponse().getContentAsString(), User.class);
        // waltId = userDataResponse.getId();
        String jsonString = userDataResult.andReturn().getResponse().getContentAsString();
        return extractJsonString(jsonString, "id");
    }

    private String extractJsonString(String jsonString, String key) {
        String keyInJson = '"' + key + '"' + ':' + '"';
        int indexOfId = jsonString.indexOf(keyInJson);
        int indexOfEndOfId = jsonString.indexOf('"', indexOfId + keyInJson.length());
        return jsonString.substring(indexOfId + keyInJson.length(), indexOfEndOfId);
    }

    @BeforeAll
    void setup() throws Exception {
        // Send signup requests
        signUpRequest("Walter", "White", "walter@white.com", "password");
        signUpRequest("Jessie", "Pinkman", "jessie@pinkman.com", "password");

        // Send login requests
        waltToken = loginRequest("walter@white.com", "password");
        jessieToken = loginRequest("jessie@pinkman.com", "password");

        // Use token to get userId
        waltId = getUserId(waltToken, "walter@white.com");
        jessieId = getUserId(jessieToken, "jessie@pinkman.com");
    }

    @Test
    void organizationGetCreatePutDeleteInvite() throws Exception {
        // Organization to make
        OrganizationDto organizationDto = new OrganizationDto();
        organizationDto.setOrgName("Chemistry Club");
        organizationDto.setOrgDescription("Not cooking meth");
        organizationDto.setOrgLocation("Albuquerque");
        String organizationJson = objectMapper.writeValueAsString(organizationDto);

        // Get nonexistant org
        mockMvc.perform(MockMvcRequestBuilders.get("/user/" + waltId + "/organizations")
                .header("Authorization", "Bearer " + waltToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNoContent());

        // create new org
        mockMvc.perform(MockMvcRequestBuilders.post("/user/" + waltId + "/organizations")
                .header("Authorization", "Bearer " + waltToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(organizationJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.orgName").value("Chemistry Club"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.orgDescription").value("Not cooking meth"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.orgLocation").value("Albuquerque"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.orgId").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.users").doesNotExist());

        // get new org
        ResultActions newOrg = mockMvc.perform(MockMvcRequestBuilders.get("/user/" + waltId + "/organizations")
                .header("Authorization", "Bearer " + waltToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].orgName").value("Chemistry Club"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].orgDescription").value("Not cooking meth"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].orgLocation").value("Albuquerque"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].orgId").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].users").doesNotExist());
        String orgId = extractJsonString(newOrg.andReturn().getResponse().getContentAsString(), "orgId");

        // update org
        OrganizationDto organizationUpdateDto = new OrganizationDto();
        organizationUpdateDto.setOrgName("Meth Club");
        organizationUpdateDto.setOrgDescription("Make meth");
        organizationUpdateDto.setOrgLocation("Albuquerque");
        String organizationUpdateJson = objectMapper.writeValueAsString(organizationUpdateDto);
        mockMvc.perform(MockMvcRequestBuilders.put("/organization/" + orgId)
                .header("Authorization", "Bearer " + waltToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(organizationUpdateJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.orgName").value("Meth Club"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.orgDescription").value("Make meth"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.orgLocation").value("Albuquerque"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.orgId").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.users").doesNotExist());

        // Get users - only Walter is in
        mockMvc.perform(MockMvcRequestBuilders.get("/organization/" + orgId + "/users")
                .header("Authorization", "Bearer " + waltToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(waltId))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1]").doesNotExist());

        // Invite user Jessie Pinkman
        // Get users - Walter and Jessie
        mockMvc.perform(MockMvcRequestBuilders.get("/organization/" + orgId + "/users")
                .header("Authorization", "Bearer " + waltToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(waltId))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(jessieId));

        // Get org works for Jessie
        // Remove user Jessie Pinkman
        // Get users - only Walter is in
        // Delete org
        mockMvc.perform(MockMvcRequestBuilders.delete("/organization/" + orgId)
                .header("Authorization", "Bearer " + waltToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Get org doesnt show
        // mockMvc.perform(MockMvcRequestBuilders.get("/user/" + waltId + "/organizations")
        //         .header("Authorization", "Bearer " + token)
        //         .contentType(MediaType.APPLICATION_JSON))
        //         .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    void updateNonexistantOrganization() throws Exception {
        OrganizationDto organizationUpdateDto = new OrganizationDto();
        organizationUpdateDto.setOrgName("Meth Club");
        organizationUpdateDto.setOrgDescription("Make meth");
        organizationUpdateDto.setOrgLocation("Albuquerque");
        String organizationUpdateJson = objectMapper.writeValueAsString(organizationUpdateDto);
        try {
            mockMvc.perform(MockMvcRequestBuilders.put("/organization/" + "0")
                    .header("Authorization", "Bearer " + waltToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(organizationUpdateJson))
                    .andExpect(MockMvcResultMatchers.status().is(69420)); // must crash before it reaches here
        } catch (ServletException e) {
            assertTrue(e.getMessage().contains("Request processing failed: java.lang.RuntimeException: Organization not found with id: 0"));
        }
    }

    // @Test
    // void testInviteUserToOrganization() throws Exception {
    //     String orgId = "organization-id"; // Replace with actual organization ID from your test setup
    //     String inviteEmail = "invite@user.com"; // Replace with actual email from your test setup
    //     mockMvc.perform(MockMvcRequestBuilders.post("/organization/" + orgId + "/invite")
    //             .header("Authorization", "Bearer " + token)
    //             .param("email", inviteEmail)
    //             .contentType(MediaType.APPLICATION_JSON))
    //             .andExpect(MockMvcResultMatchers.status().isOk())
    //             .andExpect(MockMvcResultMatchers.jsonPath("$.success").value(true));
    // }
    // @Test
    // void testRemoveUserFromOrganization() throws Exception {
    //     String orgId = "organization-id"; // Replace with actual organization ID from your test setup
    //     String removeWaltId = "user-id"; // Replace with actual user ID from your test setup
    //     mockMvc.perform(MockMvcRequestBuilders.delete("/organization/" + orgId + "/user/" + removeUserId)
    //             .header("Authorization", "Bearer " + token)
    //             .contentType(MediaType.APPLICATION_JSON))
    //             .andExpect(MockMvcResultMatchers.status().isOk())
    //             .andExpect(MockMvcResultMatchers.jsonPath("$.success").value(true));
    // }
    // Not sure why but this causes issues in subsequent runs if not cleared
    @AfterAll
    void cleanup() {
        // Clean up the database by deleting the created user
        User user = userRepository.findByEmail("walter@white.com").orElse(null);
        if (user != null) {
            userRepository.delete(user);
        }
        user = userRepository.findByEmail("jessie@pinkman.com").orElse(null);
        if (user != null) {
            userRepository.delete(user);
        }
    }
}
