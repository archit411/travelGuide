package com.travelGuide.travelGuide.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelGuide.travelGuide.Pojo.TravelPostReqBody;
import com.travelGuide.travelGuide.Pojo.TravelPostRespBody;
import com.travelGuide.travelGuide.model.TravelPost;
import com.travelGuide.travelGuide.repositories.TravelPostRepository;

@RestController
@RequestMapping("/api/travel")
public class TravelPostController {

	@Autowired
	private TravelPostRepository travelPostRepository;
	
	@Value("${supabase.url}")
	private String SUPABASE_URL;

	@Value("${supabase.bucket}")
	private String SUPABASE_BUCKET;

	@Value("${supabase.key}")
	private String SUPABASE_API_KEY;
	
	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public TravelPostRespBody uploadTravelPost(@RequestBody TravelPostReqBody travelPostRequest) {
		
		TravelPostRespBody postResponse = null;
		
		try {
			
			//this will create the image url
			String imageFileName = UUID.randomUUID() + "_" + travelPostRequest.getImage().getOriginalFilename();
			
			//create the image upload url
			String uploadUrl = SUPABASE_URL + "/storage/v1/object/" + SUPABASE_BUCKET + "/" + imageFileName;
			
			//create the put request to save image in supabase bucket 
			HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrl)) //set the target url
                    .header("Authorization", "Bearer " + SUPABASE_API_KEY) //authenticate backend with supabase api key
                    .header("Content-Type", travelPostRequest.getImage().getContentType()) //image content type
                    .PUT(HttpRequest.BodyPublishers.ofByteArray(travelPostRequest.getImage().getBytes())) //create put request with image byte
                    .build(); //finalize the request
            
            //actually send the put request to save image in supabse bucket
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            //check if the image gets saved successfully
            if (response.statusCode() != 200 && response.statusCode() != 201) {
            	postResponse = new TravelPostRespBody();
            	postResponse.setStatus("image upload failed");
            	return postResponse;
            }
            
            //get the image url from supabase to save in db and access it by public url 
            String publicImageUrl = SUPABASE_URL + "/storage/v1/object/public/" + SUPABASE_BUCKET + "/" + imageFileName;
            
            TravelPost post = new TravelPost();
            post.setCaption(travelPostRequest.getCaption());
            post.setCreatedOn(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))); //26/10/25 20:52	
            post.setCrowdLevel(travelPostRequest.getCrowdLevel());
            post.setDestination(travelPostRequest.getDestination());
            post.setImageUrl(publicImageUrl);
            post.setTemperature(travelPostRequest.getTemprature());
            post.setUsername(travelPostRequest.getUsername());
            post.setUserRating(travelPostRequest.getUserRating());
            
            TravelPost updatedRow = travelPostRepository.save(post);
            
            postResponse = new TravelPostRespBody();
            postResponse.setCaption(updatedRow.getCaption());
            postResponse.setCreatedOn(updatedRow.getCreatedOn());
            postResponse.setCrowdLevel(updatedRow.getCrowdLevel());
            postResponse.setDestination(updatedRow.getDestination());
            postResponse.setImage(updatedRow.getImageUrl());
            postResponse.setStatus("SUCCESS");
            postResponse.setTemprature(updatedRow.getTemperature());
            postResponse.setUsername(updatedRow.getUsername());
            postResponse.setUserRating(updatedRow.getUserRating());
            
			return postResponse;
		}catch(Exception e) {
			e.printStackTrace();
			postResponse = new TravelPostRespBody();
			return postResponse;
		}
	}
	
}
