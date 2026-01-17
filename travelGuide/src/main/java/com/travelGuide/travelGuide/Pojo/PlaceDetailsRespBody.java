package com.travelGuide.travelGuide.Pojo;

import java.util.List;

public class PlaceDetailsRespBody{
	
	private int id;
	private String name;
	private String description;
	private String imageUrl;
	private List<NearByPlacesRespBody> nearByPlacesRespBody;
	private List<ThingsToDoRespBody> thingsToDoRespBody;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getImageUrl() {
		return imageUrl;
	}
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	public List<NearByPlacesRespBody> getNearByPlaces() {
		return nearByPlacesRespBody;
	}
	public void setNearByPlaces(List<NearByPlacesRespBody> nearByPlacesRespBody) {
		this.nearByPlacesRespBody = nearByPlacesRespBody;
	}
	public List<ThingsToDoRespBody> getThingsToDo() {
		return thingsToDoRespBody;
	}
	public void setThingsToDo(List<ThingsToDoRespBody> thingsToDoRespBody) {
		this.thingsToDoRespBody = thingsToDoRespBody;
	}
	
	
}
