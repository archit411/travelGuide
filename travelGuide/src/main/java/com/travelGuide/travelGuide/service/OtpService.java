package com.travelGuide.travelGuide.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class OtpService {

	private final Map<String,String> otpStorage = new HashMap<>();
	private final Map<String,Long> otpTimeStamps = new HashMap<>();
	
	private final long OTP_VALID_DURATION = 50*1000; //20 seconds
	
	public String generateOtp(String email) {
		String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
		otpStorage.put(email, otp);
		otpTimeStamps.put(email, System.currentTimeMillis());
		return otp;
	}
	
	public boolean verifyOtp(String email , String enteredOtp) {
		if(!otpStorage.containsKey(email)) {
			return false;
		}
		
		long createdTime = otpTimeStamps.get(email);
        if (System.currentTimeMillis() - createdTime > OTP_VALID_DURATION) {
            otpStorage.remove(email);
            otpTimeStamps.remove(email);
            return false; // OTP expired
        }
        
        String storedOtp = otpStorage.get(email);
        boolean isValid = storedOtp.equals(enteredOtp);
        
        if(isValid) {
        	otpStorage.remove(email); // OTP used → remove
        	otpTimeStamps.remove(email);
        }
        
        return isValid;
	}
	
}
