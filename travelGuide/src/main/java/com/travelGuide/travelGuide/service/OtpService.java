package com.travelGuide.travelGuide.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class OtpService {

	private final Map<String,String> otpStorage = new HashMap<>();
	private final Map<String,Long> otpTimeStamps = new HashMap<>();
	
	private final long OTP_VALID_DURATION = 50*1000; //20 seconds
	
	public String generateOtp(String emailId) {
		String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
		otpStorage.put(emailId, otp);
		otpTimeStamps.put(emailId, System.currentTimeMillis());
		return otp;
	}
	
	public boolean verifyOtp(String emailId , String enteredOtp) {
		if(!otpStorage.containsKey(emailId)) {
			return false;
		}
		
		long createdTime = otpTimeStamps.get(emailId);
        if (System.currentTimeMillis() - createdTime > OTP_VALID_DURATION) {
            otpStorage.remove(emailId);
            otpTimeStamps.remove(emailId);
            return false; // OTP expired
        }
        
        String storedOtp = otpStorage.get(emailId);
        boolean isValid = storedOtp.equals(enteredOtp);
        
        if(isValid) {
        	otpStorage.remove(emailId); // OTP used → remove
        	otpTimeStamps.remove(emailId);
        }
        
        return isValid;
	}
	
}
