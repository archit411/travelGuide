package com.travelGuide.travelGuide.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelGuide.travelGuide.Pojo.ItineraryResponseDTO;
import com.travelGuide.travelGuide.Pojo.TripRequestDTO;
import com.travelGuide.travelGuide.model.TripItinerary;
import com.travelGuide.travelGuide.repositories.TripItineraryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.*;

//Testing
@Service
public class TripItineraryService {

    private final Logger log = LoggerFactory.getLogger(TripItineraryService.class);

    private final TripItineraryRepository repo;
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String GEMINI_MODEL = "gemini-2.5-flash";

    public TripItineraryService(
            TripItineraryRepository repo,
            WebClient.Builder webClientBuilder,
            ObjectMapper objectMapper) {
        this.repo = repo;
        this.webClientBuilder = webClientBuilder;
        this.objectMapper = objectMapper;
    }

    public ItineraryResponseDTO generateItinerary(TripRequestDTO req) {
        try {
            String prompt = buildPrompt(req);
            String response = callGeminiAPI(prompt);
            return parseGeminiResponse(response, req);
        } catch (Exception e) {
            log.error("Itinerary generation failed", e);
            throw new RuntimeException("Failed to generate itinerary: " + e.getMessage());
        }
    }

    private String buildPrompt(TripRequestDTO req) {
        String flightInstruction = req.isIncludeFlights()
                ? String.format(
                        "- Flight Info: INCLUDE round-trip flight per person cost estimate from %s in the total cost. Suggest best airlines/routes.",
                        req.getOriginCity())
                : "- Flight Info: Do NOT include flight costs. Ground transport only.";

        return String.format(
                """
                        You are an expert elite travel planner with decades of experience crafting personalized, distinct, and practical itineraries.

                        YOUR TASK:
                        Create a detailed, day-by-day %d-day itinerary for a trip to %s for %d people.

                        TRIP DETAILS:
                        - Travel Style: %s (Focus on this style heavily)
                        - Budget Level: %s (Select dining/activities that match this)
                        - Starting Date: %s
                        - Crowd Preference: %s
                        - Preferred Transport: %s
                        %s

                        ESSENTIAL REQUIREMENTS:
                        1. **Real & Specific**: specific restaurant names, real hotel/activity names. No generic suggestions like "Eat at a local restaurant".
                        2. **Logically Ordered**: Group activities geographically to minimize travel time.
                        3. **Hidden Gems**: Include at least one "hidden gem" or offbeat location per day that fits the theme.
                        4. **Practicality**: Include travel times between locations and estimated costs.
                        5. **Costing**: %s

                        OUTPUT FORMAT:
                        Return ONLY valid JSON. No markdown formatting (no ```json ... ```).

                        JSON STRUCTURE:
                        {
                          "tripTitle": "Creative Title for %s Trip",
                          "summary": "A captivating 2-3 sentence summary of what this trip feels like.",
                          "days": [
                            {
                              "day": 1,
                              "date": "<yyyy-mm-dd>",
                              "theme": "<Short theme, e.g., Heritage Walk & Local Flavors>",
                              "dailyEstimatedCost": "₹<amount>",
                              "activities": [
                                {
                                  "time": "09:00 AM",
                                  "activity": "<Name of Place/Activity>",
                                  "description": "<Engaging description, 1-2 sentences. Why go here?>",
                                  "location": "<Exact Name, City>",
                                  "mapsLink": "https://www.google.com/maps/search/?api=1&query=<URL_ENCODED_NAME>",
                                  "restaurant": "<Scanning for... recommended nearby restaurant for lunch/dinner>",
                                  "recommendedDish": "<Specific dish to try here>",
                                  "travelTime": "<e.g. 15 mins from previous location>",
                                  "estimatedCost": "₹<cost for group>",
                                  "notes": "<Practical tip, e.g. 'Book tickets in advance', 'Best sunset view'>"
                                }
                              ]
                            }
                          ],
                          "totalEstimatedCost": "₹<Total Trip Cost (breakdown optional)>",
                          "importantTips": [
                             "Specific tip about local scams or safety",
                             "Best transport app to use in this city",
                             "Cultural etiquette tip"
                          ],
                          "packingList": [
                             "Item 1", "Item 2", "Item 3", "Item 4", "Item 5"
                          ]
                        }
                        """,
                req.getDuration(),
                req.getDestination(),
                req.getPeople(),
                req.getInterests(),
                req.getBudget(),
                req.getStartDate(),
                req.getCrowdLevel(),
                req.getTransport(),
                flightInstruction,
                req.isIncludeFlights() ? "Total cost MUST include estimated flights from " + req.getOriginCity()
                        : "Total cost is for ground expenses only (hotels, food, activities, internal transport).",
                req.getDestination());
    }

    private String callGeminiAPI(String prompt) {

        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            throw new RuntimeException("Gemini API key is missing.");
        }

        log.info("Sending request to Google Gemini...");

        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + GEMINI_MODEL
                + ":generateContent?key="
                + geminiApiKey;

        WebClient webClient = webClientBuilder.build();

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)))));

        try {
            return webClient.post()
                    .uri(url)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(
                            status -> !status.is2xxSuccessful(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(err -> Mono.error(new RuntimeException("Gemini API error: " + err))))
                    .bodyToMono(String.class)
                    .block(Duration.ofSeconds(60));

        } catch (Exception e) {
            log.error("Gemini API call failed", e);
            throw new RuntimeException("Google Gemini API call failed: " + e.getMessage());
        }
    }

    private ItineraryResponseDTO parseGeminiResponse(String response, TripRequestDTO req) {

        log.info("Parsing Gemini response...");

        ItineraryResponseDTO dto = new ItineraryResponseDTO();
        dto.setDestination(req.getDestination());
        dto.setDuration(req.getDuration());
        dto.setTripTitle(req.getDestination() + " Trip (" + req.getDuration() + " Days)");
        dto.setCrowdLevel(req.getCrowdLevel());
        dto.setRawModelResponse(response);

        try {
            JsonNode root = objectMapper.readTree(response);

            JsonNode textNode = root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String rawText = textNode.asText();

            String jsonText = rawText
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            JsonNode parsed = objectMapper.readTree(jsonText);

            dto.setSummary(parsed.path("summary").asText("No summary"));
            dto.setTotalEstimatedCost(parsed.path("totalEstimatedCost").asText("N/A"));

            dto.setDays(parsed.has("days") ? objectMapper.convertValue(parsed.get("days"), List.class)
                    : new ArrayList<>());

        } catch (Exception e) {
            log.error("JSON PARSE FAILED", e);
            dto.setSummary("Could not parse itinerary. Raw text: " + response);
            dto.setDays(new ArrayList<>());
        }

        return dto;
    }

    public TripItinerary saveItinerary(TripItinerary it) {
        if (it.getId() == null)
            it.setId(UUID.randomUUID());
        return repo.save(it);
    }

    public List<TripItinerary> getMyTrips(String userId) {
        return repo.findByUserId(userId);
    }

    public TripItinerary getTrip(UUID id) {
        return repo.findById(id).orElse(null);
    }

    public void deleteTrip(UUID id) {
        repo.deleteById(id);
    }
}
