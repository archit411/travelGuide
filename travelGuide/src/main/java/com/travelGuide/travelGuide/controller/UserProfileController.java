package com.travelGuide.travelGuide.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travelGuide.travelGuide.Pojo.BaseResponse;
import com.travelGuide.travelGuide.Pojo.UserProfileReqBody;
import com.travelGuide.travelGuide.Pojo.UserProfileRespBody;
import com.travelGuide.travelGuide.jwt.JwtUtil;
import com.travelGuide.travelGuide.model.UserProfile;
import com.travelGuide.travelGuide.repositories.UserProfileRepository;
import com.travelGuide.travelGuide.service.UserProfileService;

@RestController
@RequestMapping("/profile")
public class UserProfileController {
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private UserProfileService userProfileService;
	
	@Autowired
	private UserProfileRepository userProfileRepository;
	
	@PostMapping("/saveUserDetails")
	public BaseResponse saveUserDetailsForEmail(@RequestHeader("Authorization")String auth) {
		BaseResponse response = null;
		try {
			if(auth!=null) {
				String token = auth.substring(7);
				String emailId = jwtUtil.extractUsername(token);
				response = userProfileService.saveUserDetails(emailId);
				return response;
			}
			response = new BaseResponse();
			response.setDescription("token is null");
			response.setStatus("FAILURE");
			response.setStatusCode("106");
			
			return response;
		}catch(Exception e) {
			e.printStackTrace();
			return response;
		}
	}
	
	@PostMapping("/getUserDetails")
	public BaseResponse<UserProfileRespBody> testMethod(@RequestHeader("Authorization") String auth) {
		
		BaseResponse<UserProfileRespBody> response = null;
		try {
			if(auth!=null) {
				String token = auth.substring(7);
				String identifier = jwtUtil.extractUsername(token); //identifier - email or phone
				
				response = userProfileService.getLoggedInUsrDetails(identifier);
				return response;
			}
			response = new BaseResponse<UserProfileRespBody>();
			response.setDescription("token is null");
			response.setStatus("FAILURE");
			response.setStatusCode("106");
			
			return response;
		}catch(Exception e) {
			e.printStackTrace();
			return response;
		}
		
	}
	
}
