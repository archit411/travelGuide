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
import com.travelGuide.travelGuide.repositories.LoginSignUpRepository;


@RestController
@RequestMapping("/api/auth")
public class GoogleAuthController {

	@Value("${google.clientId}")
    private String googleClientId;
	
	private LoginSignUpRepository repository;
	
	private JwtUtil jwtUtil;

	public GoogleAuthController(LoginSignUpRepository repository,
			JwtUtil jwtUtil) {
		super();
		this.repository = repository;
		this.jwtUtil = jwtUtil;
	}
	
	@PostMapping("/google")
	public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body)
            throws GeneralSecurityException, IOException{
		
		String token = body.get("credential");
		
		GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
		        new NetHttpTransport(),
		        GsonFactory.getDefaultInstance())
		        .setAudience(Collections.singletonList(googleClientId))
		        .build();

		
		GoogleIdToken idToken = verifier.verify(token);
        if (idToken == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Invalid Google token"));
        }
		
        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        
        String[] fullName = name.split(" ");
        
        
        SignUpModel user =  repository.findByEmailId(email);
        if(user==null) {	
        	user = new SignUpModel();
            user.setEmailId(email);
            user.setfName(fullName[0]);
            user.setlName(fullName[1]);
            String userName = (""+fullName[0].charAt(0)+fullName[1].charAt(0)+"_"+fullName[1]).toLowerCase(); 
            user.setUsername(userName);
            user = repository.save(user);
        }
        
        String jwt = jwtUtil.generateToken(user.getEmailId());
        	
        return ResponseEntity.ok(Map.of(
                "errorCode", "100",
                "token", jwt,
                "userName", name
        ));
	}
	
}
