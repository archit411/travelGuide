package com.travelGuide.travelGuide.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelGuide.travelGuide.Pojo.PlaceDetailsRespBody;
import com.travelGuide.travelGuide.service.PlaceDetailsService;

@RestController
@RequestMapping("api/places")
public class PlaceDetailsController {
	
	@Autowired
	private PlaceDetailsService placeDetailsService;

	@PostMapping("/{placeId}/details")
	public PlaceDetailsRespBody getPlaceDetails(@PathVariable int placeId) {
		PlaceDetailsRespBody response = null;
		try {
			response = placeDetailsService.getAllDetails(placeId);
			return response;
		}catch(Exception e) {
			e.printStackTrace();
			response = new PlaceDetailsRespBody();
			return response;
		}
		
	}
	
}
