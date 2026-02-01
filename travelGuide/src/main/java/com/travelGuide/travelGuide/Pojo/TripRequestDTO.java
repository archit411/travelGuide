package com.travelGuide.travelGuide.Pojo;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class TripRequestDTO {
    @NotBlank(message = "Destination is required")
    private String destination;

    @Min(value = 1, message = "Duration must be at least 1 day")
    private int duration = 3;

    // ISO date string e.g. "2025-12-20"
    private String startDate;

    private String interests = "Adventure";
    private String budget = "Medium";
    private String crowdLevel = "Medium";
    private String transport = "Self Drive";
    private int people;

    public TripRequestDTO() {
    }

    public TripRequestDTO(String destination, int duration, String startDate, String interests, String budget,
            String crowdLevel, String transport) {
        this.destination = destination;
        this.duration = duration;
        this.startDate = startDate;
        this.interests = interests;
        this.budget = budget;
        this.crowdLevel = crowdLevel;
        this.transport = transport;
    }

    // getters / setters
    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getBudget() {
        return budget;
    }

    public void setBudget(String budget) {
        this.budget = budget;
    }

    public String getCrowdLevel() {
        return crowdLevel;
    }

    public void setCrowdLevel(String crowdLevel) {
        this.crowdLevel = crowdLevel;
    }

    public String getTransport() {
        return transport;
    }

    public void setTransport(String transport) {
        this.transport = transport;
    }

    public int getPeople() {
        return people;
    }

    // Testing
    public void setPeople(int people) {
        this.people = people;
    }

    private boolean includeFlights;
    private String originCity;

    public boolean isIncludeFlights() {
        return includeFlights;
    }

    public void setIncludeFlights(boolean includeFlights) {
        this.includeFlights = includeFlights;
    }

    public String getOriginCity() {
        return originCity;
    }

    public void setOriginCity(String originCity) {
        this.originCity = originCity;
    }

}