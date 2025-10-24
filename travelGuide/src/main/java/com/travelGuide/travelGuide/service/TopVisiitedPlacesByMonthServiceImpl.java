package com.travelGuide.travelGuide.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelGuide.travelGuide.Pojo.TopVisitedPlacesByMonthReqBody;
import com.travelGuide.travelGuide.Pojo.TopVisitedPlacesByMonthRespBody;
import com.travelGuide.travelGuide.model.TopVisitedByMonth;
import com.travelGuide.travelGuide.repositories.TopVisitedPlaceByMonthRepository;

@Service
public class TopVisiitedPlacesByMonthServiceImpl implements TopVisiitedPlacesByMonthService{
	
	@Autowired
	private TopVisitedPlaceByMonthRepository repository;
	
	@Override
	public TopVisitedPlacesByMonthRespBody addTopVisitedPlacesByMonth(TopVisitedPlacesByMonthReqBody request) {
		TopVisitedPlacesByMonthRespBody response = null;
		try {
			if(request!=null) {
				TopVisitedByMonth addEntry = new TopVisitedByMonth();
				addEntry.setMonth(request.getMonth());
				addEntry.setPlaceOne(request.getPlaceOne());
				addEntry.setPlaceTwo(request.getPlaceTwo());
				addEntry.setPlaceOneDescription(request.getPlaceOneDescription());
				addEntry.setPlaceTwoDescription(request.getPlaceTwoDescription());
				addEntry.setRegion(request.getRegion());
				addEntry.setWeather(request.getWeather());
				
				TopVisitedByMonth newEntry = repository.save(addEntry);
				if(newEntry!=null) {
					response = new TopVisitedPlacesByMonthRespBody();
					
					response.setMonth(newEntry.getMonth());
					response.setPlaceOne(newEntry.getPlaceOne());
					response.setPlaceOneDescription(newEntry.getPlaceOneDescription());
					response.setPlaceTwo(newEntry.getPlaceTwo());
					response.setPlaceTwoDescription(newEntry.getPlaceTwoDescription());
					response.setRegion(newEntry.getRegion());
					response.setWeather(newEntry.getWeather());
				}
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
	
	@Override
	public List<TopVisitedPlacesByMonthRespBody> getTopVisitedPlaceByMonth(String month) {
		TopVisitedPlacesByMonthRespBody response = null;
		List<TopVisitedPlacesByMonthRespBody> responseList = new ArrayList<>();
		try {
			if(month!=null) {
				List<TopVisitedByMonth> findByMonth = repository.findByMonth(month);
				for(TopVisitedByMonth entry : findByMonth) {
					response = new TopVisitedPlacesByMonthRespBody();
					
					response.setMonth(entry.getMonth());
					response.setPlaceOne(entry.getPlaceOne());
					response.setPlaceOneDescription(entry.getPlaceOneDescription());
					response.setPlaceTwo(entry.getPlaceTwo());
					response.setPlaceTwoDescription(entry.getPlaceTwoDescription());
					response.setRegion(entry.getRegion());
					response.setWeather(entry.getWeather());
					
					responseList.add(response);
				}
			}else {
				responseList.add(response);
			}
			return responseList;
		}catch(Exception e) {
			e.printStackTrace();
			responseList.add(response);
			return responseList;
		}
	}


}
