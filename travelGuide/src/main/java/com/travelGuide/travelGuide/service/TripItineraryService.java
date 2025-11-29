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
            ObjectMapper objectMapper
    ) {
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
    return String.format("""
            You are a professional travel planner.

            Create a detailed %d-day itinerary for %s for %d people.

            DETAILS:
            - Travel Style: %s
            - Budget: %s
            - Starting Date: %s
            - Crowd Preference: %s
            - Transport: %s

            The itinerary MUST include:
            - Exact times (e.g., 08:30 AM)
            - Restaurant names + 1 recommended dish
            - Google Maps direct link for every place (use "Place Name, City" format)
            - Estimated cost for %d people
            - Travel time between places
            - Short tips & warnings
            - Weather suggestion
            - Best photo spots
            - Optional alternatives

            Return STRICT VALID JSON ONLY with this structure:

            {
              "tripTitle": "%s Trip",
              "summary": "<short overview>",
              "days": [
                {
                  "day": 1,
                  "date": "<yyyy-mm-dd>",
                  "theme": "<day theme>",
                  "activities": [
                    {
                      "time": "08:30 AM",
                      "activity": "Visit Kalaram Temple",
                      "description": "Short description",
                      "location": "Kalaram Temple, Nashik",
                      "mapsLink": "https://www.google.com/maps?q=Kalaram+Temple+Nashik",
                      "recommendedDish": "Poha or Misal Pav",
                      "restaurant": "Sri Samarth Snacks",
                      "travelTime": "20 mins drive",
                      "estimatedCost": "₹300 total",
                      "notes": "Wear comfortable footwear"
                    }
                  ],
                  "dailyEstimatedCost": "₹2000"
                }
              ],
              "totalEstimatedCost": "<total in ₹>",
              "importantTips": [
                "carry water",
                "avoid afternoon heat",
                "book tickets online"
              ],
              "packingList": [
                "sunscreen",
                "sports shoes",
                "power bank"
              ]
            }

            DO NOT add any markdown or code block.
            """,
            req.getDuration(),
            req.getDestination(),
            req.getPeople(),
            req.getInterests(),
            req.getBudget(),
            req.getStartDate(),
            req.getCrowdLevel(),
            req.getTransport(),
            req.getPeople(),
            req.getDestination()
    );
}



    private String callGeminiAPI(String prompt) {

        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            throw new RuntimeException("Gemini API key is missing.");
        }

        log.info("Sending request to Google Gemini...");

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/"
                        + GEMINI_MODEL
                        + ":generateContent?key="
                        + geminiApiKey;

        WebClient webClient = webClientBuilder.build();

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        try {
            return webClient.post()
                    .uri(url)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(
                            status -> !status.is2xxSuccessful(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(err -> Mono.error(new RuntimeException("Gemini API error: " + err)))
                    )
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

        JsonNode textNode =
                root.path("candidates")
                        .get(0)
                        .path("content")
                        .path("parts")
                        .get(0)
                        .path("text");

        String rawText = textNode.asText();

        // ⭐ Clean code blocks
        String jsonText = rawText
                .replace("```json", "")
                .replace("```", "")
                .trim();

        JsonNode parsed = objectMapper.readTree(jsonText);

        dto.setSummary(parsed.path("summary").asText("No summary"));
        dto.setTotalEstimatedCost(parsed.path("totalEstimatedCost").asText("N/A"));

        dto.setDays(parsed.has("days") ?
                objectMapper.convertValue(parsed.get("days"), List.class)
                : new ArrayList<>());

    } catch (Exception e) {
        log.error("JSON PARSE FAILED", e);
        dto.setSummary("Could not parse itinerary. Raw text: " + response);
        dto.setDays(new ArrayList<>());
    }

    return dto;
}




    public TripItinerary saveItinerary(TripItinerary it) {
        if (it.getId() == null) it.setId(UUID.randomUUID());
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
