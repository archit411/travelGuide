package com.travelGuide.travelGuide.service;

import java.util.List;
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
			
			List<UserProfile> userProfile = userProfileRepository.findByEmailIdOrMsisdn(identifier, identifier);
			if(userProfile.isEmpty()) {
				
				List<SignUpModel> model = loginSignUpRepository.findByEmailIdOrMsisdn(identifier, identifier);
				if(model.isEmpty()) {
					response = new BaseResponse<UserProfileRespBody>();
					response.setDescription("profile not found");
					response.setStatus("FAILURE");
					response.setStatusCode("106");

					return response;
				}else {
					UserProfile profile = new UserProfile();
					profile.setfName(model.get(0).getfName());
					profile.setlName(model.get(0).getlName());
					profile.setMsisdn(model.get(0).getMsisdn());
					profile.setUsername(model.get(0).getUsername());
					profile.setCity(null);
					profile.setCountry(null);
					profile.setGender(null);
					profile.setEmailId(null);
					profile.setState(null);
					
					userProfileRepository.save(profile);
					
					UserProfileRespBody resp = new UserProfileRespBody();
					resp.setfName(userProfile.get(0).getfName());
					resp.setlName(userProfile.get(0).getlName());
					resp.setUsername(userProfile.get(0).getUsername());
					resp.setMsisdn(userProfile.get(0).getMsisdn());
					
					response = new BaseResponse<UserProfileRespBody>();
					response.setData(resp);
					response.setDescription("user details fetched");
					response.setStatus("SUCCESS");
					response.setStatusCode("100");
				}
				
			}
			
			UserProfileRespBody resp = new UserProfileRespBody();
			resp.setEmailId(userProfile.get(0).getEmailId());
			resp.setfName(userProfile.get(0).getfName());
			resp.setlName(userProfile.get(0).getlName());
			resp.setUsername(userProfile.get(0).getUsername());
			resp.setCity(userProfile.get(0).getCity());
			resp.setCountry(userProfile.get(0).getCountry());
			resp.setGender(userProfile.get(0).getGender());
			resp.setState(userProfile.get(0).getState());
			resp.setMsisdn(userProfile.get(0).getMsisdn());
			
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
