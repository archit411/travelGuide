package com.travelGuide.travelGuide.controller;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelGuide.travelGuide.Pojo.TopVisitedPlacesByMonthReqBody;
import com.travelGuide.travelGuide.Pojo.TopVisitedPlacesByMonthRespBody;
import com.travelGuide.travelGuide.service.TopVisiitedPlacesByMonthService;

@RequestMapping("/api")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TopVisitedPlaceByMonthController {
	
	@Autowired
	private TopVisiitedPlacesByMonthService topVisiitedPlacesByMonthService;

	@PostMapping("/addTopVisitedPlaceByMonth")
	public TopVisitedPlacesByMonthRespBody addTopVisitedPlaceByMonth(@RequestBody TopVisitedPlacesByMonthReqBody request) {
		TopVisitedPlacesByMonthRespBody response = null;
		try {
			if(request!=null) {
				response = topVisiitedPlacesByMonthService.addTopVisitedPlacesByMonth(request);
			}else {
				response = new TopVisitedPlacesByMonthRespBody();
			}
			return response;
		}catch(Exception e) {
			e.printStackTrace();
			response = new TopVisitedPlacesByMonthRespBody();
			return response;
		}
	}
	
	@PostMapping("/getTopPlacesByMonth")
	public List<TopVisitedPlacesByMonthRespBody> getTopVisitedPlaceByMonth() {
		TopVisitedPlacesByMonthRespBody response = null;
		List<TopVisitedPlacesByMonthRespBody> responseList = new ArrayList<>();
		try {
			
			LocalDate today = LocalDate.now();
			String month = today.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH).toLowerCase();
			
			if(month!=null) {
				responseList = topVisiitedPlacesByMonthService.getTopVisitedPlaceByMonth(month);
			}else {
				responseList.add(response);
				return responseList;
			}
			return responseList;
		}catch(Exception e) {
			e.printStackTrace();
			responseList.add(response);
			return responseList;
		}		
	}
	
	@PostMapping("/getTopPlacesByMonth/{month}")
	public List<TopVisitedPlacesByMonthRespBody> getTopVisitedPlaceByMonth(@PathVariable String month) {
		TopVisitedPlacesByMonthRespBody response = null;
		List<TopVisitedPlacesByMonthRespBody> responseList = new ArrayList<>();
		try {
			
			if(month!=null) {
				responseList = topVisiitedPlacesByMonthService.getTopVisitedPlaceByMonth(month.toLowerCase());
			}else {
				responseList.add(response);
				return responseList;
			}
			return responseList;
		}catch(Exception e) {
			e.printStackTrace();
			responseList.add(response);
			return responseList;
		}		
	}
	
}
