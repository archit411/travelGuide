package com.travelGuide.travelGuide;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class TravelGuideApplication {

	public static void main(String[] args) {
		
<<<<<<< HEAD
		Dotenv dotenv = Dotenv.load();
=======
		Dotenv dotenv = Dotenv.configure()
			    .ignoreIfMissing()  // ✅ avoids crash if .env not found
			    .load();

>>>>>>> f0e2c030965a38f1fcabd0422a137e4e895e57aa

        // Set env variables so Spring can read them
        dotenv.entries().forEach(entry ->
            System.setProperty(entry.getKey(), entry.getValue())
        );
        
		SpringApplication.run(TravelGuideApplication.class, args);
	}

}