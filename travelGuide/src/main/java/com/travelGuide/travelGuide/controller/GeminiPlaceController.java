package main.java.com.travelGuide.travelGuide.controller;

import com.travelGuide.travelGuide.service.GeminiPlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/places")
public class GeminiPlaceController {

    @Autowired
    private GeminiPlaceService geminiPlaceService;

    @PostMapping("/ai-info")
    public ResponseEntity<Map<String, Object>> getPlaceAIInfo(@RequestBody Map<String, String> request) {
        try {
            String placeName = request.get("placeName");

            if (placeName == null || placeName.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "placeName is required"));
            }

            Map<String, Object> placeInfo = geminiPlaceService.getPlaceInformation(placeName);
            return ResponseEntity.ok(placeInfo);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch place information: " + e.getMessage()));
        }
    }
}
