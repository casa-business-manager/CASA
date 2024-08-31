package com.casa.API;

import static org.hamcrest.Matchers.hasItems;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.annotation.Transactional;

import com.casa.Model.User;
import com.casa.Payload.Organization.OrganizationDto;
import com.casa.Payload.User.AuthResponse;
import com.casa.Payload.User.LoginRequest;
import com.casa.Payload.User.SignUpRequest;
import com.casa.Repository.UserRepository;
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

	private String waltEmail = "walter@white.com";
	private String jessieEmail = "jessie@pinkman.com";
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
				.andExpect(status().isCreated());
	}

	private String loginRequest(String email, String pass) throws Exception {
		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setEmail(email);
		loginRequest.setPassword(pass);

		String loginJson = objectMapper.writeValueAsString(loginRequest);

		ResultActions result = mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(loginJson))
				.andExpect(status().isOk());

		AuthResponse authResponse = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(),
				AuthResponse.class);
		return authResponse.getAccessToken();
	}

	private String getUserId(String token, String email) throws Exception {
		ResultActions userDataResult = mockMvc.perform(MockMvcRequestBuilders.post("/getCurrentUser")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value(email))
				.andExpect(jsonPath("$.id").exists());

		// Deserialize and extract waltId
		// It won't deserialize with objectMapper, gives error:
		// Cannot handle managed/back reference 'userOrgs': back reference type
		// (`java.util.Set<com.example.casa.Model.User>`) not compatible with managed
		// type (com.example.casa.Model.User) at [Source:
		// (String)"{"id":"70e3198f-ff71-41dc-a633-d01b79c36526","firstName":"Walter","lastName":"White","email":"walter@white.com","Password123!":"{bcrypt}$2a$10$23nCy68.GLZEv9r6S5dPd.ggYE18EJIm31.6BwsHok5jvYrzDvDt.","imageUrl":null,"provider":"local","providerId":null,"organizations":[]}";
		// line: 1, column: 1]
		// So temp workaround and just extract it by looking at the serialized json
		// string
		// Rn it has format
		// "{"id":"user-id-here-in-this-form","firstName":"Walter",...}"
		// User userDataResponse =
		// objectMapper.readValue(userDataResult.andReturn().getResponse().getContentAsString(),
		// User.class);
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
		signUpRequest("Walter", "White", waltEmail, "Password123!");
		signUpRequest("Jessie", "Pinkman", jessieEmail, "Password123!");

		// Send login requests
		waltToken = loginRequest(waltEmail, "Password123!");
		jessieToken = loginRequest(jessieEmail, "Password123!");

		// Use token to get userId
		waltId = getUserId(waltToken, waltEmail);
		jessieId = getUserId(jessieToken, jessieEmail);
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
		mockMvc.perform(MockMvcRequestBuilders.post("/getOrganizationsForUser/user/" + waltId)
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

		// create new org
		mockMvc.perform(MockMvcRequestBuilders.post("/createOrganizationForUser/user/" + waltId)
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(organizationJson))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.orgName").value("Chemistry Club"))
				.andExpect(jsonPath("$.orgDescription").value("Not cooking meth"))
				.andExpect(jsonPath("$.orgLocation").value("Albuquerque"))
				.andExpect(jsonPath("$.orgId").exists())
				.andExpect(jsonPath("$.users").exists())
				.andExpect(jsonPath("$.users[0].id").value(waltId));

		// get new org
		ResultActions newOrg = mockMvc.perform(MockMvcRequestBuilders.post("/getOrganizationsForUser/user/" + waltId)
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].orgName").value("Chemistry Club"))
				.andExpect(jsonPath("$[0].orgDescription").value("Not cooking meth"))
				.andExpect(jsonPath("$[0].orgLocation").value("Albuquerque"))
				.andExpect(jsonPath("$[0].orgId").exists())
				.andExpect(jsonPath("$[0].users").exists())
				.andExpect(jsonPath("$[0].users[0].id").value(waltId));
		String orgId = extractJsonString(newOrg.andReturn().getResponse().getContentAsString(), "orgId");

		// update org
		OrganizationDto organizationUpdateDto = new OrganizationDto();
		organizationUpdateDto.setOrgName("Meth Club");
		organizationUpdateDto.setOrgDescription("Make meth");
		organizationUpdateDto.setOrgLocation("Albuquerque");
		String organizationUpdateJson = objectMapper.writeValueAsString(organizationUpdateDto);
		mockMvc.perform(MockMvcRequestBuilders.post("/updateOrganization/organization/" + orgId)
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(organizationUpdateJson))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.orgName").value("Meth Club"))
				.andExpect(jsonPath("$.orgDescription").value("Make meth"))
				.andExpect(jsonPath("$.orgLocation").value("Albuquerque"))
				.andExpect(jsonPath("$.orgId").exists())
				.andExpect(jsonPath("$.users").exists())
				.andExpect(jsonPath("$.users[0].id").value(waltId));

		// Get users - only Walter is in
		mockMvc.perform(MockMvcRequestBuilders.post("/getUsersInOrganization/organization/" + orgId)
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value(waltId))
				.andExpect(jsonPath("$[1]").doesNotExist());

		// Invite user Jessie Pinkman
		mockMvc.perform(MockMvcRequestBuilders.post("/inviteUserToOrganization/organization/" + orgId)
				.header("Authorization", "Bearer " + waltToken)
				.param("email", jessieEmail)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.message").value("User invited successfully"));

		// Get users - Walter and Jessie
		mockMvc.perform(MockMvcRequestBuilders.post("/getUsersInOrganization/organization/" + orgId)
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[*].id", hasItems(waltId, jessieId)));

		// Get org works for Jessie
		mockMvc.perform(MockMvcRequestBuilders.post("/getOrganizationsForUser/user/" + jessieId)
				.header("Authorization", "Bearer " + jessieToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].orgName").value("Meth Club"))
				.andExpect(jsonPath("$[0].orgId").value(orgId));

		// TODO: Jessie cant use Walt's ID to get orgs
		// mockMvc.perform(MockMvcRequestBuilders.post("/getOrganizationsForUser/user/"
		// + jessieId)
		// .header("Authorization", "Bearer " + jessieToken)
		// .contentType(MediaType.APPLICATION_JSON))
		// .andExpect(status().isOk()) // Why is this passing???
		// .andExpect(jsonPath("$[0].orgName").value("Meth Club"))
		// .andExpect(jsonPath("$[0].orgId").value(orgId));

		// Remove user Jessie Pinkman
		mockMvc.perform(
				MockMvcRequestBuilders.post("/removeUserFromOrganization/organization/" + orgId + "/user/" + jessieId)
						.header("Authorization", "Bearer " + waltToken)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true));

		// Get users - only Walter is in
		mockMvc.perform(MockMvcRequestBuilders.post("/getUsersInOrganization/organization/" + orgId)
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value(waltId))
				.andExpect(jsonPath("$[1]").doesNotExist());

		// TODO: Jessie can't remove Walt
		// mockMvc.perform(MockMvcRequestBuilders.post("/removeUserFromOrganization/organization/"
		// + orgId + "/user/" + waltId)
		// .header("Authorization", "Bearer " + jessieToken)
		// .contentType(MediaType.APPLICATION_JSON))
		// .andExpect(status().isOk()) // Why is this passing???
		// .andExpect(jsonPath("$.success").value(true));

		// Delete org
		mockMvc.perform(MockMvcRequestBuilders.post("/deleteOrganization/organization/" + orgId)
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

		// TODO: Get org doesnt show
		// mockMvc.perform(MockMvcRequestBuilders.post("/getOrganizationsForUser/user/"
		// + waltId)
		// .header("Authorization", "Bearer " + waltToken)
		// .contentType(MediaType.APPLICATION_JSON))
		// .andExpect(status().isNoContent()); // Not right
		// // System.out.println(12345);
		// // System.out.println(noOrgs.andReturn().getResponse().getContentAsString());
		// //
		// // Org is still there???
	}

	@Test
	void updateNonexistantOrganization() throws Exception {
		OrganizationDto organizationUpdateDto = new OrganizationDto();
		organizationUpdateDto.setOrgName("Meth Club");
		organizationUpdateDto.setOrgDescription("Make meth");
		organizationUpdateDto.setOrgLocation("Albuquerque");
		String organizationUpdateJson = objectMapper.writeValueAsString(organizationUpdateDto);
		try {
			mockMvc.perform(MockMvcRequestBuilders.post("/updateOrganization/organization/" + "0")
					.header("Authorization", "Bearer " + waltToken)
					.contentType(MediaType.APPLICATION_JSON)
					.content(organizationUpdateJson))
					.andExpect(status().is(69420)); // must crash before it reaches here
		} catch (ServletException e) {
			assertTrue(e.getMessage().contains(
					"Request processing failed: java.lang.RuntimeException: Organization not found with id: 0"));
		}
	}

	// Not sure why but this causes issues in subsequent runs if not cleared
	@AfterAll
	void cleanup() {
		// Clean up the database by deleting the created user
		User user = userRepository.findByEmail(waltEmail).orElse(null);
		if (user != null) {
			userRepository.delete(user);
		}
		user = userRepository.findByEmail(jessieEmail).orElse(null);
		if (user != null) {
			userRepository.delete(user);
		}
	}
}
