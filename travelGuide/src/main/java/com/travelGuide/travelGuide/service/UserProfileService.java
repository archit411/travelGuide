package com.travelGuide.travelGuide.service;


import com.travelGuide.travelGuide.Pojo.BaseResponse;
import com.travelGuide.travelGuide.Pojo.UserProfileRespBody;

public interface UserProfileService {
	
	public BaseResponse saveUserDetails(String emailId);
	
	public BaseResponse<UserProfileRespBody> getLoggedInUsrDetails(String identifier);
	
	public BaseResponse<UserProfileRespBody> changePassword(String email , String oldPass , String newPass);
	
}
