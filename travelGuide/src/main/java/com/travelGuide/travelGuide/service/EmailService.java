package com.travelGuide.travelGuide.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.resend.com")
            .defaultHeader("Content-Type", "application/json")
            .build();

    public void sendOtpEmail(String email, String otp) {
        String htmlContent = "<h3>Your TravelGuide OTP is: <strong>" + otp + "</strong></h3>"
                + "<p>This OTP will expire in 5 minutes.</p>";

        Map<String, Object> requestBody = Map.of(
                "from", "TravelGuide <onboarding@resend.dev>",
                "to", email,
                "subject", "Your TravelGuide OTP Code",
                "html", htmlContent
        );

        try {
            String response = webClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + resendApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("✅ OTP Email sent successfully: " + response);
        } catch (Exception e) {
            System.err.println("❌ Failed to send OTP Email: " + e.getMessage());
        }
    }
}
