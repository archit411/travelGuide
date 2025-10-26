package com.travelGuide.travelGuide.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name="travel_post")
public class TravelPost {

	@Id
	@SequenceGenerator(name = "travel_post_id_seq",sequenceName = "travel_post_seq",allocationSize = 1)
	@GeneratedValue( strategy = GenerationType.SEQUENCE, generator = "travel_post_seq")
	@Column(name="id" , updatable = false , nullable = false)
	private int id;
	
	@Column(name="username")
	private String username;

    @Column(name = "destination")
    private String destination;

    @Column(name="temp")
    private String temperature;

    @Column(name = "crowd_level")
    private String crowdLevel;

    @Column(name = "caption" , length = 200)
    private String caption;

    @Column(name = "user_rating")
    private double userRating;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_on")
    private String createdOn;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

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

	public String getTemperature() {
		return temperature;
	}

	public void setTemperature(String temperature) {
		this.temperature = temperature;
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

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(String createdOn) {
		this.createdOn = createdOn;
	}
    
    
	
}
