package com.travelGuide.travelGuide;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableCaching
public class TravelGuideApplication {

	public static void main(String[] args) {

		// Load .env file
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();

		// If not found in current directory, try parent directory
		if (dotenv.entries().isEmpty()) {
			dotenv = Dotenv.configure()
					.directory("../")
					.ignoreIfMissing()
					.load();
		}

		// Set env variables so Spring can read them
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

		System.out.println("Loaded " + dotenv.entries().size() + " environment variables.");

		SpringApplication.run(TravelGuideApplication.class, args);
	}

}