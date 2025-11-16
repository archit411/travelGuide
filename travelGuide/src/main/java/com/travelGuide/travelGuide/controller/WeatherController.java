package com.travelGuide.travelGuide.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travelGuide.travelGuide.Pojo.OpenMeteoResponse;
import com.travelGuide.travelGuide.service.WeatherService;

@RestController
@RequestMapping("/api")
public class WeatherController {
	
	@Autowired
	private WeatherService weatherService;

	@GetMapping("/weather")
	public OpenMeteoResponse weather(@RequestParam double lat, @RequestParam double lon) {
		return weatherService.getWeather(lat, lon);
	}

}
