package com.travelGuide.travelGuide.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.*;

@Service
public class GeminiPlaceService {

  private final Logger log = LoggerFactory.getLogger(GeminiPlaceService.class);

  private final WebClient.Builder webClientBuilder;
  private final ObjectMapper objectMapper;

  @Autowired
  private RedisService redisService;

  @Value("${gemini.api.key}")
  private String geminiApiKey;

  private static final String GEMINI_MODEL = "gemini-2.5-flash";
  private static final String CACHE_PREFIX = "place_ai_info:";
  private static final long CACHE_TTL_HOURS = 24;

  public GeminiPlaceService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
    this.webClientBuilder = webClientBuilder;
    this.objectMapper = objectMapper;
  }

  public Map<String, Object> getPlaceInformation(String placeName) {
    try {
      // Check cache first
      String cacheKey = CACHE_PREFIX + placeName.toLowerCase().trim();
      Map<String, Object> cached = redisService.getObject(cacheKey, Map.class);
      if (cached != null) {
        log.info("Returning cached AI info for: {}", placeName);
        return cached;
      }

      // Generate new AI response
      log.info("Generating AI info for: {}", placeName);
      String prompt = buildPlacePrompt(placeName);
      String response = callGeminiAPI(prompt);
      Map<String, Object> placeInfo = parseGeminiResponse(response, placeName);

      // Cache the response
      redisService.setObject(cacheKey, placeInfo, CACHE_TTL_HOURS * 3600); // 24 hours in seconds

      return placeInfo;
    } catch (Exception e) {
      log.error("Failed to get place information for: " + placeName, e);
      return createErrorResponse(placeName, e.getMessage());
    }
  }

  private String buildPlacePrompt(String placeName) {
    return String.format("""
        You are an expert travel guide with deep knowledge of destinations worldwide.

        Provide comprehensive information about %s in JSON format.

        REQUIREMENTS:
        1. Include REAL, SPECIFIC names - no generic suggestions
        2. Focus on budget-friendly options with good ratings
        3. Include practical details like approximate costs
        4. Provide diverse options (luxury, mid-range, budget)

        OUTPUT FORMAT (STRICT JSON, NO MARKDOWN):
        {
          "placeName": "%s",
          "overview": "Brief 2-3 sentence overview of this destination",
          "placesToVisit": [
            {
              "name": "Specific attraction name",
              "description": "Why visit? What makes it special?",
              "estimatedCost": "₹500 or Free",
              "bestTime": "Morning/Evening/Anytime",
              "rating": 4.5
            }
          ],
          "hotels": [
            {
              "name": "Specific hotel name",
              "description": "Brief description, amenities",
              "priceRange": "₹2000-3000 per night",
              "rating": 4.2,
              "budgetCategory": "Budget/Mid-Range/Luxury",
              "location": "Area/neighborhood"
            }
          ],
          "restaurants": [
            {
              "name": "Specific restaurant name",
              "cuisine": "Type of cuisine",
              "description": "What to try, ambiance",
              "priceRange": "₹300-500 for two",
              "rating": 4.3,
              "mustTry": "Signature dish"
            }
          ]
        }

        IMPORTANT:
        - Include 5-8 places to visit
        - Include 6-8 hotels (mix of budget, mid-range, luxury)
        - Include 6-8 restaurants (various cuisines and price points)
        - All names must be REAL establishments
        - Return ONLY valid JSON, no markdown formatting
        """, placeName, placeName);
  }

  private String callGeminiAPI(String prompt) {
    if (geminiApiKey == null || geminiApiKey.isEmpty()) {
      throw new RuntimeException("Gemini API key is missing.");
    }

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

  private Map<String, Object> parseGeminiResponse(String response, String placeName) {
    try {
      JsonNode root = objectMapper.readTree(response);

      JsonNode textNode = root.path("candidates")
          .get(0)
          .path("content")
          .path("parts")
          .get(0)
          .path("text");

      String rawText = textNode.asText();

      // Clean up markdown formatting if present
      String jsonText = rawText
          .replace("```json", "")
          .replace("```", "")
          .trim();

      // Parse the JSON
      JsonNode parsed = objectMapper.readTree(jsonText);

      // Convert to Map
      @SuppressWarnings("unchecked")
      Map<String, Object> result = objectMapper.convertValue(parsed, Map.class);

      return result;

    } catch (Exception e) {
      log.error("Failed to parse Gemini response", e);
      return createErrorResponse(placeName, "Failed to parse AI response");
    }
  }

  private Map<String, Object> createErrorResponse(String placeName, String errorMessage) {
    Map<String, Object> error = new HashMap<>();
    error.put("placeName", placeName);
    error.put("overview", "Unable to fetch information at this time. Please try again later.");
    error.put("error", errorMessage);
    error.put("placesToVisit", new ArrayList<>());
    error.put("hotels", new ArrayList<>());
    error.put("restaurants", new ArrayList<>());
    return error;
  }
}
