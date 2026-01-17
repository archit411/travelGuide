package com.travelGuide.travelGuide.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.travelGuide.travelGuide.model.ThingsToDoModel;

@Repository
public interface ThingsToDoRepository extends JpaRepository<ThingsToDoModel, Integer>{
	
	@Query(value="select * from {h-schema}things_to_do where place_id=?1",nativeQuery=true)
	public List<ThingsToDoModel> getAllByPlaceId(int place_id);
}
