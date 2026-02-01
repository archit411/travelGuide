package com.travelGuide.travelGuide.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.travelGuide.travelGuide.Pojo.NominatimResponse;

@Service
public class GeoService {

    private final WebClient webClient;

    public GeoService(WebClient webClient) {
        this.webClient = webClient;
    }

    public List<NominatimResponse> searchPlaces(String query) {
        String userAgent = "travelGuide-app/1.0 (example@gmail.com)"; // Replace with valid contact

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("nominatim.openstreetmap.org")
                        .path("/search")
                        .queryParam("q", query)
                        .queryParam("format", "json")
                        .queryParam("addressdetails", "1")
                        .queryParam("limit", "5")
                        .build())
                .header("User-Agent", userAgent)
                .retrieve()
                .bodyToFlux(NominatimResponse.class)
                .collectList()
                .block();
    }

    public NominatimResponse getLatLonFromPlace(String place) {

        // Nominatim requires custom User-Agent (important!)
        String userAgent = "travelGuide-app/1.0 (example@gmail.com)";

        List<NominatimResponse> response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("nominatim.openstreetmap.org")
                        .path("/search")
                        .queryParam("q", place)
                        .queryParam("format", "json")
                        .queryParam("limit", "1")
                        .build())
                .header("User-Agent", userAgent)
                .retrieve()
                .bodyToFlux(NominatimResponse.class)
                .collectList()
                .block();

        if (response == null || response.isEmpty())
            return null;

        return response.get(0); // top result
    }

}
