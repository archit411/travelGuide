package com.travelGuide.travelGuide.service;

import java.util.Optional;

import com.travelGuide.travelGuide.Pojo.BaseResponse;
import com.travelGuide.travelGuide.Pojo.UserProfileReqBody;
import com.travelGuide.travelGuide.Pojo.UserProfileRespBody;
import com.travelGuide.travelGuide.model.UserProfile;

public interface UserProfileService {
	
	public BaseResponse saveUserDetails(String emailId);
	
	public BaseResponse<UserProfileRespBody> getLoggedInUsrDetails(String identifier);
	
}
