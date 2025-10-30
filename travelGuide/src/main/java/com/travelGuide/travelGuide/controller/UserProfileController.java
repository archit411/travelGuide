package com.travelGuide.travelGuide.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travelGuide.travelGuide.Pojo.BaseResponse;
import com.travelGuide.travelGuide.jwt.JwtUtil;
import com.travelGuide.travelGuide.model.UserProfile;
import com.travelGuide.travelGuide.service.UserProfileService;

@RestController
@RequestMapping("/profile")
public class UserProfileController {
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private UserProfileService userProfileService;

	@PostMapping("/getUserDetails")
	public BaseResponse<UserProfile> getUserProfileDetails(@RequestHeader("Authorization") String authHeader) {
		BaseResponse<UserProfile> response = null;
		try {
			
			String token = authHeader.substring(7); // remove "Bearer "
		    String msisdn = jwtUtil.extractUsername(token); //extracting msisdn from token
		    
		    response = userProfileService.getUserDetails(msisdn);

		    return response;
		}catch(Exception e) {
			e.printStackTrace();
			return response;
		}
	}
	
}
