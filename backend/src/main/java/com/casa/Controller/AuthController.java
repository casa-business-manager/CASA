package com.casa.Controller;

import java.net.URI;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.casa.Model.AuthProvider;
import com.casa.Model.User;
import com.casa.Payload.ApiResponse;
import com.casa.Payload.User.AuthResponse;
import com.casa.Payload.User.LoginRequest;
import com.casa.Payload.User.SignUpRequest;
import com.casa.Repository.UserRepository;
import com.casa.Security.TokenProvider;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private TokenProvider tokenProvider;

	private static final String UPPERCASE_PATTERN = ".*[A-Z].*";
	private static final String LOWERCASE_PATTERN = ".*[a-z].*";
	private static final String NUMBER_PATTERN = ".*\\d.*";
	private static final String SPECIAL_CHARACTER_PATTERN = ".*[!@#$%^&+=].*";

	private boolean isValidPwdCpx(String password) {
		logger.info("Checking password complexity for password: {}", password);
		return password.matches(UPPERCASE_PATTERN) &&
				password.matches(LOWERCASE_PATTERN) &&
				password.matches(NUMBER_PATTERN) &&
				password.matches(SPECIAL_CHARACTER_PATTERN);
	}

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(
							loginRequest.getEmail(),
							loginRequest.getPassword()));

			SecurityContextHolder.getContext().setAuthentication(authentication);

			String token = tokenProvider.createToken(authentication);
			return ResponseEntity.ok(new AuthResponse(token));
		} catch (BadCredentialsException e) {
			logger.error("Invalid credentials for user: {}", loginRequest.getEmail(), e);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
		} catch (DisabledException e) {
			logger.error("User account is disabled: {}", loginRequest.getEmail(), e);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User account is disabled");
		} catch (LockedException e) {
			logger.error("User account is locked: {}", loginRequest.getEmail(), e);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User account is locked");
		} catch (Exception e) {
			logger.error("Authentication failed for user: {}", loginRequest.getEmail(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authentication failed");
		}
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Email address already in use.");
		}

		if (!isValidPwdCpx(signUpRequest.getPassword())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
					"Password must contain at least one upper case letter, one lower case letter, one digit, and one special character.");
		}

		// Creating user's account
		User user = new User();
		user.setFirstName(signUpRequest.getFirstName());
		user.setLastName(signUpRequest.getLastName());
		user.setEmail(signUpRequest.getEmail());
		user.setPassword(signUpRequest.getPassword());
		user.setProvider(AuthProvider.local);

		user.setPassword(passwordEncoder.encode(user.getPassword()));

		User result = userRepository.save(user);

		URI location = ServletUriComponentsBuilder
				.fromCurrentContextPath().path("/user/me")
				.buildAndExpand(result.getId()).toUri();

		return ResponseEntity.created(location)
				.body(new ApiResponse(true, "User registered successfully"));
	}
}
