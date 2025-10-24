package com.travelGuide.travelGuide.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.travelGuide.travelGuide.model.TopVisitedByMonth;

public interface TopVisitedPlaceByMonthRepository extends JpaRepository<TopVisitedByMonth, Integer>{

	@Query(value="select * from {h-schema}top_visited_by_month where month=?1", nativeQuery=true)
	List<TopVisitedByMonth> findByMonth(String month);
	
}
