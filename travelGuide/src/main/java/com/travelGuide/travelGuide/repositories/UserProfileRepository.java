package com.travelGuide.travelGuide.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.travelGuide.travelGuide.model.UserProfile;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Integer>{

	@Query(value="select * from user_profile where msisdn=?1",nativeQuery =true)
	UserProfile findByMsisdn(String msisdn);
	
	@Query(value="select * from user_profile where email_id=?1",nativeQuery =true)
	UserProfile findByEmailId(String emailId);
		
	Optional<UserProfile> findByEmailIdOrMsisdn(String email , String msisdn);
	
}

