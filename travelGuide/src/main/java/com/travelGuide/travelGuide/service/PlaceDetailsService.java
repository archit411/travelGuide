package com.travelGuide.travelGuide.service;

import java.util.List;

import com.travelGuide.travelGuide.Pojo.PlaceDetailsRespBody;

public interface PlaceDetailsService {

	public PlaceDetailsRespBody getAllDetails(int placeId);
	
	public List<PlaceDetailsRespBody> getPlaceDetails();
	
}
