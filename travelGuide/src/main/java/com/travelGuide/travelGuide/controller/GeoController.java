package com.travelGuide.travelGuide.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travelGuide.travelGuide.Pojo.NominatimResponse;
import com.travelGuide.travelGuide.service.GeoService;

@RestController
@RequestMapping("/api")
public class GeoController {

    private final GeoService geoService;

    public GeoController(GeoService geoService) {
        this.geoService = geoService;
    }

    @GetMapping("/coords")
    public NominatimResponse getCoords(@RequestParam String place) {
        return geoService.getLatLonFromPlace(place);
    }

    @GetMapping("/places/search")
    public java.util.List<NominatimResponse> searchPlaces(@RequestParam String query) {
        return geoService.searchPlaces(query);
    }

}
