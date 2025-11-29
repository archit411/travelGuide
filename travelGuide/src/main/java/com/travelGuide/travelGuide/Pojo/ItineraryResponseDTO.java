package com.travelGuide.travelGuide.Pojo;

import java.util.List;
import java.util.Map;

public class ItineraryResponseDTO {
    private String tripTitle;
    private String destination;
    private String summary;
    private int duration;
    private List<Map<String, Object>> days;
    private String totalEstimatedCost;
    private Object rawModelResponse;
    private String crowdLevel;


    public ItineraryResponseDTO() {}

    // getters / setters
    public String getTripTitle() { return tripTitle; }
    public void setTripTitle(String tripTitle) { this.tripTitle = tripTitle; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public List<Map<String, Object>> getDays() { return days; }
    public void setDays(List<Map<String, Object>> days) { this.days = days; }

    public String getTotalEstimatedCost() { return totalEstimatedCost; }
    public void setTotalEstimatedCost(String totalEstimatedCost) { this.totalEstimatedCost = totalEstimatedCost; }

    public Object getRawModelResponse() { return rawModelResponse; }
    public void setRawModelResponse(Object rawModelResponse) { this.rawModelResponse = rawModelResponse; }

    public String getCrowdLevel() {
        return crowdLevel;
    }

    public void setCrowdLevel(String crowdLevel) {
        this.crowdLevel = crowdLevel;
    }
}