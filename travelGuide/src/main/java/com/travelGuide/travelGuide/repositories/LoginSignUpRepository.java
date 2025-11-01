package com.travelGuide.travelGuide.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travelGuide.travelGuide.model.SignUpModel;
import com.travelGuide.travelGuide.model.UserProfile;

@Repository
public interface LoginSignUpRepository extends JpaRepository<SignUpModel, Integer>{

	SignUpModel findByEmailId(String email);
	
	SignUpModel findByMsisdn(String msisdn);
	
	List<SignUpModel> findByEmailIdOrMsisdn(String email , String msisdn);
}
