package com.travelGuide.travelGuide.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travelGuide.travelGuide.Pojo.SignUpRequestBody;
import com.travelGuide.travelGuide.Pojo.SignUpResponseBody;
import com.travelGuide.travelGuide.service.LoginSignupService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class LoginSignUpController {

	@Autowired
	private LoginSignupService loginSignupService;

	@PostMapping("/signup")
	public SignUpResponseBody getSignUpDetails(@Valid @RequestBody SignUpRequestBody request , @RequestParam String otp) {

		SignUpResponseBody response = null;

		try {
			if (request != null) {
				response = loginSignupService.signUpAndGetUsername(request,otp);
			}
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			return response;
		}
	}

	@PostMapping("/login")
	public SignUpResponseBody loginMsisdn(@RequestParam String emailId, @RequestParam String password) {

		SignUpResponseBody response = null;
		try {
			response = loginSignupService.login(emailId, password);
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			return response;
		}
	}
}
