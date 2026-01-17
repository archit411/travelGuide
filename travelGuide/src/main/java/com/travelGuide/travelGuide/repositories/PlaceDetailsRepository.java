package com.travelGuide.travelGuide.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.travelGuide.travelGuide.model.PlaceDetailsModel;

@Repository
public interface PlaceDetailsRepository extends JpaRepository<PlaceDetailsModel, Integer>{
	
	@Query(value="select * from {h-schema}places where id=?1",nativeQuery=true)
	public PlaceDetailsModel getAllById(int id);
	
}
