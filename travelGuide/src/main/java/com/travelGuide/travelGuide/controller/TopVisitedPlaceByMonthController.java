package com.travelGuide.travelGuide.controller;

import java.util.ArrayList;
import java.util.List;

import org.aspectj.util.LangUtil.StringChecker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travelGuide.travelGuide.Pojo.TopVisitedPlacesByMonthReqBody;
import com.travelGuide.travelGuide.Pojo.TopVisitedPlacesByMonthRespBody;
import com.travelGuide.travelGuide.model.TopVisitedByMonth;
import com.travelGuide.travelGuide.service.TopVisiitedPlacesByMonthService;

@RequestMapping("/api")
@RestController
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
	public List<TopVisitedPlacesByMonthRespBody> getTopVisitedPlaceByMonth(@RequestParam String month) {
		TopVisitedPlacesByMonthRespBody response = null;
		List<TopVisitedPlacesByMonthRespBody> responseList = new ArrayList<>();
		try {
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
	
}
