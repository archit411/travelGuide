package com.travelGuide.travelGuide.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender javaMailSender;

	public void sendOtpEmail(String toEmail, String otp) {

		try {

			SimpleMailMessage message = new SimpleMailMessage();
			message.setFrom("architjain411@gmail.com");
			message.setTo(toEmail);
			message.setSubject("TripEasy verification code");
			message.setText("Your OTP code is: " + otp + "\nThis OTP is valid for 20 seconds.");
			javaMailSender.send(message);

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
