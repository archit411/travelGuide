package com.travelGuide.travelGuide.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelGuide.travelGuide.Pojo.BaseResponse;
import com.travelGuide.travelGuide.Pojo.UserProfileReqBody;
import com.travelGuide.travelGuide.Pojo.UserProfileRespBody;
import com.travelGuide.travelGuide.model.SignUpModel;
import com.travelGuide.travelGuide.model.UserProfile;
import com.travelGuide.travelGuide.repositories.LoginSignUpRepository;
import com.travelGuide.travelGuide.repositories.UserProfileRepository;

@Service
public class UserProfileServiceImpl implements UserProfileService {

	@Autowired
	private UserProfileRepository userProfileRepository;

	@Autowired
	private LoginSignUpRepository loginSignUpRepository;

	public BaseResponse saveUserDetails(String emailId) {
		BaseResponse response = null;
		try {
			if (emailId == null || emailId.trim().isEmpty()) {
				response = new BaseResponse();
				response.setDescription("emailId is null");
				response.setStatus("FAILURE");
				response.setStatusCode("106");

				return response;
			}

			UserProfile userProfile = userProfileRepository.findByEmailId(emailId);
			if (userProfile != null) {
				response = new BaseResponse();
				response.setDescription("already have entry for this emailId");
				response.setStatus("SUCCESS");
				response.setStatusCode("100");

				return response;
			}

			SignUpModel model = loginSignUpRepository.findByEmailId(emailId);
			if (model == null) {
				response = new BaseResponse();
				response.setDescription("sign up details not found");
				response.setStatus("FAILURE");
				response.setStatusCode("106");

				return response;
			}

			UserProfile user = new UserProfile();
			user.setEmailId(model.getEmailId());
			user.setfName(model.getfName());
			user.setlName(model.getlName());
			user.setUsername(model.getUsername());

			userProfileRepository.save(user);
			response = new BaseResponse();
			response.setDescription("User Details Saved");
			response.setStatus("SUCCESS");
			response.setStatusCode("100");

			return response;

		} catch (Exception e) {
			e.printStackTrace();
			return response;
		}
	}
	
	public BaseResponse<UserProfileRespBody> getLoggedInUsrDetails(String identifier){
		
		BaseResponse<UserProfileRespBody> response = null;
		try {
			
			if(identifier==null || identifier.trim().isEmpty()) {
				response = new BaseResponse<UserProfileRespBody>();
				response.setDescription("emailId or phone no. not passed");
				response.setStatus("FAILURE");
				response.setStatusCode("106");

				return response;
			}
			
			Optional<UserProfile> userProfile = userProfileRepository.findByEmailIdOrMsisdn(identifier, identifier);
			if(!userProfile.isPresent()) {
				response = new BaseResponse<UserProfileRespBody>();
				response.setDescription("user details not found");
				response.setStatus("FAILURE");
				response.setStatusCode("106");

				return response;
			}
			
			UserProfileRespBody resp = new UserProfileRespBody();
			resp.setEmailId(userProfile.get().getEmailId());
			resp.setfName(userProfile.get().getfName());
			resp.setlName(userProfile.get().getlName());
			resp.setUsername(userProfile.get().getUsername());
			resp.setCity(userProfile.get().getCity());
			resp.setCountry(userProfile.get().getCountry());
			resp.setGender(userProfile.get().getGender());
			resp.setState(userProfile.get().getState());
			resp.setMsisdn(userProfile.get().getMsisdn());
			
			response = new BaseResponse<UserProfileRespBody>();
			response.setData(resp);
			response.setDescription("user details fetched");
			response.setStatus("SUCCESS");
			response.setStatusCode("100");
			
			return response;
		}catch(Exception e) {
			e.printStackTrace();
			return response;
		}
		
	}

}
