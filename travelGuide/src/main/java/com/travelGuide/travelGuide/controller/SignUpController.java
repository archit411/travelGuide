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
import com.travelGuide.travelGuide.service.TravelGuideService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class SignUpController {

	@Autowired
	private TravelGuideService travelGuideService;

	@PostMapping("/signup")
	public SignUpResponseBody getSignUpDetails(@Valid @RequestBody SignUpRequestBody request) {

		SignUpResponseBody response = null;

		try {
			if (request != null) {
				response = travelGuideService.getUserName(request);
			}
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			return response;
		}
	}

	@PostMapping("/login")
	public SignUpResponseBody getLoginUserName(@RequestParam String msisdn, @RequestParam String password) {

		SignUpResponseBody response = null;
		try {
			response = travelGuideService.loginUsername(msisdn, password);
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			return response;
		}
	}
	
	@PostMapping("/testing")
	public String testFunction() {
		return "test";
	}
}
