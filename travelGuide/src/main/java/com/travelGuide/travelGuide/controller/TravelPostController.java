package com.travelGuide.travelGuide.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.travelGuide.travelGuide.Pojo.TravelPostReqBody;
import com.travelGuide.travelGuide.Pojo.TravelPostRespBody;
import com.travelGuide.travelGuide.jwt.JwtUtil;
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
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public TravelPostRespBody uploadTravelPost(@RequestParam("caption") String caption,
	        @RequestParam("crowdLevel") String crowdLevel,
	        @RequestParam("destination") String destination,
	        @RequestParam("temprature") String temprature,
	        @RequestParam("userRating") double userRating,
	        @RequestParam("image") MultipartFile image,
	        @RequestParam("username")String username ,
	        @RequestHeader("Authorization") String authHeader) {
		
		TravelPostRespBody postResponse = null;
		
		try {
			
			String token = authHeader.substring(7); // remove "Bearer "
		    String msisdn = jwtUtil.extractUsername(token); //extracting msisdn from token
		    
			
			//this will create the image url
			String imageFileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
			
			//create the image upload url
			String uploadUrl = SUPABASE_URL + "/storage/v1/object/" + SUPABASE_BUCKET + "/" + imageFileName;
			
			//create the put request to save image in supabase bucket 
			HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrl)) //set the target url
                    .header("Authorization", "Bearer " + SUPABASE_API_KEY) //authenticate backend with supabase api key
                    .header("Content-Type", image.getContentType()) //image content type
                    .PUT(HttpRequest.BodyPublishers.ofByteArray(image.getBytes())) //create put request with image byte
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
            post.setCaption(caption);
            post.setCreatedOn(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))); //26/10/25 20:52	
            post.setCrowdLevel(crowdLevel);
            post.setDestination(destination);
            post.setImageUrl(publicImageUrl);
            post.setTemperature(temprature);
            post.setmsisdn(msisdn);
            post.setUserRating(userRating);
            post.setUsername(username);
            
            TravelPost updatedRow = travelPostRepository.save(post);
            
            postResponse = new TravelPostRespBody();
            postResponse.setCaption(updatedRow.getCaption());
            postResponse.setCreatedOn(updatedRow.getCreatedOn());
            postResponse.setCrowdLevel(updatedRow.getCrowdLevel());
            postResponse.setDestination(updatedRow.getDestination());
            postResponse.setImage(updatedRow.getImageUrl());
            postResponse.setStatus("SUCCESS");
            postResponse.setTemprature(updatedRow.getTemperature());
            postResponse.setMsisdn(updatedRow.getmsisdn());
            postResponse.setUserRating(updatedRow.getUserRating());
            postResponse.setUsername(updatedRow.getUsername());
            
			return postResponse;
		}catch(Exception e) {
			e.printStackTrace();
			postResponse = new TravelPostRespBody();
			return postResponse;
		}
	}
	@PostMapping("/getUserPosts")
	public List<TravelPostRespBody> getUserPosts(@RequestHeader("Authorization") String authHeader) {
	    List<TravelPostRespBody> responseList = new ArrayList<>();
	    try {
	        String token = authHeader.substring(7);
	        String msisdn = jwtUtil.extractUsername(token);

	        List<TravelPost> posts = travelPostRepository.findByMsisdnOrderByCreatedOnDesc(msisdn);

	        for (TravelPost post : posts) {
	            TravelPostRespBody resp = new TravelPostRespBody();
	            resp.setCaption(post.getCaption());
	            resp.setCreatedOn(post.getCreatedOn());
	            resp.setCrowdLevel(post.getCrowdLevel());
	            resp.setDestination(post.getDestination());
	            resp.setImage(post.getImageUrl());
	            resp.setTemprature(post.getTemperature());
	            resp.setMsisdn(post.getmsisdn());
	            resp.setUserRating(post.getUserRating());
	            resp.setUsername(post.getUsername());
	            resp.setStatus("SUCCESS");
	            responseList.add(resp);
	        }

	        return responseList;

	    } catch (Exception e) {
	        e.printStackTrace();
	        return responseList;
	    }
	}

	
}
