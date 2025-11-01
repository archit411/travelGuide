package com.travelGuide.travelGuide.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name="top_visited_by_month")
public class TopVisitedByMonth {

	@Id
	@SequenceGenerator(name = "top_place_id_seq",sequenceName = "top_visited_by_month_id_seq",allocationSize = 1)
	@GeneratedValue( strategy = GenerationType.SEQUENCE, generator = "top_place_id_seq")
	@Column(name="id" , updatable = false , nullable = false)
	private int id;
	
	@Column(name="month")
	private String month;
	
	@Column(name="region")
	private String region;
	
	@Column(name="weather")
	private String weather;
	
	@Column(name="place_one")
	private String placeOne;
	
	@Column(name="place_two")
	private String placeTwo;
	
	@Column(name="descr_one")
	private String placeOneDescription;
	
	@Column(name="descr_two")
	private String placeTwoDescription;
	
	@Column(name="image_url1")
	private String imageUrl1;

	@Column(name="image_url2")
	private String image_url2;
	
	public String getImage_url2() {
		return image_url2;
	}
	
	public void setImage_url2(String image_url2) {
		this.image_url2 = image_url2;
	}

	public String getImageUrl1() {
		return imageUrl1;
	}

	public void setImageUrl1(String imageUrl1) {
		this.imageUrl1 = imageUrl1;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

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
