package com.travelGuide.travelGuide.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travelGuide.travelGuide.model.SignUpModel;

@Repository
public interface LoginSignUpRepository extends JpaRepository<SignUpModel, Integer>{

	SignUpModel findByEmailId(String email);
	
	SignUpModel findByMsisdn(String msisdn);
	
}
