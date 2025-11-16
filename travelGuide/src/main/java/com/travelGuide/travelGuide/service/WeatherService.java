package com.travelGuide.travelGuide.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.travelGuide.travelGuide.Pojo.OpenMeteoResponse;

@Service
public class WeatherService {

	private final WebClient webClient;

    public WeatherService(WebClient webClient) {
        this.webClient = webClient;
    }

    public OpenMeteoResponse getWeather(double lat, double lon) {
    	OpenMeteoResponse resp = webClient.get()
    	        .uri(uriBuilder -> uriBuilder
    	            .scheme("https")
    	            .host("api.open-meteo.com")
    	            .path("/v1/forecast")
    	            .queryParam("latitude", lat)
    	            .queryParam("longitude", lon)
    	            .queryParam("current_weather", true)
    	            .queryParam("hourly", "temperature_2m")
    	            .queryParam("timezone", "Asia/Kolkata")
    	            .build())
    	        .retrieve()
    	        .bodyToMono(OpenMeteoResponse.class)
    	        .block();
    	
    	if (resp != null && resp.getCurrent_weather() != null) {
            int code = resp.getCurrent_weather().getWeathercode();
            resp.getCurrent_weather().setDescription(getWeatherDescription(code));
        }

        return resp;
    }
    
    public String getWeatherDescription(int code) {
        return switch (code) {
            case 0 -> "Clear sky";
            case 1 -> "Mainly clear";
            case 2 -> "Partly cloudy";
            case 3 -> "Overcast";
            case 45 -> "Fog";
            case 48 -> "Depositing rime fog";
            case 51 -> "Light drizzle";
            case 53 -> "Moderate drizzle";
            case 55 -> "Dense drizzle";
            case 56 -> "Light freezing drizzle";
            case 57 -> "Dense freezing drizzle";
            case 61 -> "Slight rain";
            case 63 -> "Moderate rain";
            case 65 -> "Heavy rain";
            case 66 -> "Light freezing rain";
            case 67 -> "Heavy freezing rain";
            case 71 -> "Slight snow fall";
            case 73 -> "Moderate snow fall";
            case 75 -> "Heavy snow fall";
            case 77 -> "Snow grains";
            case 80 -> "Slight rain showers";
            case 81 -> "Moderate rain showers";
            case 82 -> "Violent rain showers";
            case 85 -> "Slight snow showers";
            case 86 -> "Heavy snow showers";
            case 95 -> "Thunderstorm";
            case 96 -> "Thunderstorm with light hail";
            case 99 -> "Thunderstorm with heavy hail";
            default -> "Unknown";
        };
    }


    
}
