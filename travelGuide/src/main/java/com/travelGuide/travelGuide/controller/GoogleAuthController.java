package com.travelGuide.travelGuide.controller;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.travelGuide.travelGuide.jwt.JwtUtil;
import com.travelGuide.travelGuide.model.SignUpModel;
import com.travelGuide.travelGuide.model.UserProfile;
import com.travelGuide.travelGuide.repositories.LoginSignUpRepository;
import com.travelGuide.travelGuide.repositories.UserProfileRepository;

@RestController
@RequestMapping("/api/auth")
public class GoogleAuthController {

	@Value("${google.clientId}")
	private String googleClientId;

	private LoginSignUpRepository repository;

	private JwtUtil jwtUtil;

	private UserProfileRepository profileRepository;

	public GoogleAuthController(LoginSignUpRepository repository, JwtUtil jwtUtil,
			UserProfileRepository profileRepository) {
		super();
		this.repository = repository;
		this.jwtUtil = jwtUtil;
		this.profileRepository = profileRepository;
	}

	@PostMapping("/google")
	public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body)
			throws GeneralSecurityException, IOException {

		String token = body.get("credential");

		GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
				GsonFactory.getDefaultInstance()).setAudience(Collections.singletonList(googleClientId)).build();

		GoogleIdToken idToken = verifier.verify(token);
		if (idToken == null) {
			return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Invalid Google token"));
		}

		GoogleIdToken.Payload payload = idToken.getPayload();
		String email = payload.getEmail();
		String name = (String) payload.get("name");

		String[] fullName = name.split(" ");

		String userName = ("" + fullName[0].charAt(0) + fullName[1].charAt(0) + "_" + fullName[1]).toLowerCase();
		SignUpModel user = repository.findByEmailId(email);
		if (user == null) {
			user = new SignUpModel();
			user.setEmailId(email);
			user.setfName(fullName[0]);
			user.setlName(fullName[1]);
			user.setUsername(userName);
			user = repository.save(user);
		}

		String jwt = jwtUtil.generateToken(user.getEmailId());

		UserProfile findByEmailId = profileRepository.findByEmailId(email);
		if(findByEmailId==null) {
		
			UserProfile userProfile = new UserProfile();
			userProfile.setEmailId(email);
			userProfile.setfName(fullName[0]);
			userProfile.setlName(fullName[1]);
			userProfile.setUsername(userName);
			
			profileRepository.save(userProfile);
		}

		return ResponseEntity.ok(Map.of("errorCode", "100", "token", jwt, "userName", name));
	}

}
