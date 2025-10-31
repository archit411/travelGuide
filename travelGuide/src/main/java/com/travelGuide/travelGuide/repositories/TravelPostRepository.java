package com.travelGuide.travelGuide.repositories;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travelGuide.travelGuide.model.TravelPost;

@Repository
public interface TravelPostRepository extends JpaRepository<TravelPost, Integer>{
	 List<TravelPost> findByMsisdnOrderByCreatedOnDesc(String msisdn);
}
