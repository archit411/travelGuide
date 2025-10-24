package com.travelGuide.travelGuide.service;

import java.util.List;

import com.travelGuide.travelGuide.Pojo.TopVisitedPlacesByMonthReqBody;
import com.travelGuide.travelGuide.Pojo.TopVisitedPlacesByMonthRespBody;

public interface TopVisiitedPlacesByMonthService {

	public TopVisitedPlacesByMonthRespBody addTopVisitedPlacesByMonth(TopVisitedPlacesByMonthReqBody request);
	
	public List<TopVisitedPlacesByMonthRespBody> getTopVisitedPlaceByMonth(String month);
	
}
