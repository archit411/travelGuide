package com.travelGuide.travelGuide.Pojo;

public class TopVisitedPlacesByMonthReqBody {

	private String month;
	private String region;
	private String weather;
	private String placeOne;
	private String placeTwo;
	private String placeOneDescription;
	private String placeTwoDescription;
	
	
	public String getMonth() {
		return month;
	}
	public void setMonth(String month) {
		this.month = month;
	}
	public String getRegion() {
		return region;
	}
	public void setRegion(String region) {
		this.region = region;
	}
	public String getWeather() {
		return weather;
	}
	public void setWeather(String weather) {
		this.weather = weather;
	}
	public String getPlaceOne() {
		return placeOne;
	}
	public void setPlaceOne(String placeOne) {
		this.placeOne = placeOne;
	}
	public String getPlaceTwo() {
		return placeTwo;
	}
	public void setPlaceTwo(String placeTwo) {
		this.placeTwo = placeTwo;
	}
	public String getPlaceOneDescription() {
		return placeOneDescription;
	}
	public void setPlaceOneDescription(String placeOneDescription) {
		this.placeOneDescription = placeOneDescription;
	}
	public String getPlaceTwoDescription() {
		return placeTwoDescription;
	}
	public void setPlaceTwoDescription(String placeTwoDescription) {
		this.placeTwoDescription = placeTwoDescription;
	}
	
}
