package com.travelGuide.travelGuide.controller;

import com.travelGuide.travelGuide.Pojo.ItineraryResponseDTO;
import com.travelGuide.travelGuide.Pojo.TripRequestDTO;
import com.travelGuide.travelGuide.model.TripItinerary;
import com.travelGuide.travelGuide.service.TripItineraryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
//Testing
@RestController
@RequestMapping("/api/trip-itinerary")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000" , "http://localhost:5173"})
public class TripItineraryController {

    private static final Logger log = LoggerFactory.getLogger(TripItineraryController.class);

    @Autowired
    private TripItineraryService service;

    @PostMapping("/generate")
    public ResponseEntity<?> generate(@Valid @RequestBody TripRequestDTO req) {
        try {
            log.info("Generate itinerary request for destination={} days={}", req.getDestination(), req.getDuration());
            ItineraryResponseDTO result = service.generateItinerary(req);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error generating itinerary", e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody TripItinerary it) {
        try {
            log.info("Save itinerary request title={} userId={}", it.getTripTitle(), it.getUserId());
            TripItinerary saved = service.saveItinerary(it);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Error saving itinerary", e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-trips")
    public ResponseEntity<?> getMyTrips(@RequestHeader(value = "X-User-Id", required = false) String userId) {
        try {
            if (userId == null || userId.isBlank()) userId = "default-user";
            log.info("Fetching trips for user={}", userId);
            List<TripItinerary> trips = service.getMyTrips(userId);
            return ResponseEntity.ok(trips);
        } catch (Exception e) {
            log.error("Error fetching trips", e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTrip(@PathVariable UUID id) {
        try {
            log.info("Fetching trip id={}", id);
            TripItinerary trip = service.getTrip(id);
            if (trip == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Trip not found"));
            }
            return ResponseEntity.ok(trip);
        } catch (Exception e) {
            log.error("Error fetching trip", e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable UUID id) {
        try {
            log.info("Deleting trip id={}", id);
            service.deleteTrip(id);
            return ResponseEntity.ok(Map.of("message", "Trip deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting trip", e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}