package com.travelGuide.travelGuide.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travelGuide.travelGuide.service.EmailService;
import com.travelGuide.travelGuide.service.OtpService;

@RestController
@RequestMapping("/api")
public class OtpController {

	@Autowired
	private OtpService otpService;
	
	@Autowired EmailService emailService;
	
	@PostMapping("/sendOtp")
	public String sendEmailOtp(@RequestParam String email) {
		
		if(email==null || email.isEmpty()) {
			return "email is null";
		}
		
		String otp = otpService.generateOtp(email);
		emailService.sendOtpEmail(email, otp);
		return "otpSentTo "+email;
	}
	
}
