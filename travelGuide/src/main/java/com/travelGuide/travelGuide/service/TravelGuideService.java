package com.travelGuide.travelGuide.service;

import com.travelGuide.travelGuide.Pojo.SignUpRequestBody;
import com.travelGuide.travelGuide.Pojo.SignUpResponseBody;

public interface TravelGuideService {

	public SignUpResponseBody getUserName(SignUpRequestBody request);
	
	public SignUpResponseBody loginUsername(String msisdn , String password);
	
}
