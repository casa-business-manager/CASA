package com.example.casa.API;

import java.util.HashSet;

import static org.hamcrest.Matchers.anyOf;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.annotation.Transactional;

import com.example.casa.Model.User;
import com.example.casa.Payload.Organization.OrganizationDto;
import com.example.casa.Payload.Role.RoleDto;
import com.example.casa.Payload.User.AuthResponse;
import com.example.casa.Payload.User.LoginRequest;
import com.example.casa.Payload.User.SignUpRequest;
import com.example.casa.Repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS) // Allows non-static @BeforeAll
@Transactional // db changes are rolled back after each test
@Execution(ExecutionMode.SAME_THREAD)
@Isolated
public class RoleTests {

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
	private String orgId;

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
		ResultActions userDataResult = mockMvc.perform(MockMvcRequestBuilders.get("/user/me")
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
		// (String)"{"id":"70e3198f-ff71-41dc-a633-d01b79c36526","firstName":"Walter","lastName":"White","email":"walter@white.com","password":"{bcrypt}$2a$10$23nCy68.GLZEv9r6S5dPd.ggYE18EJIm31.6BwsHok5jvYrzDvDt.","imageUrl":null,"provider":"local","providerId":null,"organizations":[]}";
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
		signUpRequest("Walter", "White", waltEmail, "password");
		signUpRequest("Jessie", "Pinkman", jessieEmail, "password");

		// Send login requests
		waltToken = loginRequest(waltEmail, "password");
		jessieToken = loginRequest(jessieEmail, "password");

		// Use token to get userId
		waltId = getUserId(waltToken, waltEmail);
		jessieId = getUserId(jessieToken, jessieEmail);

		// Organization to make
		OrganizationDto organizationDto = new OrganizationDto();
		organizationDto.setOrgName("Chemistry Club");
		organizationDto.setOrgDescription("Not cooking meth");
		organizationDto.setOrgLocation("Albuquerque");
		String organizationJson = objectMapper.writeValueAsString(organizationDto);

		// create new org
		mockMvc.perform(MockMvcRequestBuilders.post("/user/" + waltId + "/organizations")
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
		ResultActions newOrg = mockMvc.perform(MockMvcRequestBuilders.get("/user/" + waltId + "/organizations")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].orgName").value("Chemistry Club"))
				.andExpect(jsonPath("$[0].orgDescription").value("Not cooking meth"))
				.andExpect(jsonPath("$[0].orgLocation").value("Albuquerque"))
				.andExpect(jsonPath("$[0].orgId").exists())
				.andExpect(jsonPath("$[0].users").exists())
				.andExpect(jsonPath("$[0].users[0].id").value(waltId));
		orgId = extractJsonString(newOrg.andReturn().getResponse().getContentAsString(), "orgId");

		// Invite user Jessie Pinkman
		mockMvc.perform(MockMvcRequestBuilders.post("/organization/" + orgId + "/invite")
				.header("Authorization", "Bearer " + waltToken)
				.param("email", jessieEmail)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.message").value("User invited successfully"));
	}

	@Test
	void getRolesInitial() throws Exception {
		// Get roles for org
		ResultActions roles = mockMvc.perform(MockMvcRequestBuilders.get("/organization/" + orgId + "/roles")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].name").value("root"));
		String rootId = extractJsonString(roles.andReturn().getResponse().getContentAsString(), "roleId");

		// Get roles for Walt
		mockMvc.perform(MockMvcRequestBuilders.get("/user/" + waltId + "/roles")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].name").value("root"));

		// Get roles for Jessie
		mockMvc.perform(MockMvcRequestBuilders.get("/user/" + jessieId + "/roles")
				.header("Authorization", "Bearer " + jessieToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent());

		// Get users with role "root"
		mockMvc.perform(MockMvcRequestBuilders.get("/roles/" + rootId + "/users")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].email").value(waltEmail));
	}

	@Test
	void createRoles() throws Exception {
		String rootId;
		String headChefId;
		RoleDto roleDto = new RoleDto();
		String roleJson;

		// Get root ID
		ResultActions roles = mockMvc.perform(MockMvcRequestBuilders.get("/organization/" + orgId + "/roles")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].name").value("root"));
		rootId = extractJsonString(roles.andReturn().getResponse().getContentAsString(), "roleId");

		// Create role "Head chef" under root with no users
		roleDto.setName("Head chef");
		roleDto.setPermissions("everything");
		roleDto.setManagedById(rootId);
		roleJson = objectMapper.writeValueAsString(roleDto);
		ResultActions newRole = mockMvc.perform(MockMvcRequestBuilders.post("/organization/" + orgId + "/roles")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(roleJson))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.users", hasSize(0)))
				.andExpect(jsonPath("$.name").value("Head chef"));
		headChefId = extractJsonString(newRole.andReturn().getResponse().getContentAsString(), "roleId");

		// Get roles for org
		mockMvc.perform(MockMvcRequestBuilders.get("/organization/" + orgId + "/roles")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(2)))
				.andExpect(jsonPath("$[0].name", anyOf(
						is("root"),
						is("Head chef"))))
				.andExpect(jsonPath("$[1].name", anyOf(
						is("root"),
						is("Head chef"))));

		// Get roles for Walt
		mockMvc.perform(MockMvcRequestBuilders.get("/user/" + waltId + "/roles")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].name").value("root"));

		// Get roles for Jessie
		mockMvc.perform(MockMvcRequestBuilders.get("/user/" + jessieId + "/roles")
				.header("Authorization", "Bearer " + jessieToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent());

		// Get users with role "root"
		mockMvc.perform(MockMvcRequestBuilders.get("/roles/" + rootId + "/users")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].email").value(waltEmail));

		// Delete role "Head chef"
		mockMvc.perform(MockMvcRequestBuilders.get("/roles/" + headChefId + "/users")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

	@Test
	void editRoles() throws Exception {
		String rootId;
		String headChefId;
		RoleDto roleDto = new RoleDto();
		String roleJson;

		// Get root ID
		ResultActions roles = mockMvc.perform(MockMvcRequestBuilders.get("/organization/" + orgId + "/roles")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].name").value("root"));
		rootId = extractJsonString(roles.andReturn().getResponse().getContentAsString(), "roleId");

		// Create role "Head chef" under root with no users
		roleDto.setName("Head chef");
		roleDto.setPermissions("everything");
		roleDto.setManagedById(rootId);
		roleJson = objectMapper.writeValueAsString(roleDto);
		ResultActions headChef = mockMvc.perform(MockMvcRequestBuilders.post("/organization/" + orgId + "/roles")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(roleJson))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.users", hasSize(0)))
				.andExpect(jsonPath("$.name").value("Head chef"));
		headChefId = extractJsonString(headChef.andReturn().getResponse().getContentAsString(), "roleId");

		// Edit role to "Heisenberg" and give to Walt
		roleDto.setName("Heisenberg");
		roleDto.setUserIds(new HashSet<String>() {
			{
				add(waltId);
			}
		});
		roleJson = objectMapper.writeValueAsString(roleDto);
		mockMvc.perform(MockMvcRequestBuilders.put("/roles/" + headChefId)
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(roleJson))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.users", hasSize(1)))
				.andExpect(jsonPath("$.name").value("Heisenberg"));

		// Get roles for org
		mockMvc.perform(MockMvcRequestBuilders.get("/organization/" + orgId + "/roles")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(2)))
				.andExpect(jsonPath("$[0].name", anyOf(
						is("root"),
						is("Heisenberg"))))
				.andExpect(jsonPath("$[1].name", anyOf(
						is("root"),
						is("Heisenberg"))));

		// Get roles for Walt
		mockMvc.perform(MockMvcRequestBuilders.get("/user/" + waltId + "/roles")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(2)))
				.andExpect(jsonPath("$[0].name", anyOf(
						is("root"),
						is("Heisenberg"))))
				.andExpect(jsonPath("$[1].name", anyOf(
						is("root"),
						is("Heisenberg"))));

		// Get roles for Jessie
		mockMvc.perform(MockMvcRequestBuilders.get("/user/" + jessieId + "/roles")
				.header("Authorization", "Bearer " + jessieToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent());

		// Get users with role "root"
		mockMvc.perform(MockMvcRequestBuilders.get("/roles/" + rootId + "/users")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].email").value(waltEmail));

		// Delete role "Head chef"
		mockMvc.perform(MockMvcRequestBuilders.get("/roles/" + headChefId + "/users")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

	@Test
	void addAndRemoveRoles() throws Exception {
		String rootId;
		String headChefId;
		RoleDto roleDto = new RoleDto();
		String roleJson;

		// Get root ID
		ResultActions roles = mockMvc.perform(MockMvcRequestBuilders.get("/organization/" + orgId + "/roles")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].name").value("root"));
		rootId = extractJsonString(roles.andReturn().getResponse().getContentAsString(), "roleId");

		// Create role "Head chef" under root with walt as user
		roleDto.setName("Head chef");
		roleDto.setPermissions("everything");
		roleDto.setUserIds(new HashSet<String>() {
			{
				add(waltId);
			}
		});
		roleDto.setManagedById(rootId);
		roleJson = objectMapper.writeValueAsString(roleDto);
		ResultActions headChef = mockMvc.perform(MockMvcRequestBuilders.post("/organization/" + orgId + "/roles")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(roleJson))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.users", hasSize(1)))
				.andExpect(jsonPath("$.users[0].email").value(waltEmail))
				.andExpect(jsonPath("$.name").value("Head chef"));
		headChefId = extractJsonString(headChef.andReturn().getResponse().getContentAsString(), "roleId");

		// Add Jessie to "Head chef"
		mockMvc.perform(MockMvcRequestBuilders.put("/user/" + jessieId + "/roles/" + headChefId + "/add")
				.header("Authorization", "Bearer " + jessieToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

		// Get roles for Jessie
		mockMvc.perform(MockMvcRequestBuilders.get("/user/" + jessieId + "/roles")
				.header("Authorization", "Bearer " + jessieToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].name", is("Head chef")));

		// Get users with role "Head chef"
		mockMvc.perform(MockMvcRequestBuilders.get("/roles/" + headChefId + "/users")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(2)))
				.andExpect(jsonPath("$[0].email", anyOf(
						is(waltEmail),
						is(jessieEmail))))
				.andExpect(jsonPath("$[1].email", anyOf(
						is(waltEmail),
						is(jessieEmail))));

		// Remove Jessie from "Head chef"
		mockMvc.perform(MockMvcRequestBuilders.put("/user/" + jessieId + "/roles/" + headChefId + "/remove")
				.header("Authorization", "Bearer " + jessieToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

		// Get roles for Jessie
		mockMvc.perform(MockMvcRequestBuilders.get("/user/" + jessieId + "/roles")
				.header("Authorization", "Bearer " + jessieToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent());

		// Get users with role "Head chef"
		mockMvc.perform(MockMvcRequestBuilders.get("/roles/" + headChefId + "/users")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].email", anyOf(
						is(waltEmail),
						is(jessieEmail))));

		// Delete role "Head chef"
		mockMvc.perform(MockMvcRequestBuilders.get("/roles/" + headChefId + "/users")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
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
