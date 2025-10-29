package com.travelGuide.travelGuide.service;

import com.travelGuide.travelGuide.Pojo.SignUpRequestBody;
import com.travelGuide.travelGuide.Pojo.SignUpResponseBody;

public interface LoginSignupService {

	public SignUpResponseBody signUpAndGetUsername(SignUpRequestBody request);
	
	public SignUpResponseBody login(String msisdn , String password);
	
}
