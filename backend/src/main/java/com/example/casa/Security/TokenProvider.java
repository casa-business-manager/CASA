package com.example.casa.Security;

import java.util.Date;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.casa.Config.AppProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class TokenProvider {

	private static final Logger logger = LoggerFactory.getLogger(TokenProvider.class);

	private AppProperties appProperties;

	public TokenProvider(AppProperties appProperties) {
		this.appProperties = appProperties;
	}

	public String createToken(Authentication authentication) {
		UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + appProperties.getAuth().getTokenExpirationMsec());

		return Jwts.builder()
				.setSubject(userPrincipal.getId())
				.claim("permissions", userPrincipal.getAuthorities())
				.setIssuedAt(new Date())
				.setExpiration(expiryDate)
				.signWith(SignatureAlgorithm.HS512, appProperties.getAuth().getTokenSecret())
				.compact();
	}

	public UUID getUserIdFromToken(String token) {
		Claims claims = Jwts.parser()
				.setSigningKey(appProperties.getAuth().getTokenSecret())
				.parseClaimsJws(token)
				.getBody();

		return UUID.fromString(claims.getSubject());
	}

	public boolean validateToken(String authToken) {
		try {
			Jwts.parser().setSigningKey(appProperties.getAuth().getTokenSecret()).parseClaimsJws(authToken);
			return true;
		} catch (Exception ex) {
			logger.error("Invalid JWT token", ex);
		}
		return false;
	}
}
