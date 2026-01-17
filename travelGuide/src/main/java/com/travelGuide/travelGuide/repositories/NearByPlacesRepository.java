package com.travelGuide.travelGuide.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.travelGuide.travelGuide.model.NearByPlacesModel;

@Repository
public interface NearByPlacesRepository extends JpaRepository<NearByPlacesModel, Integer>{

	@Query(value="select * from {h-schema}near_by_places where place_id=?1",nativeQuery=true)
	public List<NearByPlacesModel> getAllByPlaceId(int place_id);
	
}

