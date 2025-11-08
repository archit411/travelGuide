package com.travelGuide.travelGuide.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.travelGuide.travelGuide.model.SignUpModel;
import com.travelGuide.travelGuide.model.UserProfile;

import jakarta.transaction.Transactional;

@Repository
public interface LoginSignUpRepository extends JpaRepository<SignUpModel, Integer>{

	SignUpModel findByEmailId(String email);
	
	SignUpModel findByMsisdn(String msisdn);
	
	List<SignUpModel> findByEmailIdOrMsisdn(String email , String msisdn);
	
	@Modifying
	@Transactional
	@Query(value="update sign_up_model set password=?2 where email_id=?1",nativeQuery=true)
	int updatePassword(String emailId , String newPass);
}
