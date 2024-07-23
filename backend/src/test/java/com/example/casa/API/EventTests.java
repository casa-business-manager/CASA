package com.example.casa.API;

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
import com.example.casa.Payload.Event.EventDto;
import com.example.casa.Payload.Organization.OrganizationDto;
import com.example.casa.Payload.User.AuthResponse;
import com.example.casa.Payload.User.LoginRequest;
import com.example.casa.Payload.User.SignUpRequest;
import com.example.casa.Repository.UserRepository;
import com.example.casa.Util.DateConverter;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS) // Allows non-static @BeforeAll
@Transactional // db changes are rolled back after each test
@Execution(ExecutionMode.SAME_THREAD)
@Isolated
public class EventTests {

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
	void getEmptyEventsUnbounded() throws Exception {
		// Get Walt unbounded events - empty
		mockMvc.perform(MockMvcRequestBuilders.get("/organizationCalendar/" + orgId + "/userId/" + waltId)
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.events", hasSize(0)));
	}

	@Test
	void getEmptyEventsBounded() throws Exception {
		// Get Walt unbounded events - empty
		String startISO = DateConverter.numbers2ISO(2024, 7, 22, 21, 30, 40);
		String endISO = DateConverter.numbers2ISO(2024, 7, 28, 21, 32, 41);
		mockMvc.perform(MockMvcRequestBuilders.get("/organizationCalendar/" + orgId + "/userId/" + waltId)
				.header("Authorization", "Bearer " + waltToken)
				.param("startDate", startISO)
				.param("endDate", endISO)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.events", hasSize(0)));
	}

	@Test
	void createEditGetDeleteEvent() throws Exception {
		EventDto newEventDto = new EventDto();
		String startISO;
		String endISO;

		// Create event start and ending before the [6/30,8/3] block
		startISO = DateConverter.numbers2ISO(2024, 6, 29, 23, 0, 0);
		endISO = DateConverter.numbers2ISO(2024, 6, 29, 23, 59, 59);
		newEventDto.setTitle("Cooking");
		newEventDto.setDescription("Time to cook some delicious meth");
		newEventDto.setLocation("RV in desert");
		newEventDto.setStart(startISO);
		newEventDto.setEnd(endISO);
		newEventDto.setAllDay(false);
		newEventDto.setEventCreatorId(waltId);
		newEventDto.setEventAccessorIds(new String[] { waltId, jessieId });
		String newEventJson = objectMapper.writeValueAsString(newEventDto);
		mockMvc.perform(MockMvcRequestBuilders.post("/organization/" + orgId + "/event")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(newEventJson))
				.andExpect(status().isOk());

		// Create event starting before and ending in the [6/30,8/3] block
		startISO = DateConverter.numbers2ISO(2024, 6, 29, 23, 0, 0);
		endISO = DateConverter.numbers2ISO(2024, 6, 30, 1, 0, 0);
		newEventDto.setTitle("Packing up");
		newEventDto.setDescription("Load everything into the RV and go into hiding");
		newEventDto.setLocation("[REDACTED]");
		newEventDto.setStart(startISO);
		newEventDto.setEnd(endISO);
		newEventDto.setAllDay(false);
		newEventDto.setEventCreatorId(waltId);
		newEventDto.setEventAccessorIds(new String[] { waltId });
		newEventJson = objectMapper.writeValueAsString(newEventDto);
		mockMvc.perform(MockMvcRequestBuilders.post("/organization/" + orgId + "/event")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(newEventJson))
				.andExpect(status().isOk());

		// Create event starting and ending in the [6/30,8/3] block
		startISO = DateConverter.numbers2ISO(2024, 7, 5, 3, 0, 0);
		endISO = DateConverter.numbers2ISO(2024, 7, 5, 6, 0, 0);
		newEventDto.setTitle("Try a little bit of our own supply");
		newEventDto.setDescription("😉");
		newEventDto.setLocation("Jessie's parents' house");
		newEventDto.setStart(startISO);
		newEventDto.setEnd(endISO);
		newEventDto.setAllDay(false);
		newEventDto.setEventCreatorId(waltId);
		newEventDto.setEventAccessorIds(new String[] { waltId });
		newEventJson = objectMapper.writeValueAsString(newEventDto);
		mockMvc.perform(MockMvcRequestBuilders.post("/organization/" + orgId + "/event")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(newEventJson))
				.andExpect(status().isOk());

		// Create event starting in and ending after the [6/30,8/3] block
		startISO = DateConverter.numbers2ISO(2024, 8, 3, 23, 0, 0);
		endISO = DateConverter.numbers2ISO(2024, 8, 4, 1, 0, 0);
		newEventDto.setTitle("Contact Gussy");
		newEventDto.setDescription("Call Gus and confirm selling plans");
		newEventDto.setLocation("Basement");
		newEventDto.setStart(startISO);
		newEventDto.setEnd(endISO);
		newEventDto.setAllDay(false);
		newEventDto.setEventCreatorId(waltId);
		newEventDto.setEventAccessorIds(new String[] { waltId });
		newEventJson = objectMapper.writeValueAsString(newEventDto);
		mockMvc.perform(MockMvcRequestBuilders.post("/organization/" + orgId + "/event")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(newEventJson))
				.andExpect(status().isOk());

		// Create event starting and ending after the [6/30,8/3] block
		startISO = DateConverter.numbers2ISO(2024, 8, 4, 0, 0, 0);
		endISO = DateConverter.numbers2ISO(2024, 8, 4, 1, 0, 0);
		newEventDto.setTitle("Selling");
		newEventDto.setDescription("Time to sell meth to Gussy");
		newEventDto.setLocation("35.6802172,-107.4555926");
		newEventDto.setStart(startISO);
		newEventDto.setEnd(endISO);
		newEventDto.setAllDay(false);
		newEventDto.setEventCreatorId(waltId);
		newEventDto.setEventAccessorIds(new String[] { waltId });
		newEventJson = objectMapper.writeValueAsString(newEventDto);
		mockMvc.perform(MockMvcRequestBuilders.post("/organization/" + orgId + "/event")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(newEventJson))
				.andExpect(status().isOk());

		// Create event starting before and ending after the [6/30,8/3] block
		startISO = DateConverter.numbers2ISO(2024, 6, 1, 0, 0, 0);
		endISO = DateConverter.numbers2ISO(2024, 9, 1, 0, 0, 0);
		newEventDto.setTitle("Gaslight Hank");
		newEventDto.setDescription("Gaslight the shit out of this dude lmao");
		newEventDto.setLocation("Hank's house");
		newEventDto.setStart(startISO);
		newEventDto.setEnd(endISO);
		newEventDto.setAllDay(false);
		newEventDto.setEventCreatorId(waltId);
		newEventDto.setEventAccessorIds(new String[] { waltId });
		newEventJson = objectMapper.writeValueAsString(newEventDto);
		mockMvc.perform(MockMvcRequestBuilders.post("/organization/" + orgId + "/event")
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(newEventJson))
				.andExpect(status().isOk());

		// Get Walt unbounded events - includes both events
		mockMvc.perform(MockMvcRequestBuilders.get("/organizationCalendar/" + orgId + "/userId/" + waltId)
				.header("Authorization", "Bearer " + waltToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.events", hasSize(6)))
				.andExpect(jsonPath("$.events[0].title", anyOf(
						is("Cooking"),
						is("Packing up"),
						is("Try a little bit of our own supply"),
						is("Contact Gussy"),
						is("Selling"),
						is("Gaslight Hank"))))
				.andExpect(jsonPath("$.events[1].title", anyOf(
						is("Cooking"),
						is("Packing up"),
						is("Try a little bit of our own supply"),
						is("Contact Gussy"),
						is("Selling"),
						is("Gaslight Hank"))));
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
