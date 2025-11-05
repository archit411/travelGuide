package com.travelGuide.travelGuide.service;

import com.travelGuide.travelGuide.Pojo.SignUpRequestBody;
import com.travelGuide.travelGuide.Pojo.SignUpResponseBody;

public interface LoginSignupService {

	public SignUpResponseBody signUpAndGetUsername(SignUpRequestBody request,String otp);
	
	public SignUpResponseBody login(String emailId , String password);
	
}
