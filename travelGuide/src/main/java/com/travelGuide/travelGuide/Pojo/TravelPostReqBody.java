package com.travelGuide.travelGuide.Pojo;

import org.springframework.web.multipart.MultipartFile;

public class TravelPostReqBody {

	private String username;
	private String destination;
	private String temprature;
	private String crowdLevel;
	private String caption;
	private double userRating;
	private MultipartFile  image;
	private String createdOn;
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getDestination() {
		return destination;
	}
	public void setDestination(String destination) {
		this.destination = destination;
	}
	public String getTemprature() {
		return temprature;
	}
	public void setTemprature(String temprature) {
		this.temprature = temprature;
	}
	public String getCrowdLevel() {
		return crowdLevel;
	}
	public void setCrowdLevel(String crowdLevel) {
		this.crowdLevel = crowdLevel;
	}
	public String getCaption() {
		return caption;
	}
	public void setCaption(String caption) {
		this.caption = caption;
	}
	public double getUserRating() {
		return userRating;
	}
	public void setUserRating(double userRating) {
		this.userRating = userRating;
	}
	public MultipartFile getImage() {
		return image;
	}
	public void setImage(MultipartFile imageUrl) {
		this.image = image;
	}
	public String getCreatedOn() {
		return createdOn;
	}
	public void setCreatedOn(String createdOn) {
		this.createdOn = createdOn;
	}
	
	
	
}
