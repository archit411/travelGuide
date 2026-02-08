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
			} else {
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
			} else {
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

	public List<PlaceDetailsRespBody> getPlaceDetails() {
		PlaceDetailsRespBody placeDetailsRespBody = null;
		List<PlaceDetailsRespBody> response = null;
		try {
			List<PlaceDetailsModel> placeDetailsModels = placeDetailsRepository.findAll();
			response = new ArrayList<>();
			if (placeDetailsModels.isEmpty()) {
				return response;
			}

			response = new ArrayList<>();
			for (PlaceDetailsModel placeDetailsModel : placeDetailsModels) {
				placeDetailsRespBody = new PlaceDetailsRespBody();

				placeDetailsRespBody.setId(placeDetailsModel.getId());
				placeDetailsRespBody.setName(placeDetailsModel.getName());
				placeDetailsRespBody.setDescription(placeDetailsModel.getDescription());
				placeDetailsRespBody.setImageUrl(placeDetailsModel.getImageUrl());

				response.add(placeDetailsRespBody);
			}

			return response;
		} catch (Exception e) {
			e.printStackTrace();
			return response != null ? response : new ArrayList<>();
		}
	}

}
