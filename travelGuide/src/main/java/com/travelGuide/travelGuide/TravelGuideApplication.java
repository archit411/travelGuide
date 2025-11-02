package com.travelGuide.travelGuide;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class TravelGuideApplication {

	public static void main(String[] args) {
		
		Dotenv dotenv = Dotenv.load();

        // Set env variables so Spring can read them
        dotenv.entries().forEach(entry ->
            System.setProperty(entry.getKey(), entry.getValue())
        );
        
		SpringApplication.run(TravelGuideApplication.class, args);
	}

}