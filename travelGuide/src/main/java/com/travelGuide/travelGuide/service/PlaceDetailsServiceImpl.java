package com.travelGuide.travelGuide.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelGuide.travelGuide.Pojo.NearByPlacesRespBody;
import com.travelGuide.travelGuide.Pojo.PlaceDetailsRespBody;
import com.travelGuide.travelGuide.Pojo.ThingsToDoRespBody;
import com.travelGuide.travelGuide.model.NearByPlacesModel;
import com.travelGuide.travelGuide.model.PlaceDetailsModel;
import com.travelGuide.travelGuide.model.ThingsToDoModel;
import com.travelGuide.travelGuide.repositories.NearByPlacesRepository;
import com.travelGuide.travelGuide.repositories.PlaceDetailsRepository;
import com.travelGuide.travelGuide.repositories.ThingsToDoRepository;

@Service
public class PlaceDetailsServiceImpl implements PlaceDetailsService {

	@Autowired
	private PlaceDetailsRepository placeDetailsRepository;

	@Autowired
	private NearByPlacesRepository nearByPlacesRepository;

	@Autowired
	private ThingsToDoRepository thingsToDoRepository;

	public PlaceDetailsRespBody getAllDetails(int id) {
		PlaceDetailsRespBody response = null;
		NearByPlacesRespBody nearByPlacesRespBody = null;
		ThingsToDoRespBody thingsToDoRespBody = null;
		List<NearByPlacesRespBody> nearByPlacesList = null;
		List<ThingsToDoRespBody> thingsToDoList = null;

		try {
			PlaceDetailsModel placeDetailsModel = placeDetailsRepository.getAllById(id);
			if (placeDetailsModel == null) {
				return new PlaceDetailsRespBody();
			}

			response = new PlaceDetailsRespBody();

			response.setId(placeDetailsModel.getId());
			response.setName(placeDetailsModel.getName());
			response.setDescription(placeDetailsModel.getDescription());
			response.setImageUrl(placeDetailsModel.getImageUrl());

			List<NearByPlacesModel> nearByPlacesModels = nearByPlacesRepository.getAllByPlaceId(id);

			if (nearByPlacesModels.isEmpty()) {
				nearByPlacesList = new ArrayList<>();
				nearByPlacesList.add(new NearByPlacesRespBody());
				response.setNearByPlaces(nearByPlacesList);
			}else {
				nearByPlacesList = new ArrayList<>();
				for (NearByPlacesModel nearByPlacesModel : nearByPlacesModels) {
					nearByPlacesRespBody = new NearByPlacesRespBody();

					nearByPlacesRespBody.setId(nearByPlacesModel.getId());
					nearByPlacesRespBody.setPlaceId(nearByPlacesModel.getPlaceId());
					nearByPlacesRespBody.setName(nearByPlacesModel.getName());
					nearByPlacesRespBody.setDistance(nearByPlacesModel.getDistance());
					nearByPlacesRespBody.setDescription(nearByPlacesModel.getDescription());
					nearByPlacesRespBody.setImageUrl(nearByPlacesModel.getImageUrl());

					nearByPlacesList.add(nearByPlacesRespBody);
				}
				
				response.setNearByPlaces(nearByPlacesList);
			}

			List<ThingsToDoModel> thingsToDoModels = thingsToDoRepository.getAllByPlaceId(id);
			if (thingsToDoModels.isEmpty()) {
				thingsToDoList = new ArrayList<>();
				thingsToDoList.add(new ThingsToDoRespBody());
				response.setThingsToDo(thingsToDoList);
			}else {
				thingsToDoList = new ArrayList<>();
				for (ThingsToDoModel thingsToDoModel : thingsToDoModels) {
					thingsToDoRespBody = new ThingsToDoRespBody();

					thingsToDoRespBody.setId(thingsToDoModel.getId());
					thingsToDoRespBody.setPlaceId(thingsToDoModel.getPlaceId());
					thingsToDoRespBody.setActivityName(thingsToDoModel.getActivityName());
					thingsToDoRespBody.setDescription(thingsToDoModel.getDescription());

					thingsToDoList.add(thingsToDoRespBody);
				}
				
				response.setThingsToDo(thingsToDoList);
			}
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			return new PlaceDetailsRespBody();
		}
	}

}
