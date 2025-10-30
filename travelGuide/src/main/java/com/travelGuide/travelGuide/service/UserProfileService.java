package com.travelGuide.travelGuide.service;

import com.travelGuide.travelGuide.Pojo.BaseResponse;
import com.travelGuide.travelGuide.model.UserProfile;

public interface UserProfileService {

	public BaseResponse<UserProfile> getUserDetails(String msisdn);
	
}
