package com.travelGuide.travelGuide.service;

import com.travelGuide.travelGuide.Pojo.BaseResponse;
import com.travelGuide.travelGuide.Pojo.UserProfileReqBody;
import com.travelGuide.travelGuide.Pojo.UserProfileRespBody;
import com.travelGuide.travelGuide.model.UserProfile;

public interface UserProfileService {

	public BaseResponse<UserProfile> getUserDetails(String msisdn);
	
	public BaseResponse<UserProfileRespBody> createAndGetUserProfileByEmail(String emailId);
	
	//public BaseResponse<UserProfileRespBody> getUserProfileByEmail(String emailId);
	
}
