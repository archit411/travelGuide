package com.travelGuide.travelGuide.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelGuide.travelGuide.Pojo.BaseResponse;
import com.travelGuide.travelGuide.Pojo.UserProfileRespBody;
import com.travelGuide.travelGuide.model.UserProfile;
import com.travelGuide.travelGuide.repositories.UserProfileRepository;

@Service
public class UserProfileServiceImpl implements UserProfileService{
	
	@Autowired
	private UserProfileRepository userProfileRepo;
	
	public BaseResponse<UserProfile> getUserDetails(String msisdn) {
		
		BaseResponse<UserProfile> response = null;
		try {
			if(msisdn==null || msisdn=="") {
				
				response = new BaseResponse<UserProfile>();
				response.setData(null);
				response.setStatus("FAILURE");
				response.setDescription("msisdn is null");
				response.setStatusCode("105");
				
				return response;
			}
			
			UserProfile userProfile = userProfileRepo.findByMsisdn(msisdn);
			
			if(userProfile==null) {
				response = new BaseResponse<UserProfile>();
				response.setData(null);
				response.setStatus("FAILURE");
				response.setDescription("no record found for this msisdn");
				response.setStatusCode("106");
				
				return response;
			}
		
			response = new BaseResponse<UserProfile>();
			
			response.setData(userProfile);
			response.setDescription("user data fetched");
			response.setStatus("SUCCESS");
			response.setStatusCode("100");
			
			return response;
		}catch(Exception e) {
			e.printStackTrace();
			return response;
		}
	}

}
